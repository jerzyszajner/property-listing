import * as admin from "firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { generateEmbedding } from "./embeddings.js";
import { buildSearchableContent } from "./propertyUtils.js";

const PROPERTIES_COLLECTION = "properties";

type BackfillStats = {
  total: number;
  updated: number;
  skipped: number;
  failed: number;
};

/**
 * Script for backfilling vector embeddings for existing properties.
 */
async function backfillEmbeddings(): Promise<void> {
  if (admin.apps.length === 0) {
    admin.initializeApp();
  }

  const db = admin.firestore();
  const snapshot = await db.collection(PROPERTIES_COLLECTION).get();

  const stats: BackfillStats = {
    total: snapshot.size,
    updated: 0,
    skipped: 0,
    failed: 0,
  };

  console.log(`Found ${stats.total} properties to process.`);

  for (const doc of snapshot.docs) {
    try {
      const data = doc.data();
      const searchableContent = buildSearchableContent(data);

      if (!searchableContent.trim()) {
        stats.skipped += 1;
        console.log(`Skipping ${doc.id}: empty searchable content.`);
        continue;
      }

      const embedding = await generateEmbedding(
        searchableContent,
        "RETRIEVAL_DOCUMENT",
      );

      if (embedding.length === 0) {
        stats.skipped += 1;
        console.log(`Skipping ${doc.id}: empty embedding response.`);
        continue;
      }

      await doc.ref.update({
        embedding: FieldValue.vector(embedding),
      });

      stats.updated += 1;
      console.log(`Updated ${doc.id}`);
    } catch (err) {
      stats.failed += 1;
      console.error(`Failed to process ${doc.id}:`, err);
    }
  }

  console.log("Backfill finished.");
  const summary = [
    `Updated: ${stats.updated}`,
    `skipped: ${stats.skipped}`,
    `failed: ${stats.failed}`,
  ].join(", ");
  console.log(summary);
}

backfillEmbeddings().catch((err) => {
  console.error("Backfill failed:", err);
  process.exitCode = 1;
});
