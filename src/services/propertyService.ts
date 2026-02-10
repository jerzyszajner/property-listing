import type { Property, CreatePropertyData } from "@/types/property";
import { database } from "@/config/firebaseConfig";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
} from "firebase/firestore";

// Helper function for mapping Firestore document to Property
const mapDocumentToProperty = (document: {
  id: string;
  data: () => Record<string, unknown> | undefined;
}): Property => {
  const data = document.data();

  return {
    id: document.id,
    hostId: (data?.hostId as string) ?? "",
    title: (data?.title as string) ?? "",
    amenities: (data?.amenities as string[]) ?? [],
    description: (data?.description as string) ?? "",
    price: Number(data?.price ?? 0),
    rating: Number(data?.rating ?? 0),
    superhost: Boolean(data?.superhost),
    address: {
      street: (data?.address as { street?: string })?.street ?? "",
      zipCode: (data?.address as { zipCode?: string })?.zipCode ?? "",
      city: (data?.address as { city?: string })?.city ?? "",
      country: (data?.address as { country?: string })?.country ?? "",
    },
    image: (data?.image as string) ?? "",
    capacity: {
      guest: Number((data?.capacity as { guest?: number })?.guest ?? 0),
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
  id: string,
): Promise<Property | null> => {
  const docSnapshot = await getDoc(doc(database, "properties", id));

  if (!docSnapshot.exists()) {
    return null;
  }

  return mapDocumentToProperty(docSnapshot);
};

// Service function for creating property
export const createProperty = async (
  uid: string,
  data: CreatePropertyData,
): Promise<string> => {
  const docRef = await addDoc(collection(database, "properties"), {
    hostId: uid,
    title: data.title,
    description: data.description,
    price: data.price,
    rating: data.rating,
    superhost: data.superhost,
    image: data.image,
    address: data.address,
    amenities: data.amenities,
    capacity: data.capacity,
    host: data.host,
    ...(data.coordinates && { coordinates: data.coordinates }),
  });
  return docRef.id;
};

// Service function for updating host info in all user properties
export const updateUserPropertiesHostInfo = async (
  hostId: string,
  hostName: string,
  hostImage: string,
): Promise<void> => {
  const propertiesQuery = query(
    collection(database, "properties"),
    where("hostId", "==", hostId),
  );
  const querySnapshot = await getDocs(propertiesQuery);

  const updatePromises = querySnapshot.docs.map((propertyDoc) =>
    updateDoc(propertyDoc.ref, {
      host: {
        name: hostName.trim().toLowerCase(),
        image: hostImage,
      },
    }),
  );

  await Promise.all(updatePromises);
};
