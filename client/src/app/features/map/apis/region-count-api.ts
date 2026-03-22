import type { RegionCount } from "../../../../domain/types.ts";

export type RegionCountApiDeps = {
  apiBase: string;
  fetchImpl?: typeof fetch;
};

type RegionCountResponse = {
  status: string;
  data: RegionCount[];
};

const normalizeApiBase = (apiBase: string): string => {
  return apiBase.replace(/\/+$/, "");
};

export const createRegionCountApi = ({ apiBase, fetchImpl = fetch }: RegionCountApiDeps) => {
  const normalizedApiBase = normalizeApiBase(apiBase);
  const endpoint = `${normalizedApiBase}/api/v1/heritages/region-count`;

  return {
    async fetchRegionCount(init?: RequestInit): Promise<RegionCount[]> {
      const res = await fetchImpl(endpoint, {
        ...init,
        headers: {
          Accept: "application/json",
          ...(init?.headers ?? {}),
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const json = (await res.json()) as RegionCountResponse;
      if (json.status !== "success") {
        throw new Error(`API status is not success: ${json.status}`);
      }

      return json.data;
    },
  };
};
