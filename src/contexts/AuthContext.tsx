import { createContext, useEffect, useState, useContext } from "react";
import type { ReactNode } from "react";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import { auth } from "@/config/firebaseConfig";
import {
  signOut as authSignOut,
  getAuthErrorMessage,
} from "@/services/authService";

export interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

/* AuthProvider component to manage authentication state */
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async (): Promise<void> => {
    setError(null);
    try {
      await authSignOut();
    } catch (err) {
      setError(getAuthErrorMessage(err));
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, signOut: handleSignOut, error }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/* eslint-disable react-refresh/only-export-components */
export const useAuthContext = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within a AuthProvider");
  }
  return context;
};
