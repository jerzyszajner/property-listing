import type { Property } from "@/types/property";

export const fetchProperties = async (): Promise<Property[]> => {
  const response = await fetch(
    "https://raw.githubusercontent.com/devchallenges-io/curriculum/refs/heads/main/4-frontend-libaries/challenges/group_1/data/property-listing-data.json"
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};
