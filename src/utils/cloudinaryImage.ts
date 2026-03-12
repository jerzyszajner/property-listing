const CLOUDINARY_HOST = "res.cloudinary.com";
const CLOUDINARY_UPLOAD_SEGMENT = "/image/upload/";

const IMAGE_TRANSFORMATIONS = {
  thumbnail: "f_auto,q_auto,c_fill,w_400,h_225,dpr_auto",
  detail: "f_auto,q_auto,c_limit,w_1120,dpr_auto",
  blur: "f_auto,q_1,w_20,e_blur:2000",
} as const;

export type CloudinaryImageVariant = keyof typeof IMAGE_TRANSFORMATIONS;

const isCloudinaryUploadUrl = (url: string): boolean => {
  return (
    url.includes(CLOUDINARY_HOST) && url.includes(CLOUDINARY_UPLOAD_SEGMENT)
  );
};

// Utility for generating optimized Cloudinary image URLs for UI variants
export const getCloudinaryImageUrl = (
  url: string,
  variant: CloudinaryImageVariant,
): string => {
  if (!url || !isCloudinaryUploadUrl(url)) {
    return url;
  }

  const index = url.indexOf(CLOUDINARY_UPLOAD_SEGMENT);
  if (index === -1) {
    return url;
  }

  const prefix = url.slice(0, index);
  const suffix = url.slice(index + CLOUDINARY_UPLOAD_SEGMENT.length);
  if (!suffix) {
    return url;
  }

  const transformation = IMAGE_TRANSFORMATIONS[variant];
  return `${prefix}${CLOUDINARY_UPLOAD_SEGMENT}${transformation}/${suffix}`;
};
