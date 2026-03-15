import {
  type HeritageSearchParams,
  ID_SORT_OPTIONS,
  STUDY_REGIONS,
} from "../../../../domain/types.ts";

export const DEFAULT_HERITAGE_SEARCH_PARAMS: HeritageSearchParams = {
  search_query: null,
  country: null,
  region: STUDY_REGIONS[0],
  category: null,
  year_inscribed_from: null,
  year_inscribed_to: null,
  current_page: 1,
  per_page: 30,
  order: ID_SORT_OPTIONS.ASC,
};
