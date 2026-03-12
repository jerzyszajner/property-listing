import { describe, expect, it } from "vitest";
import { mapToResponse } from "../../src/search/mapToResponse.js";
import type { RawMatch } from "../../src/search/types.js";

const createRawMatch = (overrides: Partial<RawMatch> = {}): RawMatch => ({
  id: overrides.id ?? "id-1",
  data: overrides.data ?? {
    title: "Cozy cabin",
    description: "A nice place",
    price: 150,
    rating: 4.5,
    superhost: true,
    image: "https://example.com/img.jpg",
    capacity: { guest: 4, bedroom: 2 },
  },
  distance: overrides.distance ?? 0.1,
  price: overrides.price ?? 150,
  guest: overrides.guest ?? 4,
  bedroom: overrides.bedroom ?? 2,
  city: overrides.city ?? "oslo",
});

describe("mapToResponse", () => {
  it("maps a complete raw match to SearchPropertyResult", () => {
    const result = mapToResponse({
      matches: [createRawMatch()],
      maxResults: 5,
    });

    expect(result).toEqual([
      {
        id: "id-1",
        title: "Cozy cabin",
        description: "A nice place",
        price: 150,
        rating: 4.5,
        superhost: true,
        image: "https://example.com/img.jpg",
        capacity: { guest: 4, bedroom: 2 },
        address: { city: "oslo" },
      },
    ]);
  });

  it("limits results to maxResults", () => {
    const matches = [
      createRawMatch({ id: "a" }),
      createRawMatch({ id: "b" }),
      createRawMatch({ id: "c" }),
    ];

    const result = mapToResponse({ matches, maxResults: 2 });

    expect(result).toHaveLength(2);
    expect(result.map((r) => r.id)).toEqual(["a", "b"]);
  });

  it("returns empty array when matches is empty", () => {
    const result = mapToResponse({ matches: [], maxResults: 5 });

    expect(result).toEqual([]);
  });

  it("defaults missing string fields to empty string", () => {
    const match = createRawMatch({
      data: { capacity: { guest: 2, bedroom: 1 } },
    });

    const [result] = mapToResponse({ matches: [match], maxResults: 1 });

    expect(result.title).toBe("");
    expect(result.description).toBe("");
    expect(result.image).toBe("");
  });

  it("defaults missing numeric fields to 0", () => {
    const match = createRawMatch({ data: {} });

    const [result] = mapToResponse({ matches: [match], maxResults: 1 });

    expect(result.price).toBe(0);
    expect(result.rating).toBe(0);
    expect(result.capacity.guest).toBe(0);
    expect(result.capacity.bedroom).toBe(0);
  });

  it("defaults superhost to false when missing", () => {
    const match = createRawMatch({ data: {} });

    const [result] = mapToResponse({ matches: [match], maxResults: 1 });

    expect(result.superhost).toBe(false);
  });

  it("handles null values via nullish coalescing fallbacks", () => {
    const match = createRawMatch({
      data: {
        title: null,
        description: null,
        price: null,
        rating: null,
        superhost: null,
        image: null,
        capacity: null,
      },
    });

    const [result] = mapToResponse({ matches: [match], maxResults: 1 });

    expect(result.title).toBe("");
    expect(result.description).toBe("");
    expect(result.image).toBe("");
    expect(result.price).toBe(0);
    expect(result.rating).toBe(0);
    expect(result.superhost).toBe(false);
    expect(result.capacity.guest).toBe(0);
    expect(result.capacity.bedroom).toBe(0);
  });

  it("returns all matches when maxResults exceeds match count", () => {
    const matches = [createRawMatch({ id: "a" }), createRawMatch({ id: "b" })];

    const result = mapToResponse({ matches, maxResults: 10 });

    expect(result).toHaveLength(2);
  });
});
