/* PropertyInfo configuration */
import { Wifi, Waves, ChefHat, Coffee, Utensils, Flame } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type Amenity = {
  key: string;
  icon: LucideIcon;
  label: string;
};

export const AMENITIES_CONFIG: Amenity[] = [
  { key: "wifi", icon: Wifi, label: "Wifi" },
  { key: "washer", icon: Waves, label: "Washer" },
  { key: "bbq_grill", icon: ChefHat, label: "BBQ grill" },
  { key: "coffee_maker", icon: Coffee, label: "Coffee maker" },
  { key: "full_kitchen", icon: Utensils, label: "Full kitchen" },
  { key: "indoor_fireplace", icon: Flame, label: "Indoor fireplace" },
];
