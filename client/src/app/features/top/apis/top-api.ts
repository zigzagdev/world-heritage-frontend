import type { Paginated, ApiWorldHeritageDto } from "../types";

export type TopApiDeps = {
  apiBase: string;
  fetchImpl?: typeof fetch;
};

type DetailResponse<T> = {
  status: string;
  data: T;
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
    async fetchTopFirstPage(init?: RequestInit): Promise<ApiWorldHeritageDto[]> {
      const res = await fetchImpl(ENDPOINT, withCommonInit(init));

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const json = (await res.json()) as Paginated<ApiWorldHeritageDto> | ApiWorldHeritageDto[];
      if (Array.isArray(json)) {
        return json;
      }

      return json.data;
    },

    async fetchWorldHeritageDetail(id: string, init?: RequestInit): Promise<ApiWorldHeritageDto> {
      const url = `${ENDPOINT}/${encodeURIComponent(id)}`;

      const res = await fetchImpl(url, withCommonInit(init));

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const json = (await res.json()) as DetailResponse<ApiWorldHeritageDto>;

      if (json.status !== "success") {
        throw new Error(`API status is not success: ${json.status}`);
      }

      return json.data;
    },
  };
};
