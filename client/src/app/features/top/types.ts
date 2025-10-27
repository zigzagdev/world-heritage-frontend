export type Category = "Cultural" | "Natural" | "Mixed";

export const CRITERIA = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x"] as const;
export type CriteriaCode = (typeof CRITERIA)[number];

export type WorldHeritageDto = {
  id: number;
  official_name: string;
  name: string;
  name_jp: string;
  country: string;
  region: string;
  state_party: string | null;
  category: Category;
  criteria: CriteriaCode[];
  year_inscribed: number;
  area_hectares: number | null;
  buffer_zone_hectares: number | null;
  is_endangered: boolean;
  latitude: number | null;
  longitude: number | null;
  short_description: string;
  unesco_site_url: string;
  state_party_codes: string[];
  state_parties_meta: Record<string, { is_primary: boolean; inscription_year: number }>;
  thumbnail?: string | null;
};

export type Paginated<T> = { data: T[]; meta?: unknown } | T[];

export type TopListItemVm = {
  id: number;
  title: string;
  subtitle: string;
  category: string;
  year: number;
  areaText: string;
  bufferText: string;
  thumbnail?: string;
};

export type LoadState<T> = {
  data: T | null;
  loading: boolean;
  error: unknown | null;
};
