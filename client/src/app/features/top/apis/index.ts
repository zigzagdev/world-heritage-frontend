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
