import { useLocation } from "react-router-dom";

export interface UseRedirectFromReturn {
  from: string;
}

// Hook for reading saved redirect location from route state
export const useRedirectFrom = (
  defaultPath: string = "/"
): UseRedirectFromReturn => {
  const location = useLocation();
  const from =
    (location.state as { from?: string } | null)?.from ?? defaultPath;

  return { from };
};
