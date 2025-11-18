import { useProperties } from "@/hooks/useProperties";
import { usePropertyFilters } from "./hooks/usePropertyFilters";
import PropertyListFilterPanel from "./components/PropertyListFilterPanel/PropertyListFilterPanel";
import PropertyCard from "@/components/PropertyCard/PropertyCard";
import EmptyState from "@/components/EmptyState/EmptyState";
import Spinner from "@/components/Spinner/Spinner";
import styles from "./PropertyList.module.css";

/* PropertyList page */
const PropertyList = () => {
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
  if (properties.length === 0)
    return <EmptyState message="No properties found." />;
  return (
    <div className={styles.propertyListPage}>
      <PropertyListFilterPanel
        selectedLocation={selectedLocation}
        onLocationChange={setSelectedLocation}
        availableLocations={availableLocations}
        isSuperhost={isSuperhost}
        onSuperhostChange={setIsSuperhost}
        guestCount={guestCount}
        onGuestCountChange={setGuestCount}
      />
      {filteredByGuests.length === 0 ? (
        <EmptyState message="No properties found matching your filters." />
      ) : (
        <ul className={styles.propertyList}>
          {filteredByGuests.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default PropertyList;
