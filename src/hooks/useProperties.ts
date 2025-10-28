import { useState, useEffect } from "react";
import { fetchProperties } from "../services/propertyService";
import type { Property } from "../types/property";

// Hook for fetching properties data
export const useProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProperties = async () => {
      try {
        setIsLoading(true);
        const data = await fetchProperties();
        setProperties(data);
        setError(null);
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

  return { properties, isLoading, error };
};
