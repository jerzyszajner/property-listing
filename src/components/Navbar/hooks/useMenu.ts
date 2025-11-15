import { useState, useEffect } from "react";

export interface UseMenuReturn {
  isOpen: boolean;
  closeMenu: () => void;
  toggleMenu: () => void;
}

// Hook for managing mobile menu state and body scroll lock
export const useMenu = (): UseMenuReturn => {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);
  const toggleMenu = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("menu-open");
    } else {
      document.body.classList.remove("menu-open");
    }

    return () => {
      document.body.classList.remove("menu-open");
    };
  }, [isOpen]);

  return { isOpen, toggleMenu, closeMenu };
};
