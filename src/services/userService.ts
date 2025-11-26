import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { database } from "@/config/firebaseConfig";

// Service function for creating user profile in Firestore database
export const createUserProfile = async (
  uid: string,
  profileData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  }
): Promise<void> => {
  await setDoc(doc(database, "users", uid), {
    firstName: profileData.firstName,
    lastName: profileData.lastName,
    email: profileData.email,
    phone: profileData.phone,
    createdAt: serverTimestamp(),
  });
};
