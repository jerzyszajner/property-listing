import { useState } from "react";
import { useParams } from "react-router-dom";
import { useProperty } from "./hooks/useProperty";
import PropertyHeader from "./components/PropertyHeader/PropertyHeader";
import PropertyInfo from "./components/PropertyInfo/PropertyInfo";
import BookingPanel from "./components/BookingPanel/BookingPanel";
import Divider from "@/components/Divider/Divider";
import PropertyMap from "./components/PropertyMap/PropertyMap";
import styles from "./PropertyDetails.module.css";

/* PropertyDetails page */
const PropertyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { property, isLoading, error } = useProperty(id);
  const [guestCount, setGuestCount] = useState("");

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!property) return <div>No property</div>;
  return (
    <div className={styles.propertyDetails}>
      <PropertyHeader property={property} />
      <div className={styles.propertyContent}>
        <PropertyInfo property={property} />
        <BookingPanel
          property={property}
          guestCount={guestCount}
          onGuestCountChange={setGuestCount}
        />
      </div>
      <Divider />
      <PropertyMap property={property} />
    </div>
  );
};

export default PropertyDetails;
