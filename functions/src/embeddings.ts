import {GoogleGenAI} from "@google/genai";

const EMBEDDING_MODEL = "gemini-embedding-001";
const EMBEDDING_DIMENSIONALITY = 768;

type EmbeddingTaskType = "RETRIEVAL_QUERY" | "RETRIEVAL_DOCUMENT";

/**
 * Service function for generating text embeddings via Gemini API.
 * @param {string} text Text used to generate embedding.
 * @param {EmbeddingTaskType} taskType Embedding task profile.
 * @return {Promise<number[]>} Generated embedding vector.
 */
export async function generateEmbedding(
  text: string,
  taskType: EmbeddingTaskType = "RETRIEVAL_QUERY",
): Promise<number[]> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (!apiKey) {
    throw new Error(
      [
        "GEMINI_API_KEY is not set.",
        "Configure it in Firebase Console -> Functions -> Environment.",
      ].join(" "),
    );
  }

  const ai = new GoogleGenAI({apiKey});

  const response = await ai.models.embedContent({
    model: EMBEDDING_MODEL,
    contents: text,
    config: {
      taskType,
      outputDimensionality: EMBEDDING_DIMENSIONALITY,
    },
  });

  return response.embeddings?.[0]?.values ?? [];
}
