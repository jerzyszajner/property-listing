import { useState } from "react";
import { searchPropertiesWithAI } from "@/services/geminiService";
import type { Property } from "@/types/property";

export interface UseAISearchReturn {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  results: Property[];
  suggestions: string[];
  isLoading: boolean;
  error: string | null;
  handleSearch: () => Promise<void>;
  showEmptyState: boolean;
}

/* Hook for searching properties with AI */
export const useAISearch = (properties: Property[]): UseAISearchReturn => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<Property[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    const trimmedQuery = searchQuery.trim();

    if (!trimmedQuery) {
      setError("Please enter a valid search query.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const { suggest, matches } = await searchPropertiesWithAI(
        trimmedQuery,
        properties
      );

      setSuggestions(suggest);

      const matchingProperties = properties.filter((property) =>
        matches.includes(property.id)
      );

      setResults(matchingProperties);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to search properties. Please try again."
      );
      setResults([]);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const showEmptyState =
    hasSearched &&
    results.length === 0 &&
    !isLoading &&
    !!searchQuery &&
    !error &&
    suggestions.length === 0;

  return {
    searchQuery,
    setSearchQuery,
    results,
    suggestions,
    isLoading,
    error,
    handleSearch,
    showEmptyState,
  };
};
