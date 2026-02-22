import type { ApiWorldHeritageDto } from "../../../domain/types.ts";

export type HeritageSearchParams = {
  search_query: string | null;
  country: string | null;
  region: string | null;
  category: string | null;
  year_inscribed_from: number | null;
  year_inscribed_to: number | null;
  current_page: number;
  per_page: number;
};

export type HeritageSearchRequest = HeritageSearchParams;

export type Pagination = {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
};

export type HeritageSearchResponse =
  | {
      status: "success";
      data: {
        items: ApiWorldHeritageDto[];
        pagination: Pagination;
      };
    }
  | {
      status: "error";
      data: unknown;
    };

export type SearchHeritagesApiResponse = {
  status: "success" | "error";
  data: {
    data: ApiWorldHeritageDto[];
    pagination: Pagination;
  };
};
