import { onCall, HttpsError } from "firebase-functions/v2/https";
import { onDocumentWritten } from "firebase-functions/v2/firestore";
import { setGlobalOptions } from "firebase-functions/v2";
import { defineSecret } from "firebase-functions/params";
import * as admin from "firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { generateEmbedding } from "./embeddings.js";
import { buildSearchableContent } from "./propertyUtils.js";

setGlobalOptions({ maxInstances: 10, region: "europe-north1" });

admin.initializeApp();

const db = admin.firestore();

const VECTOR_SEARCH_LIMIT = 10;
const VECTOR_MAX_RESULTS = 3;
const VECTOR_ABSOLUTE_DISTANCE_THRESHOLD = 0.32;
const VECTOR_RELATIVE_DISTANCE_MARGIN = 0.08;
const GEMINI_API_KEY = defineSecret("GEMINI_API_KEY");

type PriceConstraint = {
  value: number;
  inclusive: boolean;
};

type SearchPropertyResult = {
  id: string;
  title: string;
  description: string;
  price: number;
  rating: number;
  superhost: boolean;
  image: string;
  capacity: {
    guest: number;
    bedroom: number;
  };
};

function detectPriceComparator(query: string): PriceConstraint["inclusive"] {
  if (/(<=|=<|≤)/u.test(query)) return true;
  if (/<(?![=])/u.test(query)) return false;

  return true;
}

function extractPriceConstraint(query: string): PriceConstraint | null {
  const currencyCodes = [
    "USD",
    "EUR",
    "NOK",
    "SEK",
    "DKK",
    "PLN",
    "GBP",
    "CHF",
    "CAD",
    "AUD",
    "JPY",
  ];
  const decimalNumber = "\\d+(?:[.,]\\d+)?";
  const codeGroup = `(?:${currencyCodes.join("|")})`;

  const patterns = [
    new RegExp(`(${decimalNumber})\\s*\\p{Sc}`, "u"),
    new RegExp(`\\p{Sc}\\s*(${decimalNumber})`, "u"),
    new RegExp(`(${decimalNumber})\\s*${codeGroup}\\b`, "i"),
    new RegExp(`\\b${codeGroup}\\s*(${decimalNumber})`, "i"),
    new RegExp(`(?:<=|<|=)\\s*(${decimalNumber})`, "u"),
  ];

  for (const pattern of patterns) {
    const match = query.match(pattern);
    if (!match?.[1]) continue;
    const parsed = Number(match[1].replace(",", "."));
    if (Number.isFinite(parsed) && parsed > 0) {
      return {
        value: parsed,
        inclusive: detectPriceComparator(query),
      };
    }
  }

  // Language-agnostic fallback:
  // In rental search, values >= 40 are very likely budget, not guests/bedrooms.
  const fallbackNumbers = [...query.matchAll(/\b(\d{2,5}(?:[.,]\d+)?)\b/g)]
    .map((match) => Number(match[1].replace(",", ".")))
    .filter((value) => Number.isFinite(value) && value >= 40 && value <= 50000);
  if (fallbackNumbers.length > 0) {
    return {
      value: Math.min(...fallbackNumbers),
      inclusive: detectPriceComparator(query),
    };
  }

  return null;
}

function extractCapacityHint(query: string, maxPrice: number | null): number | null {
  const numericMatches = [...query.matchAll(/\b(\d{1,2})\b/g)];
  if (numericMatches.length === 0) return null;

  for (const match of numericMatches) {
    const parsed = Number(match[1]);
    if (!Number.isFinite(parsed) || parsed <= 0) continue;
    if (maxPrice !== null && parsed === maxPrice) continue;
    return parsed;
  }

  return null;
}

