import { useState, useEffect } from "react";
import { fetchPropertyById } from "@/services/propertyService";
import type { Property } from "@/types/property";

export interface UsePropertyReturn {
  property: Property | null;
  isLoading: boolean;
  error: string | null;
}

// Hook for fetching a single property by id
export const useProperty = (id: string | undefined): UsePropertyReturn => {
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Property ID is required");
      setIsLoading(false);
      return;
    }

    const loadProperty = async () => {
      try {
        setError(null);
        setIsLoading(true);
        const data = await fetchPropertyById(id);
        setProperty(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load property"
        );
        setProperty(null);
      } finally {
        setIsLoading(false);
      }
    };
    loadProperty();
  }, [id]);

  return { property, isLoading, error };
};
