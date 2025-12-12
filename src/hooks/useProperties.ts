import { useState, useEffect } from "react";
import { fetchProperties } from "@/services/propertyService";
import type { Property } from "@/types/property";

export interface UsePropertiesReturn {
  properties: Property[];
  isLoading: boolean;
  error: string | null;
  setError: (error: string | null) => void;
}

// Hook for fetching properties data
export const useProperties = (): UsePropertiesReturn => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProperties = async () => {
      try {
        setError(null);
        setIsLoading(true);
        const data = await fetchProperties();
        setProperties(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load properties"
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadProperties();
  }, []);

  return { properties, isLoading, error, setError };
};
