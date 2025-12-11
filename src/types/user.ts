import type { Timestamp } from "firebase/firestore";

// User types for Firestore database
export type UserProfile = {
  uid: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  accountCreatedAt: Timestamp | null;
  updatedAt: Timestamp | null;
};

export type CreateUserProfile = {
  email: string;
};

export type UpdateUserProfile = {
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
};
