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
    const qs = new URLSearchParams();

    if (params.keyword) qs.set("search_query", params.keyword);
    if (params.region) qs.set("region", params.region);
    if (params.category) qs.set("category", params.category);
    if (params.page != null) qs.set("page", String(params.page));
    if (params.perPage != null) qs.set("per_page", String(params.perPage));

    return qs.toString();
  };

  return {
    async searchHeritages(params: SearchParams, init?: RequestInit): Promise<SearchResponse> {
      const q = buildQuery(params);
      const url = q ? `${ENDPOINT}?${q}` : ENDPOINT;

      const res = await fetchImpl(url, withCommonInit(init));
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json = (await res.json()) as SearchResponse;

      if (json.status !== "success") {
        throw new Error(`API status is not success: ${json.status}`);
      }

      return json;
    },
  };
};
