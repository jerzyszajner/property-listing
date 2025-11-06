import { MapPin } from "lucide-react";
import type { Property } from "@/types/property";
import mapImage from "@/assets/images/map.png";
import styles from "./PropertyMap.module.css";

interface PropertyMapProps {
  property: Property;
}

/* PropertyMap component */
const PropertyMap = ({ property }: PropertyMapProps) => {
  return (
    <div className={styles.map}>
      {/* === Title === */}
      <h3 className={styles.title}>Where you'll be</h3>

      {/* === Location === */}
      <div className={styles.location}>
        <MapPin className={styles.locationIcon} />
        <span className={styles.locationText}>{property.location}</span>
      </div>

      {/* === Map Image === */}
      <img
        src={mapImage}
        alt={`Map showing location of ${property.location}`}
        className={styles.mapImage}
      />
    </div>
  );
};

export default PropertyMap;
