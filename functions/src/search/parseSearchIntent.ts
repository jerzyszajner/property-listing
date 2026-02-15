import type {PriceConstraint, SearchIntent} from "./types.js";

/**
 * Service function for detecting whether max price should be inclusive.
 * @param {string} query Raw user query.
 * @return {boolean} Inclusive comparison flag.
 */
export function detectPriceComparator(
  query: string,
): PriceConstraint["inclusive"] {
  if (/(<=|=<|≤)/u.test(query)) return true;
  if (/<(?![=])/u.test(query)) return false;

  return true;
}

/**
 * Service function for extracting price constraints from user query.
 * @param {string} query Raw user query.
 * @return {PriceConstraint | null} Parsed price constraint.
 */
export function extractPriceConstraint(query: string): PriceConstraint | null {
  const currencyCodes = ["USD"];
  const decimalNumber = "\\d+(?:[.,]\\d+)?";
  const codeGroup = `(?:${currencyCodes.join("|")})`;

  const patterns = [
    new RegExp(`(${decimalNumber})\\s*\\p{Sc}`, "u"),
    new RegExp(`\\p{Sc}\\s*(${decimalNumber})`, "u"),
    new RegExp(`(${decimalNumber})\\s*${codeGroup}\\b`, "i"),
    new RegExp(`\\b${codeGroup}\\s*(${decimalNumber})`, "i"),
    new RegExp(`(?:<=|<|=)\\s*(${decimalNumber})`, "u"),
    new RegExp(`\\b(${decimalNumber})\\s*dollars?\\b`, "i"),
    new RegExp(`\\bdollars?\\s*(${decimalNumber})\\b`, "i"),
  ];

  for (const pattern of patterns) {
    const match = query.match(pattern);
    if (!match?.[1]) continue;
    const parsed = Number(match[1].replace(",", "."));
    if (Number.isFinite(parsed) && parsed > 0) {
      return {
        value: parsed,
        inclusive: detectPriceComparator(query),
      };
    }
  }

  const fallbackNumbers = [...query.matchAll(/\b(\d{2,5}(?:[.,]\d+)?)\b/g)]
    .map((match) => Number(match[1].replace(",", ".")))
    .filter((value) => Number.isFinite(value) && value >= 40 && value <= 50000);

  if (fallbackNumbers.length > 0) {
    return {
      value: Math.min(...fallbackNumbers),
      inclusive: detectPriceComparator(query),
    };
  }

  return null;
}

/**
 * Service function for extracting guest/bedroom capacity hint from query.
 * @param {string} query Raw user query.
 * @param {number | null} maxPrice Parsed maximum price.
 * @return {number | null} Parsed capacity hint.
 */
export function extractCapacityHint(
  query: string,
  maxPrice: number | null,
): number | null {
  const numericMatches = [...query.matchAll(/\b(\d{1,2})\b/g)];
  if (numericMatches.length === 0) return null;

  for (const match of numericMatches) {
    const parsed = Number(match[1]);
    if (!Number.isFinite(parsed) || parsed <= 0) continue;
    if (maxPrice !== null && parsed === maxPrice) continue;
    return parsed;
  }

  return null;
}

/**
 * Service function for parsing structured search intent from free text query.
 * @param {string} query Raw user query.
 * @return {SearchIntent} Structured search intent.
 */
export function parseSearchIntent(query: string): SearchIntent {
  const trimmedQuery = query.trim();
  const priceConstraint = extractPriceConstraint(trimmedQuery);
  const maxPrice = priceConstraint?.value ?? null;
  const capacityHint = extractCapacityHint(trimmedQuery, maxPrice);

  return {
    trimmedQuery,
    priceConstraint,
    maxPrice,
    capacityHint,
  };
}
