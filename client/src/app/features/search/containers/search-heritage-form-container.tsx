import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  STUDY_REGIONS,
  CATEGORIES,
  type Category,
  type HeritageSearchParams,
  type StudyRegion,
} from "../../../../domain/types";
import {
  parseHeritageSearchParams,
  serializeHeritageSearchParams,
} from "../mapper/search-heritages.params.ts";
import { HeritageSubHeader } from "@features/top/components/HeritageSubHeader.tsx";
import type { SearchValues } from "@features/top/components/HeritageSearchForm.tsx";

const toSearchYearOrNull = (value: string): number | null => {
  const trimmed = value.trim();
  if (trimmed === "") return null;

  const parsed = Number(trimmed);
  if (!Number.isFinite(parsed)) return null;

  return Math.floor(parsed);
};

const isStudyRegion = (value: string): value is StudyRegion => {
  return (STUDY_REGIONS as readonly string[]).includes(value);
};

const isCategory = (value: string): value is Category => {
  return (CATEGORIES as readonly string[]).includes(value);
};

const toRegionOrNull = (value: StudyRegion | ""): StudyRegion | null => {
  if (value === "") return null;
  return isStudyRegion(value) ? value : null;
};

const toCategoryOrNull = (value: Category | ""): Category | null => {
  if (value === "") return null;
  return isCategory(value) ? value : null;
};

const toKeywordOrNull = (value: string): string | null => {
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
};

export function SearchHeritageFormContainer() {
  const location = useLocation();
  const navigate = useNavigate();

  const params: HeritageSearchParams = useMemo(
    () => parseHeritageSearchParams(location.search),
    [location.search],
  );

  const valueFromUrl: SearchValues = useMemo(
    () => ({
      region: params.region ?? "",
      category: params.category ?? "",
      keyword: params.search_query ?? "",
      yearInscribedFrom:
        params.year_inscribed_from !== null ? String(params.year_inscribed_from) : "",
      yearInscribedTo: params.year_inscribed_to !== null ? String(params.year_inscribed_to) : "",
    }),
    [
      params.region,
      params.category,
      params.search_query,
      params.year_inscribed_from,
      params.year_inscribed_to,
    ],
  );

  const [draft, setDraft] = useState<SearchValues>(valueFromUrl);

  useEffect(() => {
    setDraft(valueFromUrl);
  }, [valueFromUrl]);

  const onChange = useCallback((next: SearchValues) => {
    setDraft(next);
  }, []);

  const onSubmit = useCallback(
    (query: Partial<SearchValues>) => {
      const merged: SearchValues = {
        region: query.region ?? draft.region,
        category: query.category ?? draft.category,
        keyword: query.keyword ?? draft.keyword,
        yearInscribedFrom: query.yearInscribedFrom ?? draft.yearInscribedFrom,
        yearInscribedTo: query.yearInscribedTo ?? draft.yearInscribedTo,
      };

      const nextParams: HeritageSearchParams = {
        ...params,
        region: toRegionOrNull(merged.region),
        category: toCategoryOrNull(merged.category),
        search_query: toKeywordOrNull(merged.keyword),
        year_inscribed_from: toSearchYearOrNull(merged.yearInscribedFrom),
        year_inscribed_to: toSearchYearOrNull(merged.yearInscribedTo),
        current_page: 1,
      };

      const search = serializeHeritageSearchParams(nextParams);

      navigate(
        {
          pathname: location.pathname,
          search,
        },
        { replace: false },
      );
    },
    [draft, location.pathname, navigate, params],
  );

  return <HeritageSubHeader value={draft} onChange={onChange} onSubmit={onSubmit} />;
}
