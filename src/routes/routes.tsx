import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import App from "@/App";

/* Pages */
import Home from "@/pages/Home/Home";
import NotFound from "@/pages/NotFound/NotFound";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<Home />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);
