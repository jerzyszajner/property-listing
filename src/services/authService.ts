import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  type UserCredential,
} from "firebase/auth";
import { auth } from "@/config/firebaseConfig";

// Helper function for mapping Firebase errors to user friendly messages
export const getAuthErrorMessage = (error: unknown): string => {
  if (error instanceof Error && "code" in error) {
    const code = (error as { code: string }).code;
    switch (code) {
      case "auth/email-already-in-use":
        return "Email already in use";
      case "auth/invalid-email":
        return "Invalid email address";
      case "auth/weak-password":
        return "Password should be at least 6 characters";
      case "auth/user-not-found":
        return "User not found";
      case "auth/wrong-password":
        return "Wrong password";
      case "auth/too-many-requests":
        return "Too many requests. Please try again later";
      case "auth/user-disabled":
        return "This account has been disabled";
      default:
        return "An error occurred. Please try again";
    }
  }
  return "An error occurred. Please try again";
};

// Service function for user sign up with Firebase Auth
export const signUp = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  const user = userCredential.user;

  await sendEmailVerification(user);
  console.log("Email verification sent");

  return userCredential;
};
