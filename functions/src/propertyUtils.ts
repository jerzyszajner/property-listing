type FirestorePropertyData = {
  title?: string;
  description?: string;
  amenities?: string[];
  address?: { city?: string; country?: string };
  capacity?: { guest?: number; bedroom?: number };
  price?: number;
};

/* Builds searchable text from property data for embedding generation */
export function buildSearchableContent(data: FirestorePropertyData): string {
  const parts = [
    data.title,
    data.description,
    data.amenities?.join(", "),
    data.address ? `${data.address.city ?? ""} ${data.address.country ?? ""}`.trim() : "",
    data.capacity
      ? `guests: ${data.capacity.guest ?? 0}, bedrooms: ${data.capacity.bedroom ?? 0}`
      : "",
    typeof data.price === "number" ? `price: ${data.price}` : "",
  ].filter(Boolean);

  return parts.join(" | ");
}
