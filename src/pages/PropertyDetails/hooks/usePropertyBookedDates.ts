import { useState, useEffect, useCallback } from "react";
import { fetchPropertyBookedDates } from "@/services/bookingService";

export interface UsePropertyBookedDatesReturn {
  bookedRanges: { from: Date; to: Date }[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/* Hook for fetching booked dates for a property */
export const usePropertyBookedDates = (
  propertyId: string | undefined,
): UsePropertyBookedDatesReturn => {
  const [bookedRanges, setBookedRanges] = useState<{ from: Date; to: Date }[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadBookedDates = useCallback(async () => {
    if (!propertyId) {
      setBookedRanges([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const ranges = await fetchPropertyBookedDates(propertyId);
      setBookedRanges(ranges);
    } catch (err) {
      const message = err instanceof Error ? err.message : "";
      setError(
        message.toLowerCase().includes("permission")
          ? "You must be logged in to make a booking"
          : "Failed to load booked dates. Please try again.",
      );
      setBookedRanges([]);
    } finally {
      setIsLoading(false);
    }
  }, [propertyId]);

  useEffect(() => {
    loadBookedDates();
  }, [loadBookedDates]);

  return {
    bookedRanges,
    isLoading,
    error,
    refetch: loadBookedDates,
  };
};
