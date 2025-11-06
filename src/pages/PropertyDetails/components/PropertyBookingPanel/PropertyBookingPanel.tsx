import type { Property } from "@/types/property";
import { GUEST_OPTIONS } from "./guestOptions";
import Select from "@/components/Select/Select";
import Button from "@/components/Button/Button";
import Divider from "@/components/Divider/Divider";
import styles from "./PropertyBookingPanel.module.css";

interface PropertyBookingPanelProps {
  property: Property;
  guestCount: string;
  onGuestCountChange: (value: string) => void;
}

/* PropertyBookingPanel component */
const PropertyBookingPanel = ({
  property,
  guestCount,
  onGuestCountChange,
}: PropertyBookingPanelProps) => {
  const price = property.price;

  return (
    <div className={styles.panel}>
      {/* === Price === */}
      <div className={styles.price}>
        ${price}
        <span className={styles.priceUnit}>/night</span>
      </div>

      <div className={styles.inputGrupRow}>
        {/* === Check-in === */}
        <div className={styles.inputGroup}>
          <label htmlFor="check-inn" className={styles.label}>
            Check-in
          </label>
          <input type="date" id="check-inn" className={styles.input} />
        </div>

        {/* === Check-out === */}
        <div className={styles.inputGroup}>
          <label htmlFor="check-out" className={styles.label}>
            Check-out
          </label>
          <input type="date" id="check-out" className={styles.input} />
        </div>
      </div>

      {/* === Guests === */}
      <div className={styles.inputGroup}>
        <label htmlFor="guests" className={styles.label}>
          Guests
        </label>
        <Select
          options={GUEST_OPTIONS}
          value={guestCount}
          onChange={onGuestCountChange}
          placeholder="Choose guests"
          ariaLabel="Select number of guests"
          id="guests"
        />
      </div>

      {/* === Buttons === */}
      <div className={styles.buttons}>
        <Button variant="primary">Book Now</Button>
        <Button variant="filter">Send Inquiry</Button>
      </div>

      <span className={styles.disclaimer}>You won't be charged yet</span>

      <Divider />

      {/* === Price Summary === */}
      <div className={styles.priceSummary}>
        <div className={styles.priceItem}>
          <span className={styles.priceLabel}>$250 x 5 nights</span>
          <span className={styles.priceValue}>$1,250</span>
        </div>
        <div className={styles.priceItem}>
          <span className={styles.priceLabel}>Service fee</span>
          <span className={styles.priceValue}>$175</span>
        </div>

        <Divider />

        <div className={`${styles.priceItem} ${styles.priceTotal}`}>
          <span className={styles.priceLabel}>Total</span>
          <span className={styles.priceValue}>$1,425</span>
        </div>
      </div>
    </div>
  );
};

export default PropertyBookingPanel;
