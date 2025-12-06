import type { Timestamp } from "firebase/firestore";

export const formatDate = (
  timestamp: Timestamp | null | undefined
): string | null => {
  if (!timestamp) {
    return null;
  }

  return timestamp.toDate().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });
};
