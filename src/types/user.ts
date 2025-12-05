// User types for Firestore database
export type CreateUserProfile = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

export type UserProfile = {
  uid: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
};
