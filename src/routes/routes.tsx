import { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import App from "@/App";
import Spinner from "@/components/Spinner/Spinner";

/* Pages - lazy loaded */
const Home = lazy(() => import("@/pages/Home/Home"));
const PropertyList = lazy(() => import("@/pages/PropertyList/PropertyList"));
const PropertyDetails = lazy(
  () => import("@/pages/PropertyDetails/PropertyDetails")
);
const About = lazy(() => import("@/pages/About/About"));
const Contact = lazy(() => import("@/pages/Contact/Contact"));
const NotFound = lazy(() => import("@/pages/NotFound/NotFound"));

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
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
