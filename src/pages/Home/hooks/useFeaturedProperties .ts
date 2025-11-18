import { useMemo } from "react";
import type { Property } from "@/types/property";

export interface UseFeaturedPropertiesReturn {
  featuredProperties: Property[];
}

// Hook for selecting top featured properties by rating
export const useFeaturedProperties = (
  properties: Property[],
  limit: number = 3
): UseFeaturedPropertiesReturn => {
  const featuredProperties = useMemo(() => {
    if (!properties || properties.length === 0) return [];

    return [...properties]
      .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
      .slice(0, limit);
  }, [properties, limit]);

  return { featuredProperties };
};
