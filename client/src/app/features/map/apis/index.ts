import { createRegionCountApi } from "./region-count-api";

const apiBase = import.meta.env.VITE_API_BASE_URL;

if (!apiBase) {
  throw new Error("VITE_API_BASE_URL is not set");
}

const regionCountApi = createRegionCountApi({ apiBase });

export const fetchRegionCount = regionCountApi.fetchRegionCount;
