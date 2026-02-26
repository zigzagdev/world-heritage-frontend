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

export const createTopApi = ({ apiBase, fetchImpl = fetch }: TopApiDeps) => {
  const base = apiBase.replace(/\/+$/, "");
  const ENDPOINT = `${base}/api/v1/heritages`;

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
    async fetchTopFirstPage(params: {
      currentPage: number;
      perPage: number;
      signal?: AbortSignal;
    }): Promise<ListResult<ApiWorldHeritageDto>> {
      const url = new URL(ENDPOINT);
      url.searchParams.set("current_page", String(params.currentPage));
      url.searchParams.set("per_page", String(params.perPage));

      const response = await fetchImpl(url.toString(), withCommonInit({ signal: params.signal }));
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const json = (await response.json()) as ListResponse<ApiWorldHeritageDto>;
      if (json.status !== "success") throw new Error(`API status is not success: ${json.status}`);

      return json.data;
    },
    async fetchWorldHeritageDetail(
      id: string,
      init?: RequestInit,
    ): Promise<ApiWorldHeritageDetailDto> {
      const url = `${ENDPOINT}/${encodeURIComponent(id)}`;
      const response = await fetchImpl(url, withCommonInit(init));
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const json = (await response.json()) as DetailResponse<ApiWorldHeritageDetailDto>;
      if (json.status !== "success") {
        throw new Error(`API status is not success: ${json.status}`);
      }

      return json.data;
    },
  };
};
