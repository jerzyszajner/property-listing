import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import App from "@/App";

/* Pages */
import Home from "@/pages/Home/Home";
import PropertyDetails from "@/pages/PropertyDetails/PropertyDetails";
import NotFound from "@/pages/NotFound/NotFound";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<Home />} />
      <Route path="/property/:id" element={<PropertyDetails />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);
