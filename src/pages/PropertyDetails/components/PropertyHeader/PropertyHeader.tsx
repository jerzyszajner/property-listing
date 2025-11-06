import { Link } from "react-router-dom";
import type { Property } from "@/types/property";
import { Star, ShieldCheck, MapPin, ArrowLeft } from "lucide-react";
import styles from "./PropertyHeader.module.css";

interface PropertyHeaderProps {
  property: Property;
}

const PropertyHeader = ({ property }: PropertyHeaderProps) => {
  return (
    <header className={styles.header}>
      {/* === Back Link === */}
      <Link to={"/"} className={styles.link}>
        <ArrowLeft className={styles.linkIcon} />
        <span className={styles.linkText}>Go to Home</span>
      </Link>

      {/* === Title === */}
      <h1 className={styles.title}>{property.title}</h1>

      {/* === Meta Info === */}
      <div className={styles.meta}>
        <div className={styles.rating}>
          <Star className={styles.ratingIcon} />
          <span className={styles.ratingText}>{property.rating}</span>
        </div>

        {property.superhost && (
          <div className={styles.host}>
            <ShieldCheck className={styles.hostIcon} />
            <span className={styles.hostText}>Superhost</span>
          </div>
        )}

        <div className={styles.location}>
          <MapPin className={styles.locationIcon} />
          <span className={styles.locationText}>{property.location}</span>
        </div>
      </div>

      {/* === Property Image  === */}
      <div className={styles.imageWrapper}>
        <img
          src={property.image}
          alt={property.title}
          className={styles.image}
        />
      </div>
    </header>
  );
};

export default PropertyHeader;
