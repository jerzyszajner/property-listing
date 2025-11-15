import { useState, useMemo } from "react";
import type { Property } from "@/types/property";

const ALL_LOCATIONS = "All Stays";
const ALL_GUESTS = "0";

export interface UsePropertyFiltersReturn {
  selectedLocation: string;
  setSelectedLocation: React.Dispatch<React.SetStateAction<string>>;
  availableLocations: string[];
  filteredByLocations: Property[];
  filteredBySuperhost: Property[];
  filteredByGuests: Property[];
  isSuperhost: boolean;
  setIsSuperhost: React.Dispatch<React.SetStateAction<boolean>>;
  guestCount: string;
  setGuestCount: React.Dispatch<React.SetStateAction<string>>;
}

// Hook for filtering properties based on location, superhost, and guest count
export const usePropertyFilters = (
  properties: Property[]
): UsePropertyFiltersReturn => {
  const [selectedLocation, setSelectedLocation] = useState(ALL_LOCATIONS);
  const [isSuperhost, setIsSuperhost] = useState(false);
  const [guestCount, setGuestCount] = useState(ALL_GUESTS);

  // Extract unique locations from properties
  const availableLocations = useMemo(() => {
    const uniqueLocations = Array.from(
      new Set(properties.map((property) => property.location))
    );
    return [ALL_LOCATIONS, ...uniqueLocations];
  }, [properties]);

  // Filter by location: all stays or specific location only
  const filteredByLocations = useMemo(() => {
    if (selectedLocation === ALL_LOCATIONS) {
      return properties;
    }
    return properties.filter(
      (property) => property.location === selectedLocation
    );
  }, [properties, selectedLocation]);

  // Filter by superhost: apply only if toggle is enabled
  const filteredBySuperhost = useMemo(() => {
    if (!isSuperhost) {
      return filteredByLocations;
    }
    return filteredByLocations.filter((property) => property.superhost);
  }, [filteredByLocations, isSuperhost]);

  // Filter by guest count: all guests or minimum capacity
  const filteredByGuests = useMemo(() => {
    if (guestCount === ALL_GUESTS) {
      return filteredBySuperhost;
    }
    const minGuests = Number(guestCount);
    return filteredBySuperhost.filter(
      (property) => property.capacity.people >= minGuests
    );
  }, [filteredBySuperhost, guestCount]);

  return {
    selectedLocation,
    setSelectedLocation,
    availableLocations,
    filteredByLocations,
    filteredBySuperhost,
    filteredByGuests,
    isSuperhost,
    setIsSuperhost,
    guestCount,
    setGuestCount,
  };
};
