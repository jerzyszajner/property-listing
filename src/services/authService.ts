import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider,
  type UserCredential,
  type User,
} from "firebase/auth";
import { auth } from "@/config/firebaseConfig";

// Helper function for mapping Firebase errors to user friendly messages
export const getAuthErrorMessage = (error: unknown): string => {
  const code = (error as { code?: string })?.code;

  switch (code) {
    case "auth/email-already-in-use":
      return "This email is already registered. Please sign in instead of creating a new account.";
    case "auth/invalid-email":
      return "Invalid email address";
    case "auth/weak-password":
      return "Password should be at least 8 characters";
    case "auth/invalid-credential":
      return "Invalid email or password. Used Google before? Continue with Google instead.";
    case "auth/wrong-password":
      return "Wrong password";
    case "auth/user-disabled":
      return "This account has been disabled";
    case "auth/too-many-requests":
      return "Too many requests. Please try again later";
    case "auth/popup-closed-by-user":
      return "Sign in cancelled";
    case "auth/popup-blocked":
      return "Popup blocked. Please allow popups for this site";
    case "auth/account-exists-with-different-credential":
      return "An account already exists with this email";

    // Network and system errors
    case "auth/network-request-failed":
      return "Network error. Please check your connection";
    case "auth/internal-error":
      return "An internal error occurred. Please try again";

    default:
      return "An error occurred. Please try again";
  }
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

  return userCredential;
};

// Service function for user sign in with Firebase Auth
export const signIn = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  return userCredential;
};

// Service function for user sign out with Firebase Auth
export const signOut = async (): Promise<void> => {
  await firebaseSignOut(auth);
};

// Service function for user reset password with Firebase Auth
export const resetPassword = async (email: string): Promise<void> => {
  await sendPasswordResetEmail(auth, email);
};

// Service function for updating user data with Firebase Auth
export const updateUser = async (): Promise<User | null> => {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    return null;
  }
  await currentUser.reload();
  await currentUser.getIdToken(true);
  return currentUser;
};

// Service function for user email verification with Firebase Auth
export const emailVerification = async (): Promise<void> => {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error("No user is currently signed in");
  }
  await sendEmailVerification(currentUser);
};

// Service function for Google Sign-In
export const signInWithGoogle = async (): Promise<UserCredential> => {
  const provider = new GoogleAuthProvider();
  provider.addScope("profile");
  provider.addScope("email");

  const result = await signInWithPopup(auth, provider);
  return result;
};
