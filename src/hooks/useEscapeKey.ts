import { useEffect } from "react";

// Hook for managing escape key to close
export const useEscapeKey = (isActive: boolean, onClose: () => void) => {
  useEffect(() => {
    if (!isActive) return;
    const handle = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, [isActive, onClose]);
};
