import type { RawMatch, SearchPropertyResult } from "./types.js";

type MapToResponseParams = {
  matches: RawMatch[];
  maxResults: number;
};

/**
 * Service function for mapping raw matches into callable response DTO.
 * @param {MapToResponseParams} params Mapping configuration.
 * @return {SearchPropertyResult[]} Response payload for callable API.
 */
export function mapToResponse({
  matches,
  maxResults,
}: MapToResponseParams): SearchPropertyResult[] {
  return matches.slice(0, maxResults).map((item): SearchPropertyResult => {
    const data = item.data;
    const capacity = data.capacity as
      | {
          guest?: number;
          bedroom?: number;
        }
      | undefined;

    return {
      id: item.id,
      title: (data.title as string) ?? "",
      description: (data.description as string) ?? "",
      price: Number(data.price ?? 0),
      rating: Number(data.rating ?? 0),
      superhost: Boolean(data.superhost),
      image: (data.image as string) ?? "",
      capacity: {
        guest: Number(capacity?.guest ?? 0),
        bedroom: Number(capacity?.bedroom ?? 0),
      },
    };
  });
}
