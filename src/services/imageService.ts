import { cloudinaryConfig } from "@/config/cloudinaryConfig";

export interface UploadImageResult {
  url: string;
}

// Service function for uploading user profile image to Cloudinary
export const uploadUserImage = async (
  file: File
): Promise<UploadImageResult> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "user_profile");

  const response = await fetch(cloudinaryConfig.uploadUrl, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      error.error?.message || "Failed to upload image to Cloudinary"
    );
  }

  const data = await response.json();

  return {
    url: data.secure_url,
  };
};
