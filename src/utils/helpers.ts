import type { Timestamp } from "firebase/firestore";

// Helper function to format Firestore Timestamp to locale date string (DD/MM/YYYY)
// Handles both Firestore Timestamp and serialized Timestamp (from navigate state)
export const formatDate = (
  timestamp:
    | Timestamp
    | { seconds: number; nanoseconds: number }
    | null
    | undefined
): string | null => {
  if (!timestamp) return null;

  const date =
    "toDate" in timestamp && typeof timestamp.toDate === "function"
      ? timestamp.toDate()
      : new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });
};

// Helper function to calculate nights between check-in and check-out (partial day counts as 1 night
export const calculateNights = (checkIn: Date, checkOut: Date): number =>
  Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));

// Helper function to format price with commas
export const formatPrice = (price: number): string => {
  return price.toLocaleString("en-US");
};

// Returns a new Date set to start of day (00:00:00) for date comparisons
export const getStartOfDay = (date: Date): Date =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());
