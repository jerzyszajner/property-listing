import { Navigate } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import Spinner from "../Spinner/Spinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/* ProtectedRoute component */
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuthContext();

  if (isLoading) {
    return <Spinner />;
  }

  if (!user) {
    return <Navigate to="/sign-in" replace />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;
