import { useState } from "react";
import { MapPin } from "lucide-react";
import type { Property } from "@/types/property";
import {
  GoogleMap,
  Marker,
  useJsApiLoader,
  InfoWindow,
} from "@react-google-maps/api";
import { googleMapsConfig } from "@/config/googleMapsConfig";
import Spinner from "@/components/Spinner/Spinner";
import styles from "./PropertyMap.module.css";

interface PropertyMapProps {
  property: Property;
}

/* PropertyMap component */
const PropertyMap = ({ property }: PropertyMapProps) => {
  const title = property.title ?? "";
  const image = property.image ?? "";
  const address = property.address;
  const street = address.street;
  const number = address.number;
  const postalCode = address.postalCode;
  const city = address.city;
  const country = address.country;
  const coordinates = property.coordinates ?? { lat: 0, lng: 0 };

  const fullAddress = `${street} ${number}, ${postalCode} ${city}, ${country}`;
  const directionsUrl = fullAddress
    ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
        fullAddress
      )}`
    : undefined;
  const viewOnMapUrl = fullAddress
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        fullAddress
      )}`
    : undefined;

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: googleMapsConfig.apiKey,
  });

  const [infoOpen, setInfoOpen] = useState(true);

  if (!isLoaded) {
    return <Spinner />;
  }
  return (
    <div className={styles.map}>
      {/* === Title === */}
      <h3 className={styles.title}>Where you'll be</h3>

      {/* === Location === */}
      <div className={styles.locationContainer}>
        <MapPin className={styles.locationIcon} />
        <span className={styles.locationText}>
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            {fullAddress}
          </a>
        </span>
      </div>

      {/* === Google Map === */}
      <GoogleMap
        center={coordinates}
        zoom={15}
        mapContainerClassName={styles.mapContainer}
        onClick={() => setInfoOpen(false)}
      >
        <Marker position={coordinates} onClick={() => setInfoOpen(true)} />

        {infoOpen && (
          <InfoWindow
            position={coordinates}
            onCloseClick={() => setInfoOpen(false)}
            options={{
              pixelOffset: new google.maps.Size(0, -43),
              headerContent: `${title}`,
            }}
          >
            <div className={styles.infoWindowContent}>
              <img src={image} alt={title} className={styles.image} />
              <div className={styles.infoContent}>
                <div>
                  {street} {number}
                </div>
                <div>{postalCode}</div>
                <div>{city}</div>
                <div>{country}</div>
                <a
                  href={viewOnMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  View on Google Maps
                </a>
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default PropertyMap;
