import type { Property } from "@/types/property";
import {
  Wifi,
  Waves,
  Utensils,
  Flame,
  Home,
  ChefHat,
  Users,
} from "lucide-react";
import Divider from "@/components/Divider/Divider";
import styles from "./PropertyInfo.module.css";

interface PropertyInfoProps {
  property: Property;
}

/* PropertyInfo component */
const PropertyInfo = ({ property }: PropertyInfoProps) => {
  const hostName = "Lars";
  const hostImage = "https://randomuser.me/api/portraits/men/32.jpg";
  const bedrooms = property.capacity.bedroom;
  const persons = property.capacity.people;

  const amenities = [
    { icon: Wifi, label: "Wifi" },
    { icon: Waves, label: "Washer" },
    { icon: ChefHat, label: "BBQ grill" },
    { icon: Home, label: "Private patio or balcony" },
    { icon: Utensils, label: "Full kitchen" },
    { icon: Flame, label: "Indoor fireplace" },
  ];
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
        <p>{property.description}</p>
      </div>

      <Divider />

      {/* === Amenities === */}
      <div className={styles.amenities}>
        <h3 className={styles.amenitiesTitle}>What this place offers</h3>
        <div className={styles.amenitiesGrid}>
          {amenities.map((amenity, index) => {
            const Icon = amenity.icon;
            return (
              <div key={index} className={styles.amenityItem}>
                <Icon className={styles.amenityIcon} />
                <span>{amenity.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PropertyInfo;
