import type { Property } from "../../types/property";
import PropertyCard from "../PropertyCard/PropertyCard";
import styles from "./PropertyList.module.css";

interface PropertyListProps {
  properties: Property[];
}

const PropertyList = ({ properties }: PropertyListProps) => {
  return (
    <ul className={styles.propertyList}>
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </ul>
  );
};

export default PropertyList;
