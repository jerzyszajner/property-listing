import { useNavigate } from "react-router-dom";
import type { Booking } from "@/types/booking";
import { CalendarDays, Users } from "lucide-react";
import { formatDate, formatPrice } from "@/utils/helpers";
import Button from "@/components/Button/Button";
import styles from "./BookingCard.module.css";

interface BookingCardProps {
  booking: Booking;
  onCancel: (bookingId: string) => void;
  isCancelling?: boolean;
}

/* BookingCard component */
const BookingCard = ({
  booking,
  onCancel,
  isCancelling = false,
}: BookingCardProps) => {
  const navigate = useNavigate();
  const {
    id,
    propertyId,
    propertyTitle,
    propertyImage,
    checkIn,
    checkOut,
    guests,
    nights,
    totalPrice,
  } = booking;

  const checkInDate = formatDate(checkIn);
  const checkOutDate = formatDate(checkOut);

  const handleCardClick = () => {
    navigate(`/property/${propertyId}`, { state: { booking } });
  };

  const handleCancelClick = (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.stopPropagation();
    onCancel(id);
  };

  return (
    <li className={styles.card} onClick={handleCardClick}>
      {/* === Image section === */}
      <div className={styles.imageWrapper}>
        <img src={propertyImage} alt={propertyTitle} className={styles.image} />
      </div>

      {/* === Content section === */}
      <div className={styles.content}>
        <h3 className={styles.title}>{propertyTitle}</h3>

        {/* === Dates section === */}
        <div className={styles.dates}>
          <span className={styles.dateItem}>
            <CalendarDays className={styles.dateIcon} />
            <span className={styles.dateLabel}>Check-in:</span>
            <span className={styles.dateValue}>{checkInDate || "N/A"}</span>
          </span>
          <span className={styles.dateItem}>
            <CalendarDays className={styles.dateIcon} />
            <span className={styles.dateLabel}>Check-out:</span>
            <span className={styles.dateValue}>{checkOutDate || "N/A"}</span>
          </span>
        </div>

        {/* === Details section === */}
        <div className={styles.details}>
          <span className={styles.detailItem}>
            <Users className={styles.detailIcon} />
            {guests} {guests === 1 ? "guest" : "guests"}
          </span>
          <span className={styles.detailItem}>
            {nights} {nights === 1 ? "night" : "nights"}
          </span>
        </div>

        {/* === Footer section === */}
        <div className={styles.footer}>
          <span className={styles.price}>
            Total: ${formatPrice(totalPrice)}
          </span>
          <Button
            variant="danger"
            onClick={handleCancelClick}
            disabled={isCancelling}
          >
            {isCancelling ? "Cancelling..." : "Cancel"}
          </Button>
        </div>
      </div>
    </li>
  );
};

export default BookingCard;
