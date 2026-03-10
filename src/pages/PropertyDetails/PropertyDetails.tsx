import { useParams, useLocation } from "react-router-dom";
import { useProperty } from "./hooks/useProperty";
import { useBookingForm } from "./hooks/useBookingForm";
import PropertyHeader from "./components/PropertyHeader/PropertyHeader";
import PropertyInfo from "./components/PropertyInfo/PropertyInfo";
import PropertyBookingPanel from "./components/PropertyBookingPanel/PropertyBookingPanel";
import PropertyBookingSummary from "./components/PropertyBookingSummary/PropertyBookingSummary";
import Divider from "@/components/Divider/Divider";
import type { Booking } from "@/types/booking";
import PropertyMap from "./components/PropertyMap/PropertyMap";
import EmptyState from "@/components/EmptyState/EmptyState";
import Spinner from "@/components/Spinner/Spinner";
import SuccessMessage from "@/components/SuccessMessage/SuccessMessage";
import Toast from "@/components/Toast/Toast";
import { SUCCESS_MESSAGE } from "./propertyDetailsConfig";
import styles from "./PropertyDetails.module.css";

/* PropertyDetails page */
const PropertyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const bookingFromState = (location.state as { booking?: Booking } | null)
    ?.booking;

  const { property, isLoading, error, setError } = useProperty(id);

  // Hook must be called unconditionally to follow Rules of Hooks
  const bookingForm = useBookingForm(property ?? null);

  const handleSendInquiry = () => {
    // Placeholder for inquiry functionality
  };

  const isUserBookingForThisProperty =
    bookingFromState && property && bookingFromState.propertyId === property.id;

  if (isLoading) return <Spinner />;

  return (
    <div className={styles.propertyDetails}>
      {/* === Error Toast === */}
      {error && (
        <Toast message={error} variant="error" onClose={() => setError(null)} />
      )}
      {bookingForm.error && (
        <Toast
          message={bookingForm.error}
          variant="error"
          onClose={() => bookingForm.setError(null)}
        />
      )}

      {/* === Success Message === */}
      {bookingForm.isSuccess && (
        <SuccessMessage
          title={SUCCESS_MESSAGE.title}
          message={SUCCESS_MESSAGE.message}
        />
      )}

      {error || !property ? (
        <EmptyState message={error ?? "Property not found."} />
      ) : (
        <>
          <PropertyHeader property={property} />
          <div className={styles.propertyContent}>
            <PropertyInfo property={property} />
            {isUserBookingForThisProperty && bookingFromState ? (
              <PropertyBookingSummary booking={bookingFromState} />
            ) : (
              <PropertyBookingPanel
                bookingForm={bookingForm}
                propertyId={property.id}
                maxGuests={property.capacity.guest}
                onSendInquiry={handleSendInquiry}
              />
            )}
          </div>
          <Divider variant="default" />
          <PropertyMap property={property} />
        </>
      )}
    </div>
  );
};

export default PropertyDetails;
