import { useEditProfileForm } from "./hooks/useEditProfileForm";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useProfileImageUpload } from "./hooks/useProfileImageUpload";
import {
  PAGE_HEADER_CONFIG,
  INCOMPLETE_PROFILE_MESSAGE,
} from "./profileConfig";
import Spinner from "@/components/Spinner/Spinner";
import PageHeader from "@/components/PageHeader/PageHeader";
import ProfileImage from "./components/ProfileImage/ProfileImage";
import ProfileInfo from "./components/ProfileInfo/ProfileInfo";
import EmptyState from "@/components/EmptyState/EmptyState";
import Toast from "@/components/Toast/Toast";
import Modal from "@/components/Modal/Modal";
import { useProfileModal } from "./hooks/useProfileModal";
import EditProfileForm from "./components/EditProfileForm/EditProfileForm";
import styles from "./Profile.module.css";

/* Profile page component */
const Profile = () => {
  const { userProfile, isLoading, error, setError } = useUserProfile();
  const editForm = useEditProfileForm(userProfile);
  const profileImageUpload = useProfileImageUpload();
  const { isModalOpen, openModal, closeModal } = useProfileModal(editForm);
  const isIncomplete =
    !userProfile?.firstName || !userProfile?.lastName || !userProfile?.phone;

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className={styles.profile}>
      {/* === Error Toast === */}
      {error && (
        <Toast message={error} variant="error" onClose={() => setError(null)} />
      )}

      {editForm.error && (
        <Toast
          message={editForm.error}
          variant="error"
          onClose={() => editForm.setError(null)}
        />
      )}

      {profileImageUpload.error && (
        <Toast
          message={profileImageUpload.error}
          variant="error"
          onClose={() => profileImageUpload.setError(null)}
        />
      )}

      {/* === Page Header === */}
      <PageHeader title={PAGE_HEADER_CONFIG.title} />

      {/* === Profile Image === */}
      <ProfileImage profileImageUpload={profileImageUpload} />

      <div className={styles.profileContent}>
        {isIncomplete && <EmptyState message={INCOMPLETE_PROFILE_MESSAGE} />}

        {userProfile && (
          <ProfileInfo
            userProfile={userProfile}
            isIncomplete={isIncomplete}
            onEditClick={openModal}
          />
        )}
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={isIncomplete ? "Complete Profile" : "Edit Profile"}
      >
        <EditProfileForm editForm={editForm} onCancel={closeModal} />
      </Modal>
    </div>
  );
};

export default Profile;
