import { createSearchApi } from "./search-api.ts";

const apiBase = import.meta.env.VITE_API_BASE_URL ?? "";
const searchApi = createSearchApi({ apiBase });

export const fetchSearchHeritagesResult = searchApi.searchHeritages;
