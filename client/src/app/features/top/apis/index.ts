import type { Paginated, ApiWorldHeritageDto } from "../types";

const apiBase = "http://localhost:8700".replace(/\/+$/, "");
const ENDPOINT = `${apiBase}/api/v1/heritages`;

export async function fetchTopFirstPage(init?: RequestInit): Promise<ApiWorldHeritageDto[]> {
  const res = await fetch(ENDPOINT, {
    headers: { Accept: "application/json", ...(init?.headers ?? {}) },
    credentials: init?.credentials ?? "omit",
    signal: init?.signal,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = (await res.json()) as Paginated<ApiWorldHeritageDto>;

  return Array.isArray(json) ? json : json.data;
}

export async function fetchWorldHeritageDetail(
  id: string,
  init?: RequestInit,
): Promise<ApiWorldHeritageDto> {
  const url = `${ENDPOINT}/${encodeURIComponent(id)}`;

  const res = await fetch(url, {
    headers: { Accept: "application/json", ...(init?.headers ?? {}) },
    credentials: init?.credentials ?? "omit",
    signal: init?.signal,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = (await res.json()) as ApiWorldHeritageDto;

  return json;
}
