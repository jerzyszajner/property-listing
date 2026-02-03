import { useState, useEffect } from "react";
import {
  fetchUserBookings,
  cancelBooking as cancelBookingService,
} from "@/services/bookingService";
import { useAuthContext } from "@/contexts/AuthContext";
import type { Booking } from "@/types/booking";

export interface UseBookingsReturn {
  bookings: Booking[];
  isLoading: boolean;
  error: string | null;
  setError: (error: string | null) => void;
  cancelBooking: (bookingId: string) => Promise<void>;
  cancellingBookingId: string | null;
}

// Hook for fetching and managing user bookings
export const useBookings = (): UseBookingsReturn => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancellingBookingId, setCancellingBookingId] = useState<string | null>(
    null,
  );
  const { user } = useAuthContext();

  useEffect(() => {
    if (!user) {
      setBookings([]);
      setIsLoading(false);
      return;
    }

    const loadBookings = async () => {
      try {
        setError(null);
        setIsLoading(true);
        const data = await fetchUserBookings(user.uid);
        setBookings(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load bookings",
        );
        setBookings([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadBookings();
  }, [user]);

  const cancelBooking = async (bookingId: string): Promise<void> => {
    setCancellingBookingId(bookingId);
    try {
      setError(null);
      await cancelBookingService(bookingId);

      // Refresh bookings list after cancellation
      if (user) {
        const updatedBookings = await fetchUserBookings(user.uid);
        setBookings(updatedBookings);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to cancel booking");
      throw err;
    } finally {
      setCancellingBookingId(null);
    }
  };

  return {
    bookings,
    isLoading,
    error,
    setError,
    cancelBooking,
    cancellingBookingId,
  };
};
