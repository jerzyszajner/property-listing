import { useProperties } from "../../hooks/useProperties";
import { usePropertyFilters } from "../../hooks/usePropertyFilters";
import Header from "../../components/Header/Header";
import PropertyList from "../../components/PropertyList/PropertyList";
import Spinner from "../../components/Spinner/Spinner";
import FilterPanel from "../../components/FilterPanel/FilterPanel";

/* Home page */
const Home = () => {
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
    <>
      <Header />
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
    </>
  );
};

export default Home;
