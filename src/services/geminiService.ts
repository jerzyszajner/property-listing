import { GoogleGenAI } from "@google/genai";
import type { Property } from "@/types/property";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.warn("VITE_GEMINI_API_KEY is not set in environment variables");
}

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

export interface AISearchResult {
  suggest: string[];
  matches: string[];
}

/* Service function for searching properties with AI */
export const searchPropertiesWithAI = async (
  query: string,
  properties: Property[]
): Promise<AISearchResult> => {
  if (!ai) {
    throw new Error(
      "Gemini API is not configured. Please set VITE_GEMINI_API_KEY"
    );
  }

  const searchableProperties = properties.map((property) => ({
    id: property.id,
    title: property.title,
    description: property.description,
    amenities: property.amenities,
    location: {
      street: property.address.street,
      number: property.address.number,
      city: property.address.city,
      postalCode: property.address.postalCode,
      country: property.address.country,
    },
    price: property.price,
    rating: property.rating,
    superhost: property.superhost,
    people: property.capacity?.people,
    bedroom: property.capacity?.bedroom,
  }));

  const prompt = `
You are an AI property search assistant.

User query: "${query}"

Available properties:
${JSON.stringify(searchableProperties)}

OUTPUT FORMAT:
{
  "suggest": [],
  "matches": []
}

RULES:

1. Unclear/ambiguous query:
   - Query is 1-2 characters
   - Query is only a number without context
   - Query is too vague to match properties
   - Return 2-4 suggestions in "suggest"
   - Return empty "matches"

2. Clear query:
   - Return empty "suggest"
   - Return matching property IDs in "matches"

3. Capacity matching:
   - "X people/guests" → match where people >= X
   - "X bedrooms/rooms" → match where bedroom >= X

4. Location matching:
   - Match by country or city name
   - Case-insensitive

5. Combined criteria:
   - All criteria must match (AND logic)

6. Number-only query:
   - Match only if exactly equals: bedroom, people, or price
   - Otherwise return suggestions

7. No matches → return empty arrays

Return valid JSON only.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const text = response.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    if (!text.trim()) {
      return { suggest: [], matches: [] };
    }

    const jsonStartIndex = text.indexOf("{");
    const jsonEndIndex = text.lastIndexOf("}") + 1;

    if (jsonStartIndex === -1 || jsonEndIndex === -1) {
      return { suggest: [], matches: [] };
    }

    const jsonString = text.slice(jsonStartIndex, jsonEndIndex);
    const parsed = JSON.parse(jsonString);

    return {
      suggest: parsed.suggest ?? [],
      matches: parsed.matches ?? [],
    };
  } catch (error) {
    console.error("Gemini error:", error);
    return { suggest: [], matches: [] };
  }
};
