import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { database } from "@/config/firebaseConfig";
import type { CreateUserProfile, UserProfile } from "@/types/user";

// Service function for creating user profile in Firestore database
export const createUserProfile = async (
  uid: string,
  profileData: CreateUserProfile
): Promise<void> => {
  await setDoc(doc(database, "users", uid), {
    firstName: profileData.firstName,
    lastName: profileData.lastName,
    email: profileData.email,
    phone: profileData.phone,
    createdAt: serverTimestamp(),
  });
};

// Service function for fetching user profile from Firestore database
export const fetchUserProfile = async (
  uid: string
): Promise<UserProfile | null> => {
  const docRef = doc(database, "users", uid);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  const data = docSnap.data();
  return {
    uid,
    email: data.email ?? null,
    firstName: data.firstName ?? null,
    lastName: data.lastName ?? null,
    phone: data.phone ?? null,
    createdAt: data.createdAt ?? null,
  };
};
