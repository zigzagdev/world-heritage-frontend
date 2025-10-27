export type Category = "Cultural" | "Natural" | "Mixed";

export type WorldHeritageDto = {
  id: number;
  official_name: string;
  name: string;
  country: string;
  region: string;
  category: Category;
  year_inscribed: number;
  latitude: number | null;
  longitude: number | null;
  is_endangered: boolean;
  name_jp: string;
  state_party: string | null;
  criteria: string[];
  area_hectares: number | null;
  buffer_zone_hectares: number | null;
  short_description: string;
  unesco_site_url: string;
  state_party_codes: string[];
  state_parties_meta: Record<string, { is_primary: boolean; inscription_year: number }>;
  thumbnail?: string | null;
};

type Paginated<T> = { data: T[]; meta?: unknown } | T[];

const ENDPOINT = "/api/world-heritage";

async function fetchPage(
  page: number,
  perPage: number,
  init?: RequestInit,
): Promise<WorldHeritageDto[]> {
  const url = new URL(ENDPOINT, window.location.origin);
  url.searchParams.set("page", String(page));
  url.searchParams.set("per_page", String(perPage));

  const res = await fetch(url, {
    credentials: init?.credentials ?? "omit",
    headers: { Accept: "application/json", ...(init?.headers ?? {}) },
    signal: init?.signal,
    method: "GET",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const json = (await res.json()) as Paginated<WorldHeritageDto>;
  return Array.isArray(json) ? json : json.data;
}

const FIRST_PAGE: number = 1;
const DEFAULT_PER_PAGE: number = 20;

export async function fetchTopFirstPage(init?: RequestInit): Promise<WorldHeritageDto[]> {
  return fetchPage(FIRST_PAGE, DEFAULT_PER_PAGE, init);
}
