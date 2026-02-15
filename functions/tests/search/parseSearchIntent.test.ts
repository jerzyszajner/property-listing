import {describe, expect, it} from "vitest";
import {
  detectPriceComparator,
  extractCapacityHint,
  extractPriceConstraint,
  parseSearchIntent,
} from "../../src/search/parseSearchIntent.js";

// Unit tests for query comparator parsing.
describe("detectPriceComparator", () => {
  it("returns true for inclusive comparator symbols", () => {
    expect(detectPriceComparator("price <= 120")).toBe(true);
    expect(detectPriceComparator("price ≤ 120")).toBe(true);
  });

  it("returns false for strict less-than comparator", () => {
    expect(detectPriceComparator("price < 120")).toBe(false);
  });

  it("defaults to inclusive when no comparator is present", () => {
    expect(detectPriceComparator("around 120 dollars")).toBe(true);
  });
});

// Unit tests for extracting numeric price constraints from query.
describe("extractPriceConstraint", () => {
  it("extracts price from currency symbol and respects comparator", () => {
    expect(extractPriceConstraint("show me homes < $120")).toEqual({
      value: 120,
      inclusive: false,
    });
  });

  it("extracts price from USD code and decimal values", () => {
    expect(extractPriceConstraint("budget USD 99.5")).toEqual({
      value: 99.5,
      inclusive: true,
    });
  });

  it("extracts cheap price from comparator without currency symbol", () => {
    expect(extractPriceConstraint("show me options < 30")).toEqual({
      value: 30,
      inclusive: false,
    });
  });

  it("falls back to numeric token in accepted range", () => {
    expect(extractPriceConstraint("apartment for 2 guests up to 450")).toEqual({
      value: 450,
      inclusive: true,
    });
  });

  it("returns null when there is no valid price value", () => {
    expect(extractPriceConstraint("cheap and cozy")).toBeNull();
    expect(extractPriceConstraint("price $0 only")).toBeNull();
  });
});

// Unit tests for extracting guest/bedroom capacity hint.
describe("extractCapacityHint", () => {
  it("returns first valid number when max price is null", () => {
    expect(extractCapacityHint("need space for 6 guests", null)).toBe(6);
  });

  it("skips numeric token that equals max price", () => {
    expect(extractCapacityHint("for 120 dollars and 4 guests", 120)).toBe(4);
  });

  it("returns null when query does not contain numeric hint", () => {
    expect(extractCapacityHint("family friendly", null)).toBeNull();
  });
});

// Unit tests for end-to-end search intent parsing.
describe("parseSearchIntent", () => {
  it("parses trimmed query, price and capacity in a single pass", () => {
    expect(parseSearchIntent("  homes < 300 for 5 guests  ")).toEqual({
      trimmedQuery: "homes < 300 for 5 guests",
      priceConstraint: {
        value: 300,
        inclusive: false,
      },
      maxPrice: 300,
      capacityHint: 5,
    });
  });
});
