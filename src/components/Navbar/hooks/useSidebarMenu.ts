import { useState, useCallback } from "react";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { useEscapeKey } from "@/hooks/useEscapeKey";

export interface UseSidebarMenuReturn {
  isOpen: boolean;
  closeMenu: () => void;
  toggleMenu: () => void;
}

// Hook for managing mobile sidebar menu (state, scroll lock, escape)
export const useSidebarMenu = (): UseSidebarMenuReturn => {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = useCallback(() => setIsOpen(false), []);
  const toggleMenu = useCallback(() => setIsOpen((prev) => !prev), []);

  useBodyScrollLock(isOpen, "scroll-lock");
  useEscapeKey(isOpen, closeMenu);

  return { isOpen, toggleMenu, closeMenu };
};
