const cloudinaryName = import.meta.env.VITE_CLOUDINARY_NAME;

if (!cloudinaryName) {
  console.error("VITE_CLOUDINARY_NAME is not defined in environment variables");
}

export const cloudinaryConfig = {
  cloudinaryName: cloudinaryName || "",
  uploadUrl: `https://api.cloudinary.com/v1_1/${
    cloudinaryName || ""
  }/image/upload`,
};
