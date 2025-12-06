import { useRef } from "react";
import { Pencil } from "lucide-react";
import fallbackImage from "@/assets/images/fallback.webp";
import styles from "./ProfileImage.module.css";

/* ProfileImage component */
const ProfileImage = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={styles.profileImage}>
      <img alt="Profile picture" src={fallbackImage} className={styles.image} />

      <button
        type="button"
        className={styles.editImageButton}
        onClick={handleImageButtonClick}
        aria-label="Edit profile image"
      >
        <Pencil className={styles.editImageIcon} />
        <input
          ref={fileInputRef}
          type="file"
          name="profileImage"
          accept=".jpg, .jpeg, .png, .webp"
          className={styles.inputFile}
        />
      </button>
    </div>
  );
};

export default ProfileImage;
