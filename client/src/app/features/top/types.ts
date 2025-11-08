export type Category = "Cultural" | "Natural" | "Mixed";
export const CRITERIA = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x"] as const;
export type CriteriaCode = (typeof CRITERIA)[number];

export type ApiWorldHeritageDto = {
  id: number;
  official_name: string;
  name: string;
  name_jp: string;
  country: string;
  region: string;
  state_party: string | null;
  category: Category;
  criteria: string[];
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

export type WorldHeritageVm = {
  id: number;
  officialName: string;
  name: string;
  nameJp: string;
  country: string;
  region: string;
  stateParty: string | null;
  category: Category;
  criteria: CriteriaCode[];
  yearInscribed: number;
  areaHectares: number | null;
  bufferZoneHectares: number | null;
  isEndangered: boolean;
  latitude: number | null;
  longitude: number | null;
  shortDescription: string;
  unescoSiteUrl: string;
  statePartyCodes: string[];
  statePartiesMeta: Record<string, { isPrimary: boolean; inscriptionYear: number }>;
  thumbnail?: string;
  title: string;
  subtitle: string;
  areaText: string;
  bufferText: string;
  criteriaText: string;
};

export type Paginated<T> = { data: T[]; meta?: unknown } | T[];
