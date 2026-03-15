import type { HeritageSearchParams, IdSortOption, StudyRegion } from "../../../../domain/types.ts";
import { STUDY_REGIONS } from "../../../../domain/types.ts";
import { DEFAULT_HERITAGE_SEARCH_PARAMS as defaultSearchParams } from "./search-heritage.types.ts";

const toNullIfEmpty = (v: string | null): string | null => {
  if (v == null) return null;
  const s = v.trim();
  return s === "" ? null : s;
};

const toIntOrNull = (v: string | null): number | null => {
  if (v == null) return null;
  const s = v.trim();
  if (s === "") return null;
  const n = Number(s);
  if (!Number.isFinite(n)) return null;
  return Math.floor(n);
};

const clampMin = (n: number, min: number) => (n < min ? min : n);

const isStudyRegion = (value: string): value is StudyRegion => {
  return STUDY_REGIONS.includes(value as StudyRegion);
};

const toRegionOrNull = (v: string | null): StudyRegion | null => {
  const s = toNullIfEmpty(v);
  if (s == null) return null;
  return isStudyRegion(s) ? s : null;
};

const isIdSortOption = (value: string): value is IdSortOption => {
  return value === "asc" || value === "desc";
};

const toOrderOrNull = (v: string | null): IdSortOption | null => {
  const s = toNullIfEmpty(v);
  if (s == null) return null;
  return isIdSortOption(s) ? s : null;
};

export function parseHeritageSearchParams(search: string): HeritageSearchParams {
  const searchParams = new URLSearchParams(search);

  const search_query =
    toNullIfEmpty(searchParams.get("search_query")) ?? defaultSearchParams.search_query;
  const country = toNullIfEmpty(searchParams.get("country")) ?? defaultSearchParams.country;
  const region = toRegionOrNull(searchParams.get("region")) ?? defaultSearchParams.region;
  const category = toNullIfEmpty(searchParams.get("category")) ?? defaultSearchParams.category;

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

  return {
    search_query,
    country,
    region,
    category,
    year_inscribed_from,
    year_inscribed_to,
    current_page,
    per_page,
    order,
  };
}

export function serializeHeritageSearchParams(p: HeritageSearchParams): string {
  const searchParams = new URLSearchParams();

  const setStr = (k: string, v: string | null, def: string | null) => {
    if (v == null) return;
    const s = v.trim();
    if (s === "") return;
    if (def != null && s === def) return;
    searchParams.set(k, s);
  };

  const setNum = (k: string, v: number | null, def: number | null) => {
    if (v == null) return;
    if (!Number.isFinite(v)) return;
    const i = Math.floor(v);
    if (def != null && i === def) return;
    searchParams.set(k, String(i));
  };

  setStr("search_query", p.search_query, defaultSearchParams.search_query);
  setStr("country", p.country, defaultSearchParams.country);
  setStr("region", p.region, defaultSearchParams.region);
  setStr("category", p.category, defaultSearchParams.category);

  setNum("year_inscribed_from", p.year_inscribed_from, defaultSearchParams.year_inscribed_from);
  setNum("year_inscribed_to", p.year_inscribed_to, defaultSearchParams.year_inscribed_to);
  setNum("current_page", p.current_page, defaultSearchParams.current_page);
  setNum("per_page", p.per_page, defaultSearchParams.per_page);

  if (p.order != null && p.order !== defaultSearchParams.order) {
    searchParams.set("order", p.order);
  }

  const qs = searchParams.toString();
  return qs ? `?${qs}` : "";
}
