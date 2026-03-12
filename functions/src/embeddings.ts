import { GoogleGenAI } from "@google/genai";

const EMBEDDING_MODEL = "gemini-embedding-001";
const EMBEDDING_DIMENSIONALITY = 768;
const MAX_RETRIES = 2;
const RETRY_BASE_DELAY_MS = 500;

let cachedAi: GoogleGenAI | null = null;
let cachedApiKey: string | null = null;

/**
 * Returns a cached GoogleGenAI instance, creating a new one only when
 * the API key changes or no instance exists yet.
 * @param {string} apiKey Gemini API key.
 * @return {GoogleGenAI} Cached client instance.
 */
function getAiClient(apiKey: string): GoogleGenAI {
  if (cachedAi && cachedApiKey === apiKey) {
    return cachedAi;
  }
  cachedAi = new GoogleGenAI({ apiKey });
  cachedApiKey = apiKey;
  return cachedAi;
}

type EmbeddingTaskType = "RETRIEVAL_QUERY" | "RETRIEVAL_DOCUMENT";

/**
 * Checks whether an error is transient and eligible for retry.
 * @param {unknown} err The caught error.
 * @return {boolean} True if the error is transient.
 */
function isTransientError(err: unknown): boolean {
  if (err instanceof Error) {
    const msg = err.message.toLowerCase();
    if (
      msg.includes("429") ||
      msg.includes("rate limit") ||
      msg.includes("timeout") ||
      msg.includes("econnreset") ||
      msg.includes("enotfound") ||
      msg.includes("socket hang up") ||
      msg.includes("503") ||
      msg.includes("unavailable")
    ) {
      return true;
    }
  }
  return false;
}

/**
 * Returns a promise that resolves after the given delay.
 * @param {number} ms Delay in milliseconds.
 * @return {Promise<void>} Resolves after the delay.
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Service function for generating text embeddings via Gemini API.
 * Retries up to MAX_RETRIES times on transient errors (rate limits, network).
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

  const ai = getAiClient(apiKey);

  let lastError: unknown;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await ai.models.embedContent({
        model: EMBEDDING_MODEL,
        contents: text,
        config: {
          taskType,
          outputDimensionality: EMBEDDING_DIMENSIONALITY,
        },
      });

      return response.embeddings?.[0]?.values ?? [];
    } catch (err) {
      lastError = err;
      const isLastAttempt = attempt === MAX_RETRIES;

      if (isLastAttempt || !isTransientError(err)) {
        break;
      }

      const backoffMs = RETRY_BASE_DELAY_MS * 2 ** attempt;
      console.warn(
        `[embeddings] Transient error on attempt ${attempt + 1}/${MAX_RETRIES + 1}, retrying in ${backoffMs}ms:`,
        err instanceof Error ? err.message : err,
      );
      await delay(backoffMs);
    }
  }

  console.error(
    "[embeddings] Failed to generate embedding after all attempts:",
    lastError instanceof Error ? lastError.message : lastError,
  );

  throw new Error(
    `Failed to generate embedding: ${lastError instanceof Error ? lastError.message : "Unknown error"}`,
  );
}
