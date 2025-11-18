import { useProperties } from "@/hooks/useProperties";
import { useFeaturedProperties } from "../../hooks/useFeaturedProperties";
import PropertyCard from "@/components/PropertyCard/PropertyCard";
import SectionHeader from "../SectionHeader/SectionHeader";
import Spinner from "@/components/Spinner/Spinner";
import { SECTION_HEADER_CONFIG } from "./featuredPropertiesConfig";
import styles from "./FeaturedProperties.module.css";

/* FeaturedProperties component */
const FeaturedProperties = () => {
  const { properties, isLoading, error } = useProperties();
  const { featuredProperties } = useFeaturedProperties(properties);

  if (isLoading) return <Spinner />;
  if (error) return null;
  if (featuredProperties.length === 0) return null;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <SectionHeader
          title={SECTION_HEADER_CONFIG.title}
          subtitle={SECTION_HEADER_CONFIG.subtitle}
        />

        <ul className={styles.propertyList}>
          {featuredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </ul>
      </div>
    </section>
  );
};

export default FeaturedProperties;
