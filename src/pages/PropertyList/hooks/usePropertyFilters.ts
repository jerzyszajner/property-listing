import { useState, useMemo } from "react";
import type { Property } from "@/types/property";

const ALL_GUESTS = "0";

export interface UsePropertyFiltersReturn {
  filteredBySuperhost: Property[];
  filteredByGuests: Property[];
  isSuperhost: boolean;
  setIsSuperhost: React.Dispatch<React.SetStateAction<boolean>>;
  guestCount: string;
  setGuestCount: React.Dispatch<React.SetStateAction<string>>;
}

// Hook for filtering properties based on superhost and guest count
export const usePropertyFilters = (
  properties: Property[],
): UsePropertyFiltersReturn => {
  const [isSuperhost, setIsSuperhost] = useState(false);
  const [guestCount, setGuestCount] = useState(ALL_GUESTS);

  // Filter by superhost: apply only if toggle is enabled
  const filteredBySuperhost = useMemo(() => {
    if (!isSuperhost) {
      return properties;
    }
    return properties.filter((property) => property.superhost);
  }, [properties, isSuperhost]);

  // Filter by guest count: all guests or minimum capacity
  const filteredByGuests = useMemo(() => {
    if (guestCount === ALL_GUESTS) {
      return filteredBySuperhost;
    }
    const minGuests = Number(guestCount);
    return filteredBySuperhost.filter(
      (property) => property.capacity.guest >= minGuests,
    );
  }, [filteredBySuperhost, guestCount]);

  return {
    filteredBySuperhost,
    filteredByGuests,
    isSuperhost,
    setIsSuperhost,
    guestCount,
    setGuestCount,
  };
};
