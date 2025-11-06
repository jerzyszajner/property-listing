import { useProperties } from "./hooks/useProperties";
import { usePropertyFilters } from "./hooks/usePropertyFilters";
import HomeHeader from "./components/HomeHeader/HomeHeader";
import HomeFilterPanel from "./components/HomeFilterPanel/HomeFilterPanel";
import HomePropertyList from "./components/HomePropertyList/HomePropertyList";
import Spinner from "@/components/Spinner/Spinner";
import styles from "./Home.module.css";

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
    <div className={styles.home}>
      <div className={styles.wrapper}>
        <HomeHeader />
        <HomeFilterPanel
          selectedLocation={selectedLocation}
          onLocationChange={setSelectedLocation}
          availableLocations={availableLocations}
          isSuperhost={isSuperhost}
          onSuperhostChange={setIsSuperhost}
          guestCount={guestCount}
          onGuestCountChange={setGuestCount}
        />
        <HomePropertyList properties={filteredByGuests} />
      </div>
    </div>
  );
};

export default Home;
