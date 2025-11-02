import Button from "@/components/Button/Button";
import ToggleSwitch from "@/components/ToggleSwitch/ToggleSwitch";
import Select from "@/components/Select/Select";
import { GUEST_OPTIONS } from "./filterOptions";
import styles from "./FilterPanel.module.css";

type FilterPanelProps = {
  selectedLocation: string;
  onLocationChange: (newLocation: string) => void;
  availableLocations: string[];
  isSuperhost: boolean;
  onSuperhostChange: (value: boolean) => void;
  guestCount: string;
  onGuestCountChange: (value: string) => void;
};

/* FilterPanel component */
const FilterPanel = ({
  selectedLocation,
  onLocationChange,
  availableLocations,
  isSuperhost,
  onSuperhostChange,
  guestCount,
  onGuestCountChange,
}: FilterPanelProps) => {
  return (
    <div className={styles.filterPanel}>
      <div className={styles.locationFilters}>
        {availableLocations.map((location) => (
          <Button
            key={location}
            variant={selectedLocation === location ? "active" : "secondary"}
            aria-pressed={selectedLocation === location}
            onClick={() => onLocationChange(location)}
          >
            {location}
          </Button>
        ))}
      </div>

      <div className={styles.rightFilters}>
        <div className={styles.superhostToggle}>
          <label htmlFor="superhost" className={styles.switchLabel}>
            Superhost
          </label>
          <ToggleSwitch
            checked={isSuperhost}
            onChange={onSuperhostChange}
            id="superhost"
          />
        </div>

        <div className={styles.guestsFilter}>
          <Select
            options={GUEST_OPTIONS}
            value={guestCount}
            onChange={onGuestCountChange}
            placeholder="Choose guests"
            ariaLabel="Select number of guests"
            id="guests"
          />
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
