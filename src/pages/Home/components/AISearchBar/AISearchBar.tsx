import { useAISearch } from "@/pages/Home/hooks/useAISearch";
import SearchInput from "./SearchInput/SearchInput";
import SearchSuggestions from "./SearchSuggestions/SearchSuggestions";
import SearchResults from "./SearchResults/SearchResults";
import styles from "./AISearchBar.module.css";

/* AISearchBar component */
const AISearchBar = () => {
  const {
    searchQuery,
    setSearchQuery,
    results,
    suggestions,
    isLoading,
    error,
    handleSearch,
    showEmptyState,
  } = useAISearch();

  return (
    <div className={styles.container}>
      <SearchInput
        value={searchQuery}
        onChange={setSearchQuery}
        onSearch={handleSearch}
        isLoading={isLoading}
      />

      <SearchSuggestions suggestions={suggestions} />

      {error && <div className={styles.error}>{error}</div>}

      <SearchResults results={results} />

      {showEmptyState && (
        <div
          className={styles.error}
        >{`No properties found for: "${searchQuery}"`}</div>
      )}
    </div>
  );
};

export default AISearchBar;
