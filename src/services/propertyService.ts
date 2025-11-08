import type { Property } from "@/types/property";
import { database } from "./firebaseConfig";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";

// Service function for fetching all properties from Firestore
export const fetchProperties = async (): Promise<Property[]> => {
  const querySnapshot = await getDocs(collection(database, "properties"));

  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title ?? "",
      amenities: (data.amenities as string[]) ?? [],
      description: data.description ?? "",
      price: Number(data.price ?? 0),
      rating: Number(data.rating ?? 0),
      superhost: Boolean(data.superhost),
      location: data.location ?? "",
      image: data.image ?? "",
      capacity: {
        people: Number(data.capacity?.people ?? 0),
        bedroom: Number(data.capacity?.bedroom ?? 0),
      },
    };
  });
};

// Service function for fetching a single property by id from Firestore
export const fetchPropertyById = async (
  id: string
): Promise<Property | null> => {
  const docSnapshot = await getDoc(doc(database, "properties", id));
  if (!docSnapshot.exists()) {
    return null;
  }
  const data = docSnapshot.data();
  return {
    id: docSnapshot.id,
    title: data.title ?? "",
    amenities: (data.amenities as string[]) ?? [],
    description: data.description ?? "",
    price: Number(data.price ?? 0),
    rating: Number(data.rating ?? 0),
    superhost: Boolean(data.superhost),
    location: data.location ?? "",
    image: data.image ?? "",
    capacity: {
      people: Number(data.capacity?.people ?? 0),
      bedroom: Number(data.capacity?.bedroom ?? 0),
    },
  };
};
