import type { Property } from "@/types/property";
import { Star, ShieldCheck, Home, Users } from "lucide-react";
import { Link } from "react-router-dom";
import styles from "./PropertyCard.module.css";

interface PropertyCardProps {
  property: Property;
}

/* PropertyCard component */
const PropertyCard = ({ property }: PropertyCardProps) => {
  const id = property.id;
  const image = property.image ?? "";
  const title = property.title ?? "";
  const description = property.description ?? "";
  const price = property.price ?? 0;
  const rating = property.rating ?? 0;
  const isSuperhost = property.superhost ?? false;
  const bedrooms = property.capacity?.bedroom ?? 0;
  const guests = property.capacity?.people ?? 0;

  return (
    <li className={styles.card}>
      <Link to={`/property/${id}`} className={styles.link}>
        {/* === Image section === */}
        <div className={styles.imageWrapper}>
          <img src={image} alt={title} className={styles.image} />

          {isSuperhost && (
            <span className={styles.hostBadge}>
              Superhost <ShieldCheck className={styles.hostIcon} />
            </span>
          )}
        </div>

        {/* === Content section === */}
        <div className={styles.content}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.description}>{description}</p>

          {/* === Capacity section === */}
          <div className={styles.capacity}>
            <span className={styles.capacityItem}>
              <Home className={styles.capacityIcon} />
              {bedrooms} {bedrooms === 1 ? "bedroom" : "bedrooms"}
            </span>
            <span className={styles.capacityItem}>
              <Users className={styles.capacityIcon} />
              {guests} {guests === 1 ? "guest" : "guests"}
            </span>
          </div>

          {/* === Footer section === */}
          <div className={styles.footer}>
            <span className={styles.price}>
              ${price}
              <span className={styles.priceUnit}>/night</span>
            </span>

            <span className={styles.rating}>
              <Star className={styles.ratingIcon} />
              {rating}
            </span>
          </div>
        </div>
      </Link>
    </li>
  );
};

export default PropertyCard;
