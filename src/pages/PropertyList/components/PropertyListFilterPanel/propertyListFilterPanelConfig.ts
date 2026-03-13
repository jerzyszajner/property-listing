/* PropertyListFilterPanel configuration */
export type GuestOption = {
  value: string;
  label: string;
};

export const ALL_GUESTS = "0";

export const GUEST_OPTIONS: GuestOption[] = [
  { value: ALL_GUESTS, label: "All guests" },
  { value: "1", label: "1 guest" },
  { value: "2", label: "2 guests" },
  { value: "3", label: "3 guests" },
  { value: "4", label: "4 guests" },
  { value: "5", label: "5 guests" },
];
