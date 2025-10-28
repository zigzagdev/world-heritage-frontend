import type { Paginated, ApiWorldHeritageDto } from "../types";

const ENDPOINT = "/api/world-heritage";

export async function fetchTopFirstPage(init?: RequestInit): Promise<ApiWorldHeritageDto[]> {
  const url = `${ENDPOINT}?page=1&per_page=20`;
  const res = await fetch(url, {
    headers: { Accept: "application/json", ...(init?.headers ?? {}) },
    credentials: init?.credentials ?? "omit",
    signal: init?.signal,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = (await res.json()) as Paginated<ApiWorldHeritageDto>;
  return Array.isArray(json) ? json : json.data;
}
