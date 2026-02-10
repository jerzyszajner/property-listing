import {
  doc,
  setDoc,
  serverTimestamp,
  onSnapshot,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { database } from "@/config/firebaseConfig";
import type {
  CreateUserProfile,
  UserProfile,
  UpdateUserProfile,
} from "@/types/user";
import { updateUserPropertiesHostInfo } from "@/services/propertyService";

// Service function for creating basic user profile in Firestore database
export const createUserProfile = async (
  uid: string,
  profileData: CreateUserProfile,
): Promise<void> => {
  const userRef = doc(database, "users", uid);

  await setDoc(
    userRef,
    {
      email: profileData.email,
      accountCreatedAt: serverTimestamp(),
    },
    { merge: true },
  );
};

// Service function for real-time user profile subscription
export const listenToUserProfile = (
  uid: string,
  onProfileChange: (profile: UserProfile | null) => void,
  onProfileError: (error: unknown) => void,
) => {
  const docRef = doc(database, "users", uid);

  return onSnapshot(
    docRef,
    (docSnap) => {
      if (!docSnap.exists()) {
        onProfileChange(null);
        return;
      }
      const data = docSnap.data();
      onProfileChange({
        uid,
        email: data.email ?? null,
        firstName: data.firstName ?? null,
        lastName: data.lastName ?? null,
        phone: data.phone ?? null,
        profileImage: data.profileImage ?? null,
        accountCreatedAt: data.accountCreatedAt ?? null,
        updatedAt: data.updatedAt ?? null,
      });
    },
    onProfileError,
  );
};

// Service function for updating user profile in Firestore database
export const updateUserProfile = async (
  uid: string,
  profileData: UpdateUserProfile,
): Promise<void> => {
  await setDoc(
    doc(database, "users", uid),
    {
      firstName: profileData.firstName ?? null,
      lastName: profileData.lastName ?? null,
      phone: profileData.phone ?? null,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );

  const userDoc = await getDoc(doc(database, "users", uid));
  if (userDoc.exists()) {
    const userData = userDoc.data();
    const firstName = (userData.firstName as string | null) ?? "";
    const profileImage = (userData.profileImage as string | null) ?? "";

    if (firstName || profileImage) {
      await updateUserPropertiesHostInfo(uid, firstName, profileImage);
    }
  }
};

// Service function for updating user profile image
export const updateUserProfileImage = async (
  uid: string,
  profileImageUrl: string,
): Promise<void> => {
  await setDoc(
    doc(database, "users", uid),
    {
      profileImage: profileImageUrl,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );

  const userDoc = await getDoc(doc(database, "users", uid));
  if (userDoc.exists()) {
    const userData = userDoc.data();
    const firstName = (userData.firstName as string | null) ?? "";

    if (firstName || profileImageUrl) {
      await updateUserPropertiesHostInfo(uid, firstName, profileImageUrl);
    }
  }
};

// Service function for deleting user profile from Firestore database
export const deleteUserProfile = async (uid: string): Promise<void> => {
  const userRef = doc(database, "users", uid);
  await deleteDoc(userRef);
};
