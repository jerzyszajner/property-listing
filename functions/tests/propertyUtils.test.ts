import { describe, expect, it } from "vitest";
import {
  buildSearchableContent,
  type FirestorePropertyData,
} from "../src/propertyUtils.js";

describe("buildSearchableContent", () => {
  it("builds full searchable string from complete property data", () => {
    const data: FirestorePropertyData = {
      title: "Modern Apartment",
      description: "A lovely flat downtown",
      amenities: ["WiFi", "Parking"],
      address: { city: "Oslo", country: "Norway" },
      capacity: { guest: 4, bedroom: 2 },
      price: 200,
    };

    const result = buildSearchableContent(data);

    expect(result).toBe(
      "Modern Apartment | A lovely flat downtown | WiFi, Parking | Oslo Norway | guests: 4, bedrooms: 2 | price: 200",
    );
  });

  it("omits undefined optional fields", () => {
    const data: FirestorePropertyData = {
      title: "Cabin",
    };

    const result = buildSearchableContent(data);

    expect(result).toBe("Cabin");
  });

  it("returns empty string when all fields are undefined", () => {
    const result = buildSearchableContent({});

    expect(result).toBe("");
  });

  it("handles address with only city", () => {
    const data: FirestorePropertyData = {
      address: { city: "Bergen" },
    };

    const result = buildSearchableContent(data);

    expect(result).toBe("Bergen");
  });

  it("handles address with only country", () => {
    const data: FirestorePropertyData = {
      address: { country: "Norway" },
    };

    const result = buildSearchableContent(data);

    expect(result).toBe("Norway");
  });

  it("handles empty address object", () => {
    const data: FirestorePropertyData = {
      address: {},
    };

    const result = buildSearchableContent(data);

    expect(result).toBe("");
  });

  it("defaults capacity values to 0 when missing", () => {
    const data: FirestorePropertyData = {
      capacity: {},
    };

    const result = buildSearchableContent(data);

    expect(result).toBe("guests: 0, bedrooms: 0");
  });

  it("handles empty amenities array", () => {
    const data: FirestorePropertyData = {
      amenities: [],
    };

    const result = buildSearchableContent(data);

    expect(result).toBe("");
  });

  it("includes price only when it is a number", () => {
    const withPrice: FirestorePropertyData = { price: 0 };
    const withoutPrice: FirestorePropertyData = {};

    expect(buildSearchableContent(withPrice)).toBe("price: 0");
    expect(buildSearchableContent(withoutPrice)).toBe("");
  });

  it("combines only non-empty parts with pipe separator", () => {
    const data: FirestorePropertyData = {
      title: "Villa",
      price: 500,
    };

    const result = buildSearchableContent(data);

    expect(result).toBe("Villa | price: 500");
    expect(result).not.toContain("||");
  });
});
