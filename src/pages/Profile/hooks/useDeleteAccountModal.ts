import { useState } from "react";
import type { useDeleteAccountForm } from "./useDeleteAccountForm";

// Hook for delete account modal
export const useDeleteAccountModal = (
  deleteForm: ReturnType<typeof useDeleteAccountForm>
) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);

  const closeModal = () => {
    setIsModalOpen(false);
    deleteForm.resetForm();
    deleteForm.setError(null);
  };

  return { isModalOpen, openModal, closeModal };
};
