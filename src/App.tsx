import { useProperties } from "./hooks/useProperties";
import { usePropertyFilters } from "./hooks/usePropertyFilters";
import PropertyList from "./components/PropertyList/PropertyList";
import Spinner from "./components/Spinner/Spinner";
import Header from "./components/Header/Header";
import FilterPanel from "./components/FilterPanel/FilterPanel";
import styles from "./App.module.css";

function App() {
  const { properties, isLoading, error } = useProperties();
  const {
    selectedLocation,
    setSelectedLocation,
    availableLocations,
    isSuperhost,
    setIsSuperhost,
    guestCount,
    setGuestCount,
    filteredByGuests,
  } = usePropertyFilters(properties);

  if (isLoading) return <Spinner />;
  if (error) return <div>Error: {error}</div>;
  return (
    <div className={styles.appContainer}>
      <Header />
      <main>
        <FilterPanel
          selectedLocation={selectedLocation}
          onLocationChange={setSelectedLocation}
          availableLocations={availableLocations}
          isSuperhost={isSuperhost}
          onSuperhostChange={setIsSuperhost}
          guestCount={guestCount}
          onGuestCountChange={setGuestCount}
        />
        <PropertyList properties={filteredByGuests} />
      </main>
    </div>
  );
}

export default App;
