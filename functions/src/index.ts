import { onCall, HttpsError } from "firebase-functions/v2/https";
import { onDocumentWritten } from "firebase-functions/v2/firestore";
import { setGlobalOptions } from "firebase-functions/v2";
import * as admin from "firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { generateEmbedding } from "./embeddings.js";
import { buildSearchableContent } from "./propertyUtils.js";

setGlobalOptions({ maxInstances: 10, region: "europe-north1" });

admin.initializeApp();

const db = admin.firestore();

const VECTOR_SEARCH_LIMIT = 10;

/* Callable function for vector search over properties */
export const searchProperties = onCall<{ query: string }>(
  { cors: true },
  async (request): Promise<{ matches: string[] }> => {
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

    if (queryVector.length === 0) {
      return { matches: [] };
    }

    const vectorQuery = db.collection("properties").findNearest({
      vectorField: "embedding",
      queryVector,
      limit: VECTOR_SEARCH_LIMIT,
      distanceMeasure: "EUCLIDEAN",
    });

    const snapshot = await vectorQuery.get();
    const matches = snapshot.docs.map((doc) => doc.id);

    return { matches };
  },
);

/* Trigger: generates and stores embedding when a property is created or updated */
export const onPropertyWrite = onDocumentWritten(
  { document: "properties/{propertyId}" },
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

    await eventData.after.ref.update({
      embedding: FieldValue.vector(embedding),
    });
  },
);
