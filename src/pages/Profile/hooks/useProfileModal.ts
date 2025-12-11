import { useEffect, useState } from "react";
import type { useEditProfileForm } from "./useEditProfileForm";
// import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";

// Hook for profile modal
export const useProfileModal = (
  editForm: ReturnType<typeof useEditProfileForm>
) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // useBodyScrollLock(isModalOpen, "scroll-lock");

  useEffect(() => {
    if (editForm.isSuccess) {
      setIsModalOpen(false);
    }
  }, [editForm.isSuccess]);

  const openModal = () => setIsModalOpen(true);

  const closeModal = () => {
    setIsModalOpen(false);
    editForm.resetForm();
    editForm.setError(null);
  };

  return { isModalOpen, openModal, closeModal };
};
