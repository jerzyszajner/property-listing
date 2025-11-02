import type { Property } from "@/types/property";
import { Star, Home, Users } from "lucide-react";
import styles from "./PropertyCard.module.css";

interface PropertyCardProps {
  property: Property;
}

/* PropertyCard component */
const PropertyCard = ({ property }: PropertyCardProps) => {
  return (
    <li className={styles.card}>
      {/* === Image section === */}
      <div className={styles.imageWrapper}>
        <img
          src={property.image}
          alt={property.title}
          className={styles.image}
        />

        {property.superhost && (
          <span className={styles.superhostBadge}>
            Superhost <Star className={styles.superhostIcon} />
          </span>
        )}
      </div>

      {/* === Content section === */}
      <div className={styles.content}>
        <h3 className={styles.title}>{property.title}</h3>
        <p className={styles.description}>{property.description}</p>

        {/* === Capacity section === */}
        <div className={styles.capacity}>
          <span className={styles.capacityItem}>
            <Home className={styles.capacityIcon} />
            {property.capacity.bedroom} bedroom
            {property.capacity.bedroom > 1 ? "s" : ""}
          </span>
          <span className={styles.capacityItem}>
            <Users className={styles.capacityIcon} />
            {property.capacity.people} person
            {property.capacity.people > 1 ? "s" : ""}
          </span>
        </div>

        {/* === Footer section === */}
        <div className={styles.footer}>
          <span className={styles.price}>
            ${property.price}
            <span className={styles.priceUnit}>/night</span>
          </span>

          <span className={styles.rating}>
            <Star className={styles.ratingIcon} />
            {property.rating}
          </span>
        </div>
      </div>
    </li>
  );
};

export default PropertyCard;
