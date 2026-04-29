import type {
  ApiWorldHeritageDto,
  ApiWorldHeritageDetailDto,
  IdSortOption,
  ListResult,
} from "../../../../domain/types.ts";

export type TopApiDeps = {
  apiBase: string;
  fetchImpl?: typeof fetch;
};

type DetailResponse = {
  status: string;
  data: ApiWorldHeritageDetailDto;
};

type ListResponse = {
  status: string;
  data: ListResult<ApiWorldHeritageDto>;
};

const isListResponse = (json: unknown): json is ListResponse => {
  return typeof json === "object" && json !== null && "status" in json && "data" in json;
};

const isDetailResponse = (json: unknown): json is DetailResponse => {
  return typeof json === "object" && json !== null && "status" in json && "data" in json;
};

const normalizeApiBase = (apiBase: string): string => {
  return apiBase.replace(/\/+$/, "");
};

export const createTopApi = ({ apiBase, fetchImpl = fetch }: TopApiDeps) => {
  const normalizedApiBase = normalizeApiBase(apiBase);

  const endpoint = `${normalizedApiBase}/api/v1/heritages`;

  const withCommonInit = (init?: RequestInit): RequestInit => ({
    ...init,
    headers: {
      Accept: "application/json",
      ...(init?.headers ?? {}),
    },
    credentials: init?.credentials ?? "omit",
    signal: init?.signal,
  });

  return {
    async fetchTopPage(args: {
      currentPage: number;
      perPage: number;
      order: IdSortOption;
      signal?: AbortSignal;
    }): Promise<ListResult<ApiWorldHeritageDto>> {
      const url = new URL(endpoint);
      url.searchParams.set("current_page", String(args.currentPage));
      url.searchParams.set("per_page", String(args.perPage));
      url.searchParams.set("order", args.order);

      const res = await fetchImpl(url.toString(), withCommonInit({ signal: args.signal }));
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const json = await res.json();

      if (!isListResponse(json)) {
        throw new Error("Unexpected response shape");
      }
      if (json.status !== "success") {
        throw new Error(`API status is not success: ${json.status}`);
      }

      return json.data;
    },

    async fetchWorldHeritageDetail(
      id: string,
      init?: RequestInit,
    ): Promise<ApiWorldHeritageDetailDto> {
      const url = `${endpoint}/${encodeURIComponent(id)}`;
      const res = await fetchImpl(url, withCommonInit(init));
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const json = await res.json();

      if (!isDetailResponse(json)) {
        throw new Error("Unexpected response shape");
      }

      if (json.status !== "success") {
        throw new Error(`API status is not success: ${json.status}`);
      }

      return json.data;
    },
  };
};
