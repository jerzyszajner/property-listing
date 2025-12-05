import { useState, useEffect } from "react";
import { fetchUserProfile } from "@/services/userService";
import { useAuthContext } from "@/contexts/AuthContext";
import type { UserProfile } from "@/types/user";

export interface UseUserProfileReturn {
  userProfile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
}

// Hook for fetching user profile data
export const useUserProfile = (): UseUserProfileReturn => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuthContext();

  useEffect(() => {
    const loadUserProfile = async () => {
      if (!user) {
        setUserProfile(null);
        setIsLoading(false);
        return;
      }

      try {
        setError(null);
        setIsLoading(true);
        const data = await fetchUserProfile(user.uid);
        setUserProfile(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load user profile"
        );
        setUserProfile(null);
      } finally {
        setIsLoading(false);
      }
    };
    loadUserProfile();
  }, [user]);

  return { userProfile, isLoading, error };
};
