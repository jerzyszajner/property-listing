import { describe, expect, it } from "vitest";
import { applyBusinessFilters } from "../../src/search/applyBusinessFilters.js";
import type { RawMatch } from "../../src/search/types.js";

const createRawMatch = (overrides: Partial<RawMatch>): RawMatch => ({
  id: overrides.id ?? "id-1",
  data: overrides.data ?? {},
  distance: overrides.distance ?? 0.1,
  price: overrides.price ?? 100,
  guest: overrides.guest ?? 2,
  bedroom: overrides.bedroom ?? 1,
  city: overrides.city ?? "oslo",
});

// Unit tests for business filter pipeline over vector search candidates.
describe("applyBusinessFilters", () => {
  it("returns empty result metadata when price filter removes all candidates", () => {
    const rawMatches = [createRawMatch({ price: 200 })];

    const result = applyBusinessFilters({
      rawMatches,
      query: "under 100",
      maxPrice: 100,
      priceConstraint: { value: 100, inclusive: true },
      capacityHint: null,
      absoluteDistanceThreshold: 0.2,
      relativeDistanceMargin: 0.05,
    });

    expect(result).toEqual({
      filteredMatches: [],
      cityInQuery: null,
      bestDistance: null,
      distanceCutoff: null,
    });
  });

  it("applies exclusive and inclusive price constraints correctly", () => {
    const rawMatches = [
      createRawMatch({ id: "a", price: 100 }),
      createRawMatch({ id: "b", price: 99 }),
    ];

    const inclusiveResult = applyBusinessFilters({
      rawMatches,
      query: "max 100",
      maxPrice: 100,
      priceConstraint: { value: 100, inclusive: true },
      capacityHint: null,
      absoluteDistanceThreshold: 1,
      relativeDistanceMargin: 1,
    });

    const exclusiveResult = applyBusinessFilters({
      rawMatches,
      query: "below 100",
      maxPrice: 100,
      priceConstraint: { value: 100, inclusive: false },
      capacityHint: null,
      absoluteDistanceThreshold: 1,
      relativeDistanceMargin: 1,
    });

    expect(inclusiveResult.filteredMatches.map((item) => item.id)).toEqual([
      "a",
      "b",
    ]);
    expect(exclusiveResult.filteredMatches.map((item) => item.id)).toEqual([
      "b",
    ]);
  });

  it("uses first candidate fallback when distance cutoff excludes all matches", () => {
    const rawMatches = [
      createRawMatch({ id: "a", distance: 0.4 }),
      createRawMatch({ id: "b", distance: 0.6 }),
    ];

    const result = applyBusinessFilters({
      rawMatches,
      query: "any",
      maxPrice: null,
      priceConstraint: null,
      capacityHint: null,
      absoluteDistanceThreshold: 0.2,
      relativeDistanceMargin: 0.05,
    });

    expect(result.bestDistance).toBe(0.4);
    expect(result.distanceCutoff).toBe(0.2);
    expect(result.filteredMatches.map((item) => item.id)).toEqual(["a"]);
  });

  it("keeps only city matches when query contains a known city", () => {
    const rawMatches = [
      createRawMatch({ id: "a", city: "oslo", distance: 0.05 }),
      createRawMatch({ id: "b", city: "bergen", distance: 0.06 }),
    ];

    const result = applyBusinessFilters({
      rawMatches,
      query: "Need place in OSLO center",
      maxPrice: null,
      priceConstraint: null,
      capacityHint: null,
      absoluteDistanceThreshold: 1,
      relativeDistanceMargin: 1,
    });

    expect(result.cityInQuery).toBe("oslo");
    expect(result.filteredMatches.map((item) => item.id)).toEqual(["a"]);
  });

  it("applies capacity hint against guest or bedroom fields", () => {
    const rawMatches = [
      createRawMatch({ id: "a", guest: 2, bedroom: 1 }),
      createRawMatch({ id: "b", guest: 1, bedroom: 4 }),
      createRawMatch({ id: "c", guest: 1, bedroom: 1 }),
    ];

    const result = applyBusinessFilters({
      rawMatches,
      query: "for 3 people",
      maxPrice: null,
      priceConstraint: null,
      capacityHint: 3,
      absoluteDistanceThreshold: 1,
      relativeDistanceMargin: 1,
    });

    expect(result.filteredMatches.map((item) => item.id)).toEqual(["b"]);
  });
});
