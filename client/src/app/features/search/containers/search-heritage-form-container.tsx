import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type {
  Category,
  HeritageSearchParams,
  IdSortOption,
  SearchValues,
  StudyRegion,
} from "../../../../domain/types";
import {
  parseHeritageSearchParams,
  serializeHeritageSearchParams,
} from "../mapper/search-heritages.params";
import { DEFAULT_HERITAGE_SEARCH_PARAMS as SEARCH_PARAMS } from "../mapper/search-heritage.types";
import { HeritageSubHeader } from "@features/top/components/HeritageSubHeader";

const DEFAULT_TOP_PER_PAGE = 30;
const DEFAULT_ORDER: IdSortOption = "asc";

const toStudyRegionOrNull = (value: StudyRegion | ""): StudyRegion | null =>
  value === "" ? null : value;

const toCategoryOrNull = (value: Category | ""): Category | null => (value === "" ? null : value);

const toSearchYearOrNull = (value: string): number | null => {
  const trimmed = value.trim();
  if (trimmed === "") return null;
  const parsed = Number(trimmed);
  if (!Number.isFinite(parsed)) return null;
  return Math.floor(parsed);
};

const toSearchValues = (params: HeritageSearchParams): SearchValues => ({
  region: params.region ?? "",
  category: params.category ?? "",
  keyword: params.search_query ?? "",
  yearInscribedFrom: params.year_inscribed_from !== null ? String(params.year_inscribed_from) : "",
  yearInscribedTo: params.year_inscribed_to !== null ? String(params.year_inscribed_to) : "",
  isEndangered: params.is_endangered === true,
});

export function SearchHeritageFormContainer() {
  const location = useLocation();
  const navigate = useNavigate();

  const params: HeritageSearchParams = useMemo(() => {
    const parsed = parseHeritageSearchParams(location.search);
    return {
      ...SEARCH_PARAMS,
      ...parsed,
      current_page: parsed.current_page ?? 1,
      per_page: parsed.per_page ?? DEFAULT_TOP_PER_PAGE,
      order: parsed.order ?? DEFAULT_ORDER,
    };
  }, [location.search]);

  const [draft, setDraft] = useState<SearchValues>(() => toSearchValues(params));

  useEffect(() => {
    setDraft(toSearchValues(params));
  }, [params]);

  const handleChange = useCallback((next: SearchValues) => {
    setDraft(next);
  }, []);

  const handleSubmit = useCallback(
    (query: Partial<SearchValues>) => {
      const merged: SearchValues = {
        region: query.region ?? draft.region,
        category: query.category ?? draft.category,
        keyword: query.keyword ?? draft.keyword,
        yearInscribedFrom: query.yearInscribedFrom ?? draft.yearInscribedFrom,
        yearInscribedTo: query.yearInscribedTo ?? draft.yearInscribedTo,
        isEndangered: query.isEndangered ?? draft.isEndangered,
      };

      const nextParams: HeritageSearchParams = {
        ...SEARCH_PARAMS,
        search_query: merged.keyword.trim() === "" ? null : merged.keyword.trim(),
        region: toStudyRegionOrNull(merged.region),
        category: toCategoryOrNull(merged.category),
        year_inscribed_from: toSearchYearOrNull(merged.yearInscribedFrom),
        year_inscribed_to: toSearchYearOrNull(merged.yearInscribedTo),
        is_endangered: merged.isEndangered ? true : null,
        current_page: 1,
        per_page: params.per_page ?? DEFAULT_TOP_PER_PAGE,
        order: params.order ?? DEFAULT_ORDER,
        country: null,
      };

      const search = serializeHeritageSearchParams(nextParams);
      navigate({ pathname: "/heritages/results", search }, { replace: false });
      setDraft(merged);
    },
    [draft, navigate, params.per_page, params.order],
  );

  return <HeritageSubHeader value={draft} onChange={handleChange} onSubmit={handleSubmit} />;
}
