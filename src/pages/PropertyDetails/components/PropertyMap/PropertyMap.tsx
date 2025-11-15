import { MapPin, Star, X, ExternalLink } from "lucide-react";
import type { Property } from "@/types/property";
import {
  GoogleMap,
  Marker,
  useJsApiLoader,
  OverlayView,
} from "@react-google-maps/api";
import { googleMapsConfig } from "@/services/googleMapsConfig";
import Spinner from "@/components/Spinner/Spinner";
import { useState } from "react";
import styles from "./PropertyMap.module.css";

interface PropertyMapProps {
  property: Property;
}

/* PropertyMap component */
const PropertyMap = ({ property }: PropertyMapProps) => {
  const title = property.title ?? "";
  const image = property.image ?? "";
  const price = property.price ?? 0;
  const rating = property.rating ?? 0;
  const location = property.location ?? "";
  const coordinates = property.coordinates;
  const mapsUrl = coordinates
    ? `https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}`
    : undefined;

  const formatCoordinate = (value: number) => value.toFixed(4);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: googleMapsConfig.apiKey,
  });

  const [infoOpen, setInfoOpen] = useState(true);

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
        zoom={15}
        mapContainerClassName={styles.mapContainer}
        onClick={() => setInfoOpen(false)}
      >
        <Marker position={coordinates} onClick={() => setInfoOpen(true)} />

        {infoOpen && (
          <OverlayView
            position={coordinates}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          >
            <div
              className={styles.infoCard}
              onClick={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
            >
              <img src={image} alt={title} className={styles.image} />

              <div className={styles.text}>
                <div className={styles.titleContainer}>
                  <h4>{title}</h4>
                  <button
                    className={styles.closeButton}
                    onClick={() => setInfoOpen(false)}
                  >
                    <X className={styles.closeButtonIcon} />
                  </button>
                </div>

                <div className={styles.rating}>
                  <Star className={styles.ratingIcon} /> {rating}
                </div>
                <div className={styles.price}>${price}/night</div>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  Get Directions
                  <ExternalLink className={styles.linkIcon} />
                </a>
              </div>
            </div>
          </OverlayView>
        )}
      </GoogleMap>
    </div>
  );
};

export default PropertyMap;
