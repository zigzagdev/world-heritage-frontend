import type { ApiWorldHeritageDto } from "../../../domain/types.ts";

export type HeritageSearchParams = {
  keyword?: string;
  region?: string;
  category?: string;
  page?: number;
  perPage?: number;
};

export type HeritageSearchRequest = HeritageSearchParams;

export type Pagination = {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
};

export type HeritageSearchResponse = {
  status: "success" | "error";
  data: {
    data: ApiWorldHeritageDto[];
    pagination: Pagination;
  };
};
