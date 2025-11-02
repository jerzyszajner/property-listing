import type { Property } from "../../types/property";
import PropertyCard from "../PropertyCard/PropertyCard";
import EmptyState from "../EmptyState/EmptyState";
import styles from "./PropertyList.module.css";

interface PropertyListProps {
  properties: Property[];
}

const PropertyList = ({ properties }: PropertyListProps) => {
  if (properties.length === 0) {
    return <EmptyState message="No properties found matching your filters." />;
  }

  return (
    <ul className={styles.propertyList}>
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </ul>
  );
};

export default PropertyList;
