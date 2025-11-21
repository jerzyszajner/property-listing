import type { Property } from "@/types/property";
import { database } from "@/config/firebaseConfig";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";

// Helper function for mapping Firestore document to Property
const mapDocumentToProperty = (document: {
  id: string;
  data: () => Record<string, unknown> | undefined;
}): Property => {
  const data = document.data();

  return {
    id: document.id,
    title: (data?.title as string) ?? "",
    amenities: (data?.amenities as string[]) ?? [],
    description: (data?.description as string) ?? "",
    price: Number(data?.price ?? 0),
    rating: Number(data?.rating ?? 0),
    superhost: Boolean(data?.superhost),
    address: {
      street: (data?.address as { street?: string })?.street ?? "",
      number: (data?.address as { number?: string })?.number ?? "",
      postalCode: (data?.address as { postalCode?: string })?.postalCode ?? "",
      city: (data?.address as { city?: string })?.city ?? "",
      country: (data?.address as { country?: string })?.country ?? "",
    },
    coordinates: data?.coordinates
      ? {
          lat: Number((data.coordinates as { lat: number; lng: number }).lat),
          lng: Number((data.coordinates as { lat: number; lng: number }).lng),
        }
      : undefined,
    image: (data?.image as string) ?? "",
    capacity: {
      people: Number((data?.capacity as { people?: number })?.people ?? 0),
      bedroom: Number((data?.capacity as { bedroom?: number })?.bedroom ?? 0),
    },
    host: {
      name: (data?.host as { name?: string })?.name ?? "",
      image: (data?.host as { image?: string })?.image ?? "",
    },
  };
};

// Service function for fetching all properties from Firestore
export const fetchProperties = async (): Promise<Property[]> => {
  const querySnapshot = await getDocs(collection(database, "properties"));
  return querySnapshot.docs.map(mapDocumentToProperty);
};

// Service function for fetching a single property by id from Firestore
export const fetchPropertyById = async (
  id: string
): Promise<Property | null> => {
  const docSnapshot = await getDoc(doc(database, "properties", id));

  if (!docSnapshot.exists()) {
    return null;
  }

  return mapDocumentToProperty(docSnapshot);
};
