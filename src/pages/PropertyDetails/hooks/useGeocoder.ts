import { useState, useEffect } from "react";

export interface UseGeocoderReturn {
  coordinates: { lat: number; lng: number } | null;
  isLoading: boolean;
}

/* Hook for geocoding address to coordinates */
export const useGeocoder = (
  address: string,
  isLoaded: boolean,
): UseGeocoderReturn => {
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!isLoaded || !address) return;

    setIsLoading(true);

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address }, (results, status) => {
      setIsLoading(false);

      if (status === google.maps.GeocoderStatus.OK && results?.[0]) {
        const location = results[0].geometry.location;
        setCoordinates({
          lat: location.lat(),
          lng: location.lng(),
        });
      } else {
        setCoordinates(null);
      }
    });
  }, [isLoaded, address]);

  return {
    coordinates,
    isLoading,
  };
};
