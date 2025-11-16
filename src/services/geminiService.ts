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
    location: property.location,
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

OUTPUT FORMAT (STRICT):
{
  "suggest": [],
  "matches": []
}

RULES:

1. If the query is unclear, extremely short (1–2 characters), or only a number:
   - DO NOT guess.
   - Provide 2–4 suggestions of what the user might mean.
   - "matches" must be an empty array.

2. If the query is clear:
   - "suggest" must be an empty array.
   - Fill "matches" with ONLY the IDs of genuinely relevant properties.

3. STRICT MATCHING FOR NUMBERS:
   - If query is only a number:
       Match ONLY if number EXACTLY equals:
       - bedroom
       - people
       - or price.
       Otherwise: return matches: [].

4. If no properties match → return:
{
  "suggest": [],
  "matches": []
}

5. NEVER guess. NEVER hallucinate. ALWAYS return valid JSON.
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
