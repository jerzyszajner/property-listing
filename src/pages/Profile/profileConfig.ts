/* Profile page configuration */
export type ProfileFieldsConfig = {
  label: string;
  key: "firstName" | "lastName" | "email" | "phone";
};

export type PageHeaderConfig = {
  title: string;
  subtitle?: string;
};

export const PAGE_HEADER_CONFIG: PageHeaderConfig = {
  title: "Profile",
};

export const PROFILE_FIELDS: ProfileFieldsConfig[] = [
  { label: "First name:", key: "firstName" },
  { label: "Last name:", key: "lastName" },
  { label: "Email:", key: "email" },
  { label: "Phone:", key: "phone" },
];
