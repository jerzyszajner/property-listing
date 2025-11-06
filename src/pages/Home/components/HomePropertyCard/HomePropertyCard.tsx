import type { Property } from "@/types/property";
import { Star, ShieldCheck, Home, Users } from "lucide-react";
import { Link } from "react-router-dom";
import styles from "./HomePropertyCard.module.css";

interface HomePropertyCardProps {
  property: Property;
}

/* HomePropertyCard component */
const HomePropertyCard = ({ property }: HomePropertyCardProps) => {
  return (
    <li className={styles.card}>
      <Link to={`/property/${property.id}`} className={styles.link}>
        {/* === Image section === */}
        <div className={styles.imageWrapper}>
          <img
            src={property.image}
            alt={property.title}
            className={styles.image}
          />

          {property.superhost && (
            <span className={styles.hostBadge}>
              Superhost <ShieldCheck className={styles.hostIcon} />
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
            </span>
            <span className={styles.capacityItem}>
              <Users className={styles.capacityIcon} />
              {property.capacity.people} person
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
      </Link>
    </li>
  );
};

export default HomePropertyCard;
