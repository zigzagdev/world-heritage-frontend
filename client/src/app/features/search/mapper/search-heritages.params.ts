import type {
  Category,
  CriteriaCode,
  HeritageSearchParams,
  IdSortOption,
  StudyRegion,
} from "../../../../domain/types.ts";
import { CATEGORIES, CRITERIA, STUDY_REGIONS } from "../../../../domain/types.ts";
import { DEFAULT_HERITAGE_SEARCH_PARAMS as defaultSearchParams } from "./search-heritage.types.ts";

const toNullIfEmpty = (value: string | null): string | null => {
  if (value == null) return null;
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
};

const toIntOrNull = (value: string | null): number | null => {
  if (value == null) return null;
  const trimmed = value.trim();
  if (trimmed === "") return null;

  const parsed = Number(trimmed);
  if (!Number.isFinite(parsed)) return null;

  return Math.floor(parsed);
};

const clampMin = (valueNumber: number, min: number): number => {
  return valueNumber < min ? min : valueNumber;
};

const isStudyRegion = (value: string): value is StudyRegion => {
  return (STUDY_REGIONS as readonly string[]).includes(value);
};

const toRegionOrNull = (value: string | null): StudyRegion | null => {
  const trimmed = toNullIfEmpty(value);
  if (trimmed == null) return null;
  return isStudyRegion(trimmed) ? trimmed : null;
};

const isCategory = (value: string): value is Category => {
  return (CATEGORIES as readonly string[]).includes(value);
};

const toCategoryOrNull = (value: string | null): Category | null => {
  const trimmed = toNullIfEmpty(value);
  if (trimmed == null) return null;
  return isCategory(trimmed) ? trimmed : null;
};

const isIdSortOption = (value: string): value is IdSortOption => {
  return value === "asc" || value === "desc";
};

const toOrderOrNull = (value: string | null): IdSortOption | null => {
  const trimmed = toNullIfEmpty(value);
  if (trimmed == null) return null;
  return isIdSortOption(trimmed) ? trimmed : null;
};

// "true" だけ true。それ以外 (空 / 不正値 / "false") は null = フィルタなし扱い。
const toEndangeredOrNull = (value: string | null): boolean | null => {
  const trimmed = toNullIfEmpty(value);
  if (trimmed == null) return null;
  return trimmed === "true" ? true : null;
};

const isCriteriaCode = (value: string): value is CriteriaCode =>
  (CRITERIA as readonly string[]).includes(value);

// comma-separated を CriteriaCode[] にデコード。重複除去 + CRITERIA 順に正規化、不正値は捨てる。
const toCriteriaCodes = (value: string | null): CriteriaCode[] => {
  if (value == null) return [];
  const parts = value
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  const unique = Array.from(new Set(parts)).filter(isCriteriaCode);
  return unique.sort((a, b) => CRITERIA.indexOf(a) - CRITERIA.indexOf(b));
};

export function parseHeritageSearchParams(search: string): HeritageSearchParams {
  const searchParams = new URLSearchParams(search);

  const search_query =
    toNullIfEmpty(searchParams.get("search_query")) ?? defaultSearchParams.search_query;

  const country = toNullIfEmpty(searchParams.get("country")) ?? defaultSearchParams.country;

  const region = toRegionOrNull(searchParams.get("region")) ?? defaultSearchParams.region;

  const category = toCategoryOrNull(searchParams.get("category")) ?? defaultSearchParams.category;

  const year_inscribed_from =
    toIntOrNull(searchParams.get("year_inscribed_from")) ?? defaultSearchParams.year_inscribed_from;

  const year_inscribed_to =
    toIntOrNull(searchParams.get("year_inscribed_to")) ?? defaultSearchParams.year_inscribed_to;

  const current_page = clampMin(
    toIntOrNull(searchParams.get("current_page")) ?? defaultSearchParams.current_page,
    1,
  );

  const per_page = clampMin(
    toIntOrNull(searchParams.get("per_page")) ?? defaultSearchParams.per_page,
    1,
  );

  const order = toOrderOrNull(searchParams.get("order")) ?? defaultSearchParams.order;

  const is_endangered =
    toEndangeredOrNull(searchParams.get("is_endangered")) ?? defaultSearchParams.is_endangered;

  const criteria = toCriteriaCodes(searchParams.get("criteria"));

  return {
    search_query,
    country,
    region,
    category,
    year_inscribed_from,
    year_inscribed_to,
    is_endangered,
    criteria,
    current_page,
    per_page,
    order,
  };
}

export function serializeHeritageSearchParams(params: HeritageSearchParams): string {
  const searchParams = new URLSearchParams();

  const setStr = (key: string, value: string | null, defaultValue: string | null) => {
    if (value == null) return;
    const trimmed = value.trim();
    if (trimmed === "") return;
    if (defaultValue != null && trimmed === defaultValue) return;
    searchParams.set(key, trimmed);
  };

  const setNum = (key: string, value: number | null, defaultValue: number | null) => {
    if (value == null) return;
    if (!Number.isFinite(value)) return;
    const floored = Math.floor(value);
    if (defaultValue != null && floored === defaultValue) return;
    searchParams.set(key, String(floored));
  };

  setStr("search_query", params.search_query, defaultSearchParams.search_query);
  setStr("country", params.country, defaultSearchParams.country);
  setStr("region", params.region, defaultSearchParams.region);
  setStr("category", params.category, defaultSearchParams.category);

  setNum(
    "year_inscribed_from",
    params.year_inscribed_from,
    defaultSearchParams.year_inscribed_from,
  );
  setNum("year_inscribed_to", params.year_inscribed_to, defaultSearchParams.year_inscribed_to);
  setNum("current_page", params.current_page, defaultSearchParams.current_page);
  setNum("per_page", params.per_page, defaultSearchParams.per_page);

  if (params.order != null && params.order !== defaultSearchParams.order) {
    searchParams.set("order", params.order);
  }

  // 危機遺産: true のときだけ URL に乗せる (false / null は省略 = no filter)
  if (params.is_endangered === true) {
    searchParams.set("is_endangered", "true");
  }

  // criteria: 非空のときだけ comma-separated で URL に乗せる
  if (params.criteria.length > 0) {
    searchParams.set("criteria", params.criteria.join(","));
  }

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
}
