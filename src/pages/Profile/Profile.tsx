import { useEditProfileForm } from "./hooks/useEditProfileForm";
import { useUserProfile } from "@/hooks/useUserProfile";
import { PAGE_HEADER_CONFIG, PROFILE_FIELDS } from "./profileConfig";
import { formatDate } from "@/utils/helpers";
import Spinner from "@/components/Spinner/Spinner";
import PageHeader from "@/components/PageHeader/PageHeader";
import ProfileImage from "./components/ProfileImage/ProfileImage";
import Button from "@/components/Button/Button";
import EmptyState from "@/components/EmptyState/EmptyState";
import Toast from "@/components/Toast/Toast";
import Modal from "@/components/Modal/Modal";
import { useProfileModal } from "./hooks/useProfileModal";
import Label from "@/components/Label/Label";
import Input from "@/components/Input/Input";
import FormError from "@/components/FormError/FormError";
import styles from "./Profile.module.css";

/* Profile page component */
const Profile = () => {
  const { userProfile, isLoading, error, setError } = useUserProfile();
  const editForm = useEditProfileForm(userProfile);
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

      {/* === Page Header === */}
      <PageHeader title={PAGE_HEADER_CONFIG.title} />

      {/* === Profile Image === */}
      <ProfileImage />

      <div className={styles.profileContent}>
        {isIncomplete && (
          <>
            <EmptyState message="Your profile is incomplete. Add your details to finish." />
          </>
        )}

        {userProfile && (
          <>
            <ul className={styles.profileInfo}>
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
                  {formatDate(userProfile?.accountCreatedAt) || "N/A"}
                </span>
              </li>
              <li className={styles.infoRow}>
                <span className={styles.infoLabel}>Profile Updated:</span>
                <span className={styles.infoValue}>
                  {formatDate(userProfile?.updatedAt) || "N/A"}
                </span>
              </li>
            </ul>
            <div className={styles.buttons}>
              <Button variant="primary" onClick={openModal}>
                {isIncomplete ? "Complete Profile" : "Edit Profile"}
              </Button>
              <Button variant="danger">Delete Account</Button>
            </div>
          </>
        )}
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={isIncomplete ? "Complete Profile" : "Edit Profile"}
      >
        <form
          onSubmit={editForm.handleSubmit}
          noValidate
          className={styles.form}
        >
          <div className={styles.formGroup}>
            <Label htmlFor="firstName" required>
              First Name
            </Label>
            <Input
              type="text"
              id="firstName"
              maxLength={30}
              placeholder="First name"
              autoComplete="given-name"
              {...editForm.register("firstName")}
            />
            <FormError error={editForm.errors.firstName?.message} />
          </div>

          <div className={styles.formGroup}>
            <Label htmlFor="lastName" required>
              Last Name
            </Label>
            <Input
              type="text"
              id="lastName"
              maxLength={30}
              placeholder="Last name"
              autoComplete="family-name"
              {...editForm.register("lastName")}
            />
            <FormError error={editForm.errors.lastName?.message} />
          </div>

          <div className={styles.formGroup}>
            <Label htmlFor="phone" required>
              Phone
            </Label>
            <Input
              type="tel"
              id="phone"
              maxLength={10}
              placeholder="Phone"
              autoComplete="tel"
              {...editForm.register("phone")}
            />
            <FormError error={editForm.errors.phone?.message} />
          </div>

          <div className={styles.buttons}>
            <Button
              type="submit"
              variant="primary"
              disabled={editForm.isLoading}
            >
              {editForm.isLoading ? "Saving..." : "Save"}
            </Button>
            <Button type="button" variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Profile;
