import { onDocumentWritten } from "firebase-functions/v2/firestore";
import type { SecretParam } from "firebase-functions/params";
import { FieldValue } from "firebase-admin/firestore";
import { generateEmbedding } from "../embeddings.js";
import {
  buildSearchableContent,
  type FirestorePropertyData,
} from "../propertyUtils.js";

// Service function for creating property write trigger with embedding indexing.
export const createOnPropertyWrite = (geminiApiKey: SecretParam) =>
  onDocumentWritten(
    { document: "properties/{propertyId}", secrets: [geminiApiKey] },
    async (event): Promise<void> => {
      const propertyId = event.params.propertyId;

      try {
        const eventData = event.data;
        if (!eventData) return;

        const afterData = eventData.after.data() as
          | FirestorePropertyData
          | undefined;
        if (!afterData) return;

        const beforeData = eventData.before.data() as
          | FirestorePropertyData
          | undefined;
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
          propertyId,
          embeddingLength: embedding.length,
        });

        await eventData.after.ref.update({
          embedding: FieldValue.vector(embedding),
        });
      } catch (err) {
        console.error("onPropertyWrite: failed to update embedding", {
          propertyId,
          error: err instanceof Error ? err.message : String(err),
        });
      }
    },
  );
