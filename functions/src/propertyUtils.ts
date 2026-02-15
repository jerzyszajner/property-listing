type FirestorePropertyData = {
  title?: string;
  description?: string;
  amenities?: string[];
  address?: { city?: string; country?: string };
  capacity?: { guest?: number; bedroom?: number };
  price?: number;
};

/**
 * Builds searchable text from property data for embedding generation.
 * @param {FirestorePropertyData} data Source property data.
 * @return {string} Normalized searchable text.
 */
export function buildSearchableContent(data: FirestorePropertyData): string {
  const locationPart = data.address ?
    `${data.address.city ?? ""} ${data.address.country ?? ""}`.trim() :
    "";
  const capacityPart = data.capacity ?
    [
      `guests: ${data.capacity.guest ?? 0}`,
      `bedrooms: ${data.capacity.bedroom ?? 0}`,
    ].join(", ") :
    "";

  const parts = [
    data.title,
    data.description,
    data.amenities?.join(", "),
    locationPart,
    capacityPart,
    typeof data.price === "number" ? `price: ${data.price}` : "",
  ].filter(Boolean);

  return parts.join(" | ");
}
