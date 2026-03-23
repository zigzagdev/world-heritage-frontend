import type { StudyRegion } from "../../../domain/types.ts";

export const REGION_CENTRES: Record<StudyRegion, [number, number]> = {
  Africa: [8.7832, 34.5085],
  Asia: [34.0479, 100.6197],
  Europe: [54.526, 15.2551],
  "North America": [40.4637, -86.6735],
  "South America": [-8.7832, -55.4915],
  Oceania: [-25.2744, 133.7751],
};
