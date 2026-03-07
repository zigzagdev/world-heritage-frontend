import { createSearchApi } from "./search-api.ts";

const apiBase = import.meta.env.VITE_API_BASE_URL;

if (!apiBase) {
  throw new Error("VITE_API_BASE_URL is not set");
}

const searchApi = createSearchApi({ apiBase });

export const fetchSearchHeritagesResult = searchApi.searchHeritages;
