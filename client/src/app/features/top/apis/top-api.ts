import type {
  ApiWorldHeritageDto,
  ApiWorldHeritageDetailDto,
  ListResult,
} from "../../../../domain/types.ts";

export type TopApiDeps = {
  apiBase: string;
  fetchImpl?: typeof fetch;
};

type DetailResponse<T> = {
  status: string;
  data: T;
};

type ListResponse<T> = {
  status: string;
  data: ListResult<T>;
};

const normalizeApiBase = (apiBase: string): string => {
  console.log("apiBase before createTopApi:", apiBase);
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
      signal?: AbortSignal;
    }): Promise<ListResult<ApiWorldHeritageDto>> {
      const url = new URL(endpoint);
      url.searchParams.set("current_page", String(args.currentPage));
      url.searchParams.set("per_page", String(args.perPage));

      const res = await fetchImpl(url.toString(), withCommonInit({ signal: args.signal }));
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const json = (await res.json()) as ListResponse<ApiWorldHeritageDto>;
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

      const json = (await res.json()) as DetailResponse<ApiWorldHeritageDetailDto>;
      if (json.status !== "success") {
        throw new Error(`API status is not success: ${json.status}`);
      }

      return json.data;
    },
  };
};
