import { Search } from "lucide-react";
import Button from "@/components/Button/Button";
import Input from "@/components/Input/Input";
import styles from "./SearchInput.module.css";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  isLoading: boolean;
}

/* SearchInput component */
const SearchInput = ({
  value,
  onChange,
  onSearch,
  isLoading,
}: SearchInputProps) => {
  return (
    <div className={styles.searchBox}>
      <Search className={styles.icon} />
      <Input
        type="text"
        id="search-input"
        variant="transparent"
        placeholder="Search with AI: Norway cabin, 2 bedrooms, wifi"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSearch()}
      />
      <Button
        variant="secondary"
        onClick={onSearch}
        type="button"
        disabled={isLoading}
      >
        {isLoading ? "Searching..." : "Search"}
      </Button>
    </div>
  );
};

export default SearchInput;
