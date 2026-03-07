import type { ApiWorldHeritageDto, ListResult, Pagination } from "../../../../domain/types";

export type SearchApiDeps = {
  apiBase: string;
  fetchImpl?: typeof fetch;
};

export type SearchParams = {
  keyword?: string;
  region?: string;
  category?: string;
  currentPage?: number;
  perPage?: number;
};

export type ApiSearchResponse = {
  status: "success" | "error";
  data: {
    items: ApiWorldHeritageDto[];
    pagination: Pagination;
  };
};

const normalizeApiBase = (apiBase: string): string => apiBase.replace(/\/+$/, "");

export const createSearchApi = ({ apiBase, fetchImpl = fetch }: SearchApiDeps) => {
  if (!apiBase) {
    throw new Error("apiBase is required");
  }

  const base = normalizeApiBase(apiBase);
  const endpoint = `${base}/api/v1/heritages/search`;

  const withCommonInit = (init?: RequestInit): RequestInit => ({
    ...init,
    headers: {
      Accept: "application/json",
      ...(init?.headers ?? {}),
    },
    credentials: init?.credentials ?? "omit",
    signal: init?.signal,
  });

  const buildQuery = (params: SearchParams): string => {
    const queryParams = new URLSearchParams();

    const keyword = params.keyword?.trim();
    const region = params.region?.trim();
    const category = params.category?.trim();

    if (keyword) queryParams.set("search_query", keyword);
    if (region) queryParams.set("region", region);
    if (category) queryParams.set("category", category);
    if (params.currentPage != null) queryParams.set("current_page", String(params.currentPage));
    if (params.perPage != null) queryParams.set("per_page", String(params.perPage));

    return queryParams.toString();
  };

  return {
    async searchHeritages(
      params: SearchParams,
      init?: RequestInit,
    ): Promise<ListResult<ApiWorldHeritageDto>> {
      const query = buildQuery(params);
      const url = query ? `${endpoint}?${query}` : endpoint;

      const response = await fetchImpl(url, withCommonInit(init));
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const json = (await response.json()) as ApiSearchResponse;
      if (json.status !== "success") {
        throw new Error(`API status is not success: ${json.status}`);
      }

      return {
        items: json.data.items,
        pagination: json.data.pagination,
      };
    },
  };
};
