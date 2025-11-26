// User type for Firestore user profile
export type User = {
  uid: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
};
