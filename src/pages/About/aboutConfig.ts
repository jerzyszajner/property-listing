/* About page configuration */
import { Sparkles, ShieldCheck, Map } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type PageHeaderConfig = {
  title: string;
  subtitle: string;
};

export type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export const PAGE_HEADER_CONFIG: PageHeaderConfig = {
  title: "About",
  subtitle: "Your trusted platform for finding perfect vacation rentals",
};

export const DESCRIPTION_CONFIG: string =
  "We connect travelers with exceptional vacation rentals through AI powered search and verified properties. Find your perfect stay with ease and confidence.";

export const FEATURES_CONFIG: Feature[] = [
  {
    icon: Sparkles,
    title: "AI Powered Search",
    description: "Find properties using natural language queries",
  },
  {
    icon: ShieldCheck,
    title: "Verified Properties",
    description: "Browse trusted listings with detailed information",
  },
  {
    icon: Map,
    title: "Interactive Maps",
    description: "Explore locations with Google Maps integration",
  },
];
