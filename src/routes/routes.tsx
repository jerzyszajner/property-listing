import { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import App from "@/App";
import Spinner from "@/components/Spinner/Spinner";
import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";

/* Pages - lazy loaded */
const Home = lazy(() => import("@/pages/Home/Home"));
const PropertyList = lazy(() => import("@/pages/PropertyList/PropertyList"));
const PropertyDetails = lazy(
  () => import("@/pages/PropertyDetails/PropertyDetails")
);
const About = lazy(() => import("@/pages/About/About"));
const Contact = lazy(() => import("@/pages/Contact/Contact"));
const SignUp = lazy(() => import("@/pages/SignUp/SignUp"));
const SignIn = lazy(() => import("@/pages/SignIn/SignIn"));
const ResetPassword = lazy(() => import("@/pages/ResetPassword/ResetPassword"));
const EmailVerification = lazy(
  () => import("@/pages/EmailVerification/EmailVerification")
);
const NotFound = lazy(() => import("@/pages/NotFound/NotFound"));

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
      <Route
        path="/sign-up"
        element={
          <Suspense fallback={<Spinner />}>
            <SignUp />
          </Suspense>
        }
      />
      <Route
        path="/sign-in"
        element={
          <Suspense fallback={<Spinner />}>
            <SignIn />
          </Suspense>
        }
      />
      <Route
        path="/reset-password"
        element={
          <Suspense fallback={<Spinner />}>
            <ResetPassword />
          </Suspense>
        }
      />
      {/* Protected routes */}
      <Route
        path="/email-verification"
        element={
          <ProtectedRoute>
            <Suspense fallback={<Spinner />}>
              <EmailVerification />
            </Suspense>
          </ProtectedRoute>
        }
      />
      {/* 404 fallback route */}
      <Route
        path="*"
        element={
          <Suspense fallback={<Spinner />}>
            <NotFound />
          </Suspense>
        }
      />
    </Route>
  )
);
