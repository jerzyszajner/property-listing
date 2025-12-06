import { useUserProfile } from "@/hooks/useUserProfile";
import { PAGE_HEADER_CONFIG, PROFILE_FIELDS } from "./profileConfig";
import { formatDate } from "@/utils/helpers";
import Spinner from "@/components/Spinner/Spinner";
import PageHeader from "@/components/PageHeader/PageHeader";
import ProfileImage from "./components/ProfileImage/ProfileImage";
import Button from "@/components/Button/Button";
import Toast from "@/components/Toast/Toast";
import styles from "./Profile.module.css";

/* Profile page component */
const Profile = () => {
  const { userProfile, isLoading, error, setError } = useUserProfile();

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className={styles.profile}>
      {/* === Error Toast === */}
      {error && (
        <Toast message={error} variant="error" onClose={() => setError(null)} />
      )}

      {/* === Page Header === */}
      <PageHeader title={PAGE_HEADER_CONFIG.title} />

      {/* === Profile Image === */}
      <ProfileImage />

      <div className={styles.profileContent}>
        <ul className={styles.profileInfo}>
          {/* Map PROFILE_FIELDS (First name, Last name, Email, Phone) */}
          {PROFILE_FIELDS.map((field) => (
            <li key={field.key} className={styles.infoRow}>
              <span className={styles.infoLabel}>{field.label}</span>
              <span className={styles.infoValue}>
                {userProfile?.[field.key] || "N/A"}
              </span>
            </li>
          ))}
          <li className={styles.infoRow}>
            <span className={styles.infoLabel}>Account Created:</span>
            <span className={styles.infoValue}>
              {formatDate(userProfile?.createdAt) || "N/A"}
            </span>
          </li>
        </ul>

        {/* === Buttons === */}
        <div className={styles.buttons}>
          <Button variant="primary">Edit Profile</Button>
          <Button variant="danger">Delete Account</Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
