import { initializeApp, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const PROPERTIES_COLLECTION = "properties";
const TEST_BATCH_HOST_ID = "_test_batch_300";

/**
 * Deletes all test properties with hostId "_test_batch_300".
 * Use after seed:test to remove test data.
 */
async function deleteTestProperties(): Promise<void> {
  if (!getApps().length) {
    initializeApp({ projectId: "property-listing-946a9" });
  }

  const db = getFirestore();
  const snapshot = await db
    .collection(PROPERTIES_COLLECTION)
    .where("hostId", "==", TEST_BATCH_HOST_ID)
    .get();

  const count = snapshot.size;
  if (count === 0) {
    console.log("No test properties found.");
    return;
  }

  const BATCH_SIZE = 500;
  const docs = snapshot.docs;
  for (let i = 0; i < docs.length; i += BATCH_SIZE) {
    const batch = db.batch();
    const chunk = docs.slice(i, i + BATCH_SIZE);
    for (const doc of chunk) {
      batch.delete(doc.ref);
    }
    await batch.commit();
  }
  console.log(`Deleted ${count} test properties.`);
}

deleteTestProperties().catch((err) => {
  console.error("Delete failed:", err);
  process.exitCode = 1;
});
