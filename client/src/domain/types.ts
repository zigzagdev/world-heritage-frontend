export type Category = "Cultural" | "Natural" | "Mixed";

export const CRITERIA = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x"] as const;
export type CriteriaCode = (typeof CRITERIA)[number];

export const STUDY_REGIONS = [
  "Africa",
  "Asia",
  "Europe",
  "North America",
  "South America",
  "Oceania",
] as const;

export type StudyRegion = (typeof STUDY_REGIONS)[number];

export type StatePartyMetaDto = {
  is_primary: boolean;
  inscription_year?: number;
};

export type StatePartiesMetaDto = Record<string, StatePartyMetaDto> | [];

/**
 * 画像DTO（detailの images 用）
 */
export type ApiWorldHeritageImageDto = {
  id: number;
  url: string;
  sort_order: number;
  width: number;
  height: number;
  format: string | null;
  alt: string | null;
  credit: string | null;
  is_primary: boolean;
  checksum: string | null;
};

/**
 * 一覧 / 検索結果 DTO
 */
export type ApiWorldHeritageDto = {
  id: number;
  official_name: string;
  name: string;
  heritage_name_jp: string;
  country: string;
  country_name_jp: string;
  region: StudyRegion;
  category: Category;
  year_inscribed: number;
  latitude: number | null;
  longitude: number | null;
  is_endangered: boolean;
  criteria: CriteriaCode[];
  area_hectares: number | null;
  buffer_zone_hectares: number | null;
  short_description: string;
  unesco_site_url: string | null;
  state_party: string | null;
  state_party_codes: string[];
  state_parties_meta: StatePartiesMetaDto;
  thumbnail: string | null;
};

/**
 * detail DTO
 */
export type ApiWorldHeritageDetailDto = {
  id: number;
  official_name: string;
  name: string;
  heritage_name_jp: string;
  country: string;
  country_name_jp: string;
  region: StudyRegion;
  category: Category;
  year_inscribed: number;
  latitude: number | null;
  longitude: number | null;
  is_endangered: boolean;
  criteria: CriteriaCode[];
  area_hectares: number | null;
  buffer_zone_hectares: number | null;
  short_description: string;
  unesco_site_url: string | null;

  state_party: string | null;
  state_party_codes: string[];
  state_parties_meta: StatePartiesMetaDto;
  primary_state_party_code: string | null;

  thumbnail_url: string | null;
  images: ApiWorldHeritageImageDto[];
};

/**
 * APIResponse wrapper（multiType）
 */
export type ApiListResponse<T> = {
  status: string;
  data: ListResult<T>;
};

/**
 * APIResponse wrapper（detailType）
 */
export type ApiDetailResponse<T> = {
  status: string;
  data: T;
};

export type WorldHeritageListItemVm = {
  id: number;
  title: string;
  subtitle: string;
  category: Category;
  country: string;
  yearInscribed: number;
  isEndangered: boolean;
  thumbnailUrl: string | null;
};

export type StatePartyMetaVm = {
  isPrimary: boolean;
  inscriptionYear?: number;
};

export type WorldHeritageImageVm = {
  id: number;
  url: string;
  alt: string;
  credit: string | null;
  width: number;
  height: number;
  isPrimary: boolean;
};

export type WorldHeritageVm = {
  id: number;
  officialName: string;
  name: string;
  heritageNameJp: string;
  country: string;
  countryNameJp: string;
  region: StudyRegion;
  category: Category;
  yearInscribed: number;
  latitude: number | null;
  longitude: number | null;
  isEndangered: boolean;
  criteria: CriteriaCode[];
  areaHectares: number | null;
  bufferZoneHectares: number | null;
  shortDescription: string;
  unescoSiteUrl: string | null;
  stateParty: string | null;
  statePartyCodes: string[];
  statePartiesMeta: Record<string, StatePartyMetaVm>;
  primaryStatePartyCode: string | null;
  thumbnailUrl: string | null;
  images: WorldHeritageImageVm[];
  title: string;
  subtitle: string;
  areaText: string;
  bufferText: string;
  criteriaText: string;
};

export type Pagination = {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
};

export type ListResult<T> = {
  items: T[];
  pagination: Pagination;
};

export type WorldHeritageDetailVm = WorldHeritageVm;

export type ApiPaginationDto = {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
};

export type ApiWorldHeritageListResponse = {
  items: ApiWorldHeritageDto[];
  pagination: ApiPaginationDto;
};

export type BreadcrumbMap = Record<string, string>;

export interface BreadcrumbContextType {
  labels: BreadcrumbMap;
  setLabel: (path: string, label: string) => void;
}

export const ID_SORT_OPTIONS = {
  ASC: "asc",
  DESC: "desc",
} as const;

export type IdSortOption = (typeof ID_SORT_OPTIONS)[keyof typeof ID_SORT_OPTIONS];

export interface HeritageSearchParams {
  search_query: string | null;
  country: string | null;
  region: StudyRegion | null;
  category: string | null;
  year_inscribed_from: number | null;
  year_inscribed_to: number | null;
  current_page: number;
  per_page: number;
  order: IdSortOption | null;
}
