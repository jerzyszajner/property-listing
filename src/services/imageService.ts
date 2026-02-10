import { cloudinaryConfig } from "@/config/cloudinaryConfig";

export interface UploadImageResult {
  url: string;
}

// Service function for uploading image to Cloudinary with specified preset
export const uploadImage = async (
  file: File,
  preset: string
): Promise<UploadImageResult> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", preset);

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

// Service function for uploading user profile image to Cloudinary
export const uploadUserImage = async (
  file: File
): Promise<UploadImageResult> => {
  return uploadImage(file, "user_profile");
};

// Service function for uploading property image to Cloudinary
export const uploadPropertyImage = async (
  file: File
): Promise<UploadImageResult> => {
  return uploadImage(file, "property_image");
};