/* Callable function for vector search over properties */
export const searchProperties = onCall<{ query: string }>(
  { cors: true, secrets: [GEMINI_API_KEY] },
  async (request): Promise<{ results: SearchPropertyResult[] }> => {
    const query = request.data?.query;

    if (typeof query !== "string" || !query.trim()) {
      throw new HttpsError(
        "invalid-argument",
        "query must be a non-empty string",
      );
    }

    const trimmedQuery = query.trim();
    const queryVector = await generateEmbedding(
      trimmedQuery,
      "RETRIEVAL_QUERY",
    );
    console.info("searchProperties: generated query embedding", {
      queryLength: trimmedQuery.length,
      embeddingLength: queryVector.length,
    });

    if (queryVector.length === 0) {
      return { results: [] };
    }

    const priceConstraint = extractPriceConstraint(trimmedQuery);
    const maxPrice = priceConstraint?.value ?? null;
    const capacityHint = extractCapacityHint(trimmedQuery, maxPrice);
    const vectorQuery = db.collection("properties").findNearest({
      vectorField: "embedding",
      queryVector,
      limit: VECTOR_SEARCH_LIMIT,
      distanceMeasure: "COSINE",
      distanceResultField: "vectorDistance",
    });

    const snapshot = await vectorQuery.get();
    let rawMatches = snapshot.docs
      .map((doc) => ({
        id: doc.id,
        data: doc.data(),
        distance: Number(doc.get("vectorDistance")),
        price: Number(doc.get("price")),
        guest: Number(doc.get("capacity.guest")),
        bedroom: Number(doc.get("capacity.bedroom")),
        city: String(doc.get("address.city") ?? "").trim().toLowerCase(),
      }))
      .filter((item) => Number.isFinite(item.distance))
      .sort((a, b) => a.distance - b.distance);

    if (maxPrice !== null) {
      rawMatches = rawMatches.filter(
        (item) =>
          Number.isFinite(item.price) &&
          (priceConstraint?.inclusive ? item.price <= maxPrice : item.price < maxPrice),
      );
    }

    if (rawMatches.length === 0) {
      return { results: [] };
    }

    const queryLower = trimmedQuery.toLowerCase();
    const cityInQuery = rawMatches.find(
      (item) => item.city.length > 0 && queryLower.includes(item.city),
    )?.city;

    const bestDistance = rawMatches[0].distance;
    const distanceCutoff = Math.min(
      VECTOR_ABSOLUTE_DISTANCE_THRESHOLD,
      bestDistance + VECTOR_RELATIVE_DISTANCE_MARGIN,
    );

    let filteredMatches = rawMatches.filter(
      (item) => item.distance <= distanceCutoff,
    );
    if (filteredMatches.length === 0) {
      filteredMatches = rawMatches.slice(0, 1);
    }

    if (cityInQuery) {
      const cityMatches = filteredMatches.filter((item) => item.city === cityInQuery);
      if (cityMatches.length > 0) {
        filteredMatches = cityMatches;
      }
    }

    if (capacityHint !== null) {
      filteredMatches = filteredMatches.filter(
        (item) =>
          (Number.isFinite(item.guest) && item.guest >= capacityHint) ||
          (Number.isFinite(item.bedroom) && item.bedroom >= capacityHint),
      );
    }

    const results = filteredMatches
      .slice(0, VECTOR_MAX_RESULTS)
      .map((item): SearchPropertyResult => {
        const data = item.data as Record<string, unknown>;

        return {
          id: item.id,
          title: (data.title as string) ?? "",
          description: (data.description as string) ?? "",
          price: Number(data.price ?? 0),
          rating: Number(data.rating ?? 0),
          superhost: Boolean(data.superhost),
          image: (data.image as string) ?? "",
          capacity: {
            guest: Number(
              (data.capacity as { guest?: number } | undefined)?.guest ?? 0,
            ),
            bedroom: Number(
              (data.capacity as { bedroom?: number } | undefined)?.bedroom ?? 0,
            ),
          },
        };
      });
    console.info("searchProperties: vector search completed", {
      maxPrice,
      priceInclusive: priceConstraint?.inclusive ?? null,
      capacityHint,
      cityInQuery,
      bestDistance,
      distanceCutoff,
      fetchedCount: snapshot.size,
      resultsCount: results.length,
    });

    return { results };
  },
);

/* Trigger: generates and stores embedding when a property is created or updated */
export const onPropertyWrite = onDocumentWritten(
  { document: "properties/{propertyId}", secrets: [GEMINI_API_KEY] },
  async (event): Promise<void> => {
    const eventData = event.data;
    if (!eventData) return;

    const afterData = eventData.after.data();
    if (!afterData) return;

    const beforeData = eventData.before.data();
    if (beforeData) {
      const beforeContent = buildSearchableContent(beforeData);
      const afterContent = buildSearchableContent(afterData);
      if (beforeContent === afterContent) return;
    }

    const searchableContent = buildSearchableContent(afterData);
    if (!searchableContent.trim()) return;

    const embedding = await generateEmbedding(
      searchableContent,
      "RETRIEVAL_DOCUMENT",
    );
    if (embedding.length === 0) return;
    console.info("onPropertyWrite: generated document embedding", {
      propertyId: event.params.propertyId,
      embeddingLength: embedding.length,
    });

    await eventData.after.ref.update({
      embedding: FieldValue.vector(embedding),
    });
  },
);
