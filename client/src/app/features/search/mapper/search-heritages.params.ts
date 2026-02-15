import type { HeritageSearchParams } from "./search-heritage.types.ts";
import { DEFAULT_HERITAGE_SEARCH_PARAMS as D } from "./search-heritage.types.ts";

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
  const i = Math.floor(n);
  return i;
};

const clampMin = (n: number, min: number) => (n < min ? min : n);

export function parseHeritageSearchParams(search: string): HeritageSearchParams {
  const sp = new URLSearchParams(search);

  const search_query = toNullIfEmpty(sp.get("search_query")) ?? D.search_query;
  const country = toNullIfEmpty(sp.get("country")) ?? D.country;
  const region = toNullIfEmpty(sp.get("region")) ?? D.region;
  const category = toNullIfEmpty(sp.get("category")) ?? D.category;

  const year_inscribed_from = toIntOrNull(sp.get("year_inscribed_from")) ?? D.year_inscribed_from;
  const year_inscribed_to = toIntOrNull(sp.get("year_inscribed_to")) ?? D.year_inscribed_to;

  const current_page = clampMin(toIntOrNull(sp.get("current_page")) ?? D.current_page, 1);

  const per_page = clampMin(toIntOrNull(sp.get("per_page")) ?? D.per_page, 1);

  return {
    search_query,
    country,
    region,
    category,
    year_inscribed_from,
    year_inscribed_to,
    current_page,
    per_page,
  };
}

export function serializeHeritageSearchParams(p: HeritageSearchParams): string {
  const sp = new URLSearchParams();

  const setStr = (k: string, v: string | null, def: string | null) => {
    if (v == null) return;
    const s = v.trim();
    if (!s) return;
    if (def != null && s === def) return;
    sp.set(k, s);
  };

  const setNum = (k: string, v: number | null, def: number | null) => {
    if (v == null) return;
    if (!Number.isFinite(v)) return;
    const i = Math.floor(v);
    if (def != null && i === def) return;
    sp.set(k, String(i));
  };

  setStr("search_query", p.search_query, D.search_query);
  setStr("country", p.country, D.country);
  setStr("region", p.region, D.region);
  setStr("category", p.category, D.category);

  setNum("year_inscribed_from", p.year_inscribed_from, D.year_inscribed_from);
  setNum("year_inscribed_to", p.year_inscribed_to, D.year_inscribed_to);
  setNum("current_page", p.current_page, D.current_page);
  setNum("per_page", p.per_page, D.per_page);

  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}
