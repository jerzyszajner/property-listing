import { useUserProfile } from "@/hooks/useUserProfile";
import Spinner from "@/components/Spinner/Spinner";

const Profile = () => {
  const { userProfile, isLoading, error } = useUserProfile();

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!userProfile) {
    return <div>No profile found</div>;
  }
  return (
    <div>
      <h1>Profile</h1>
      <p>First Name: {userProfile.firstName}</p>
      <p>Last Name: {userProfile.lastName}</p>
      <p>Email: {userProfile.email}</p>
      <p>Phone: {userProfile.phone}</p>
    </div>
  );
};

export default Profile;
