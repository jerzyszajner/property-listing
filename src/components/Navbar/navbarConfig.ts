/* Navbar navigation links configuration */
export type Link = {
  to: string;
  label: string;
};

export const MAIN_LINKS: Link[] = [
  {
    to: "/",
    label: "Home",
  },
  {
    to: "/properties",
    label: "Properties",
  },
  {
    to: "/about",
    label: "About",
  },
  {
    to: "/contact",
    label: "Contact",
  },
];

export const USER_LINKS: Link[] = [
  {
    to: "/bookings",
    label: "My Bookings",
  },

  {
    to: "/profile",
    label: "Profile",
  },
];
