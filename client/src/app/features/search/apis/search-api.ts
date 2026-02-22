import type { ApiWorldHeritageDto } from "../../../../domain/types";

export type SearchApiDeps = {
  apiBase: string;
  fetchImpl?: typeof fetch;
};

export type SearchParams = {
  keyword?: string;
  region?: string;
  category?: string;
  page?: number;
  perPage?: number;
};

export type SearchResponse = {
  status: "success" | "error";
  data: {
    data: ApiWorldHeritageDto[];
    pagination: {
      current_page: number;
      per_page: number;
      total: number;
      last_page: number;
    };
  };
};

export const createSearchApi = ({ apiBase, fetchImpl = fetch }: SearchApiDeps) => {
  const base = apiBase.replace(/\/+$/, "");
  const ENDPOINT = `${base}/api/v1/heritages/search`;

  const withCommonInit = (init?: RequestInit): RequestInit => ({
    ...init,
    headers: {
      Accept: "application/json",
      ...(init?.headers ?? {}),
    },
    credentials: init?.credentials ?? "omit",
    signal: init?.signal,
  });

  const buildQuery = (params: SearchParams) => {
    const queryParams = new URLSearchParams();

    if (params.keyword) queryParams.set("search_query", params.keyword);
    if (params.region) queryParams.set("region", params.region);
    if (params.category) queryParams.set("category", params.category);
    if (params.page != null) queryParams.set("page", String(params.page));
    if (params.perPage != null) queryParams.set("per_page", String(params.perPage));

    return queryParams.toString();
  };
  return {
    async searchHeritages(params: SearchParams, init?: RequestInit): Promise<SearchResponse> {
      const query = buildQuery(params);
      const url = query ? `${ENDPOINT}?${query}` : ENDPOINT;

      const response = await fetchImpl(url, withCommonInit(init));

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const json = (await response.json()) as SearchResponse;
      console.log(json);
      if (json.status !== "success") {
        throw new Error(`API status is not success: ${json.status}`);
      }
      console.log(json);
      return json;
    },
  };
};
