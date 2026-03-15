import type { IdSortOption } from "../../../../domain/types.ts";

export type HeritageSearchParams = {
  search_query: string | null;
  country: string | null;
  region: string | null;
  category: string | null;
  year_inscribed_from: number | null;
  year_inscribed_to: number | null;
  current_page: number;
  per_page: number;
  order: IdSortOption | null;
};

export const DEFAULT_HERITAGE_SEARCH_PARAMS: HeritageSearchParams = {
  search_query: null,
  country: null,
  region: null,
  category: null,
  year_inscribed_from: null,
  year_inscribed_to: null,
  current_page: 1,
  per_page: 30,
  order: null,
};
