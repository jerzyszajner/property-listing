import type { PriceConstraint, RawMatch } from "./types.js";

type ApplyBusinessFiltersParams = {
  rawMatches: RawMatch[];
  query: string;
  maxPrice: number | null;
  priceConstraint: PriceConstraint | null;
  capacityHint: number | null;
  absoluteDistanceThreshold: number;
  relativeDistanceMargin: number;
};

type ApplyBusinessFiltersResult = {
  filteredMatches: RawMatch[];
  cityInQuery: string | null;
  bestDistance: number | null;
  distanceCutoff: number | null;
};

/**
 * Service function for applying business filters over vector candidates.
 * @param {ApplyBusinessFiltersParams} params Filter configuration.
 * @return {ApplyBusinessFiltersResult} Filtered matches and metadata.
 */
export function applyBusinessFilters({
  rawMatches,
  query,
  maxPrice,
  priceConstraint,
  capacityHint,
  absoluteDistanceThreshold,
  relativeDistanceMargin,
}: ApplyBusinessFiltersParams): ApplyBusinessFiltersResult {
  let filteredByPrice = rawMatches;

  if (maxPrice !== null) {
    filteredByPrice = filteredByPrice.filter(
      (item) =>
        Number.isFinite(item.price) &&
        (priceConstraint?.inclusive
          ? item.price <= maxPrice
          : item.price < maxPrice),
    );
  }

  if (filteredByPrice.length === 0) {
    return {
      filteredMatches: [],
      cityInQuery: null,
      bestDistance: null,
      distanceCutoff: null,
    };
  }

  const queryLower = query.toLowerCase();
  const cityInQuery =
    filteredByPrice.find(
      (item) => item.city.length > 0 && queryLower.includes(item.city),
    )?.city ?? null;

  const bestDistance = filteredByPrice[0].distance;
  const distanceCutoff = Math.min(
    absoluteDistanceThreshold,
    bestDistance + relativeDistanceMargin,
  );

  let filteredMatches = filteredByPrice.filter(
    (item) => item.distance <= distanceCutoff,
  );
  if (filteredMatches.length === 0) {
    filteredMatches = filteredByPrice.slice(0, 1);
  }

  if (cityInQuery) {
    const cityMatches = filteredMatches.filter(
      (item) => item.city === cityInQuery,
    );
    if (cityMatches.length > 0) {
      filteredMatches = cityMatches;
    }
  }

  if (capacityHint !== null) {
    filteredMatches = filteredMatches.filter(
      (item) =>
        (Number.isFinite(item.guest) && item.guest >= capacityHint) ||
        (Number.isFinite(item.bedroom) && item.bedroom >= capacityHint),
    );
  }

  return {
    filteredMatches,
    cityInQuery,
    bestDistance,
    distanceCutoff,
  };
}
