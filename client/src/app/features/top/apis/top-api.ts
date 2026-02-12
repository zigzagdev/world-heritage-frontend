import type { ApiWorldHeritageDto } from "../types";

export type TopApiDeps = {
  apiBase: string;
  fetchImpl?: typeof fetch;
};

type DetailResponse<T> = {
  status: "success";
  data: T;
};

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null;

type DataArray<T> = { data: T[] };

const isDataArray = <T>(v: unknown): v is DataArray<T> => {
  if (!isRecord(v)) return false;
  const data = v["data"];
  return Array.isArray(data);
};

const pickList = <T>(v: unknown): T[] => {
  if (Array.isArray(v)) return v as T[];
  if (isDataArray<T>(v)) return v.data;
  throw new Error("Invalid response shape: expected array or { data: array }");
};

const isDetailSuccess = <T>(v: unknown): v is DetailResponse<T> =>
  isRecord(v) && v.status === "success" && "data" in v;

export const createTopApi = ({ apiBase, fetchImpl = fetch }: TopApiDeps) => {
  const base = apiBase.replace(/\/+$/, "");
  const ENDPOINT = `${base}/api/v1/heritages`;

  const withCommonInit = (init?: RequestInit): RequestInit => {
    const headers = new Headers(init?.headers);
    headers.set("Accept", "application/json");
    return {
      ...init,
      headers,
      credentials: init?.credentials ?? "omit",
      signal: init?.signal,
    };
  };

  return {
    async fetchTopFirstPage(init?: RequestInit): Promise<ApiWorldHeritageDto[]> {
      const res = await fetchImpl(ENDPOINT, withCommonInit(init));

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const json: unknown = await res.json();
      return pickList<ApiWorldHeritageDto>(json);
    },

    async fetchWorldHeritageDetail(id: string, init?: RequestInit): Promise<ApiWorldHeritageDto> {
      const url = `${ENDPOINT}/${encodeURIComponent(id)}`;

      const res = await fetchImpl(url, withCommonInit(init));

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const json: unknown = await res.json();

      if (!isDetailSuccess<ApiWorldHeritageDto>(json)) {
        const status = isRecord(json) ? String(json.status ?? "unknown") : "unknown";
        const message =
          isRecord(json) && typeof json.message === "string" ? `: ${json.message}` : "";
        throw new Error(`API status is not success: ${status}${message}`);
      }

      return json.data;
    },
  };
};
