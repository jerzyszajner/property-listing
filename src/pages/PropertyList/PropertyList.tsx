import { useProperties } from "@/hooks/useProperties";
import { usePropertyFilters } from "./hooks/usePropertyFilters";
import PropertyListFilterPanel from "./components/PropertyListFilterPanel/PropertyListFilterPanel";
import PropertyCard from "@/components/PropertyCard/PropertyCard";
import EmptyState from "@/components/EmptyState/EmptyState";
import Spinner from "@/components/Spinner/Spinner";
import Toast from "@/components/Toast/Toast";
import styles from "./PropertyList.module.css";

/* PropertyList page */
const PropertyList = () => {
  const { properties, isLoading, error, setError } = useProperties();
  const {
    isSuperhost,
    setIsSuperhost,
    guestCount,
    setGuestCount,
    filteredByGuests,
  } = usePropertyFilters(properties);

  if (isLoading) return <Spinner />;

  return (
    <div className={styles.propertyListPage}>
      {/* === Error Toast === */}
      {error && (
        <Toast message={error} variant="error" onClose={() => setError(null)} />
      )}

      {properties.length === 0 ? (
        <EmptyState message="No properties found." />
      ) : (
        <>
          <PropertyListFilterPanel
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
        </>
      )}
    </div>
  );
};

export default PropertyList;
