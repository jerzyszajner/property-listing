import { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import App from "@/App";
import Spinner from "@/components/Spinner/Spinner";
import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";

/* Authentication pages */
import SignIn from "@/pages/SignIn/SignIn";
import SignUp from "@/pages/SignUp/SignUp";
import EmailVerification from "@/pages/EmailVerification/EmailVerification";
import ResetPassword from "@/pages/ResetPassword/ResetPassword";

/* Content pages  */
const Home = lazy(() => import("@/pages/Home/Home"));
const PropertyList = lazy(() => import("@/pages/PropertyList/PropertyList"));
const PropertyDetails = lazy(
  () => import("@/pages/PropertyDetails/PropertyDetails"),
);
const About = lazy(() => import("@/pages/About/About"));
const Contact = lazy(() => import("@/pages/Contact/Contact"));

/* Protected pages */
const Bookings = lazy(() => import("@/pages/Bookings/Bookings"));
const AddListing = lazy(() => import("@/pages/AddListing/AddListing"));
const Profile = lazy(() => import("@/pages/Profile/Profile"));

/* Error page */
import NotFound from "@/pages/NotFound/NotFound";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      {/* Public routes */}
      <Route
        index
        element={
          <Suspense fallback={<Spinner />}>
            <Home />
          </Suspense>
        }
      />
      <Route
        path="/properties"
        element={
          <Suspense fallback={<Spinner />}>
            <PropertyList />
          </Suspense>
        }
      />
      <Route
        path="/property/:id"
        element={
          <Suspense fallback={<Spinner />}>
            <PropertyDetails />
          </Suspense>
        }
      />
      <Route
        path="/about"
        element={
          <Suspense fallback={<Spinner />}>
            <About />
          </Suspense>
        }
      />
      <Route
        path="/contact"
        element={
          <Suspense fallback={<Spinner />}>
            <Contact />
          </Suspense>
        }
      />
      {/* Auth flow routes  */}
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/email-verification" element={<EmailVerification />} />
      {/* Protected routes */}

      <Route
        path="/bookings"
        element={
          <Suspense fallback={<Spinner />}>
            <ProtectedRoute>
              <Bookings />
            </ProtectedRoute>
          </Suspense>
        }
      />
      <Route
        path="/add-listing"
        element={
          <Suspense fallback={<Spinner />}>
            <ProtectedRoute>
              <AddListing />
            </ProtectedRoute>
          </Suspense>
        }
      />
      <Route
        path="/profile"
        element={
          <Suspense fallback={<Spinner />}>
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          </Suspense>
        }
      />
      {/* Error page */}
      <Route path="*" element={<NotFound />} />
    </Route>,
  ),
);
