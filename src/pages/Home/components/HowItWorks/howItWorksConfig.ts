/* HowItWorks configuration */
import { Search, Filter, MapPin } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type SectionHeaderConfig = {
  title: string;
  subtitle: string;
};

export type Step = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export const SECTION_HEADER_CONFIG: SectionHeaderConfig = {
  title: "How It Works",
  subtitle: "Finding your next home is simple, fast, and secure.",
};

export const STEPS_CONFIG: Step[] = [
  {
    icon: Search,
    title: "AI Search Engine",
    description:
      "Use our advanced AI-powered search to find properties that match your preferences.",
  },
  {
    icon: Filter,
    title: "Filter & Browse",
    description:
      "Refine your search by location, guest count, and superhost status to find your perfect match.",
  },
  {
    icon: MapPin,
    title: "Explore Details",
    description:
      "View property details, amenities, location on map, and host information before making your decision.",
  },
];
