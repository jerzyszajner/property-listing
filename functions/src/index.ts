import { onCall, HttpsError } from "firebase-functions/v2/https";
import { setGlobalOptions } from "firebase-functions/v2";
import * as admin from "firebase-admin";
import { generateEmbedding } from "./embeddings.js";

setGlobalOptions({ maxInstances: 10 });

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
