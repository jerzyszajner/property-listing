import { useEffect } from "react";

// Hook for stop scrolling when overlay is open
export const useBodyScrollLock = (
  isLocked: boolean,
  className = "scroll-lock"
) => {
  useEffect(() => {
    if (isLocked) {
      document.body.classList.add(className);
    } else {
      document.body.classList.remove(className);
    }

    return () => {
      document.body.classList.remove(className);
    };
  }, [isLocked, className]);
};
