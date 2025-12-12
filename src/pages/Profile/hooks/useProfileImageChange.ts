import { useRef } from "react";

export interface UseProfileImageChangeReturn {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleImageButtonClick: () => void;
  handleImageChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => Promise<void>;
}

// Hook for profile image change interactions
export const useProfileImageChange = (
  uploadImage: (file: File) => Promise<void>
): UseProfileImageChangeReturn => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      await uploadImage(file);
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error("Failed to upload profile image:", err);
      }
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return {
    fileInputRef,
    handleImageButtonClick,
    handleImageChange,
  };
};
