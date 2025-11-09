import type { Property } from "@/types/property";
import { Home, Users } from "lucide-react";
import Divider from "@/components/Divider/Divider";
import { AMENITIES_CONFIG } from "./propertyInfoConfig";
import styles from "./PropertyInfo.module.css";

interface PropertyInfoProps {
  property: Property;
}

/* PropertyInfo component */
const PropertyInfo = ({ property }: PropertyInfoProps) => {
  const hostName = property.host?.name;
  const hostImage = property.host?.image;
  const bedrooms = property.capacity?.bedroom;
  const persons = property.capacity?.people;
  const amenities = property.amenities ?? [];
  const description = property.description ?? "";

  const amenitiesToShow = AMENITIES_CONFIG.filter(({ key }) =>
    amenities.includes(key)
  );

  return (
    <div className={styles.info}>
      {/* === Host Section === */}
      <div className={styles.hostSection}>
        <div className={styles.hostInfo}>
          <h2 className={styles.hostText}>Cabin hosted by {hostName}</h2>
          <img src={hostImage} alt={hostName} className={styles.hostImage} />
        </div>
      </div>

      {/* === Capacity section === */}
      <div className={styles.capacitySection}>
        <span className={styles.capacityItem}>
          <Home className={styles.capacityIcon} />
          {bedrooms} bedroom
        </span>
        <span className={styles.capacityItem}>
          <Users className={styles.capacityIcon} />
          {persons} person
        </span>
      </div>

      <Divider />

      {/* === Description === */}
      <div className={styles.description}>
        <p>{description}</p>
      </div>

      <Divider />

      {/* === Amenities === */}
      <div className={styles.amenities}>
        <h3 className={styles.amenitiesTitle}>What this place offers</h3>
        <div className={styles.amenitiesGrid}>
          {amenitiesToShow.map(({ key, icon: Icon, label }) => (
            <div key={key} className={styles.amenityItem}>
              <Icon className={styles.amenityIcon} />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PropertyInfo;
