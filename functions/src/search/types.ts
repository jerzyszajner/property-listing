// Price constraint extracted from natural language query.
export type PriceConstraint = {
  value: number;
  inclusive: boolean;
};

// Parsed intent used to orchestrate search pipeline.
export type SearchIntent = {
  trimmedQuery: string;
  priceConstraint: PriceConstraint | null;
  maxPrice: number | null;
  capacityHint: number | null;
};

// Raw candidate normalized from Firestore vector search result.
export type RawMatch = {
  id: string;
  data: Record<string, unknown>;
  distance: number;
  price: number;
  guest: number;
  bedroom: number;
  city: string;
};

// Response DTO returned by searchProperties callable.
export type SearchPropertyResult = {
  id: string;
  title: string;
  description: string;
  price: number;
  rating: number;
  superhost: boolean;
  image: string;
  capacity: {
    guest: number;
    bedroom: number;
  };
};
