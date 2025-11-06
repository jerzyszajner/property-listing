import type { Property } from "@/types/property";
import HomePropertyCard from "../HomePropertyCard/HomePropertyCard";
import EmptyState from "@/components/EmptyState/EmptyState";
import styles from "./HomePropertyList.module.css";

interface HomePropertyListProps {
  properties: Property[];
}

/* HomePropertyList component */
const HomePropertyList = ({ properties }: HomePropertyListProps) => {
  if (properties.length === 0) {
    return <EmptyState message="No properties found matching your filters." />;
  }

  return (
    <ul className={styles.propertyList}>
      {properties.map((property) => (
        <HomePropertyCard key={property.id} property={property} />
      ))}
    </ul>
  );
};

export default HomePropertyList;
