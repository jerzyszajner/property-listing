import { MapPin } from "lucide-react";
import type { Property } from "@/types/property";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { googleMapsConfig } from "@/services/googleMapsConfig";
import Spinner from "@/components/Spinner/Spinner";
import styles from "./PropertyMap.module.css";

interface PropertyMapProps {
  property: Property;
}

/* PropertyMap component */
const PropertyMap = ({ property }: PropertyMapProps) => {
  const location = property.location ?? "";
  const coordinates = property.coordinates;
  const mapsUrl = coordinates
    ? `https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}`
    : undefined;

  const formatCoordinate = (value: number) => value.toFixed(4);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: googleMapsConfig.apiKey,
  });

  if (!isLoaded) {
    return <Spinner />;
  }

  if (loadError) {
    return <div>Error: {loadError.message}</div>;
  }

  if (!coordinates) {
    return (
      <div className={styles.map}>
        <h3 className={styles.title}>Where you'll be</h3>
        <p>No coordinates available for this property.</p>
      </div>
    );
  }

  return (
    <div className={styles.map}>
      {/* === Title === */}
      <h3 className={styles.title}>Where you'll be</h3>

      {/* === Location === */}
      <div className={styles.location}>
        <MapPin className={styles.locationIcon} />
        <span className={styles.locationText}>
          {location} | {formatCoordinate(coordinates.lat)}° N,{" "}
          {formatCoordinate(coordinates.lng)}° E
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.directionsLink}
          >
            Get Directions
          </a>
        </span>
      </div>

      {/* === Google Map === */}
      <GoogleMap
        center={coordinates}
        zoom={10}
        mapContainerClassName={styles.mapContainer}
      >
        <Marker position={coordinates} />
      </GoogleMap>
    </div>
  );
};

export default PropertyMap;
