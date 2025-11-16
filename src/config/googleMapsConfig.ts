const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

if (!apiKey) {
  console.error(
    "VITE_GOOGLE_MAPS_API_KEY is not defined in environment variables"
  );
}

export const googleMapsConfig = {
  apiKey: apiKey || "",
};
