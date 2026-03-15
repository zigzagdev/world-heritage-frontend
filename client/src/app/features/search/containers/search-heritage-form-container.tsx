import { useCallback, useMemo, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { HeritageSearchParams } from "../../../../domain/types";
import {
  parseHeritageSearchParams,
  serializeHeritageSearchParams,
} from "../mapper/search-heritages.params.ts";
import {
  HeritageSubHeader,
  type SearchValues,
} from "@features/top/components/HeritageSubHeader.tsx";

const toSearchYearOrNull = (value: string): number | null => {
  const trimmed = value.trim();
  if (trimmed === "") return null;

  const parsed = Number(trimmed);
  if (!Number.isFinite(parsed)) return null;

  return Math.floor(parsed);
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
      const yearInscribedFrom = toSearchYearOrNull(merged.yearInscribedFrom);
      const yearInscribedTo = toSearchYearOrNull(merged.yearInscribedTo);

      const nextParams: HeritageSearchParams = {
        ...params,
        region: merged.region.trim() ? merged.region.trim() : null,
        category: merged.category.trim() ? merged.category.trim() : null,
        search_query: merged.keyword.trim() ? merged.keyword.trim() : null,
        year_inscribed_from: yearInscribedFrom,
        year_inscribed_to: yearInscribedTo,
        current_page: 1,
      };
      const search = serializeHeritageSearchParams(nextParams);
      navigate({ pathname: location.pathname, search }, { replace: false });
    },
    [navigate, location.pathname, params, draft],
  );

  return <HeritageSubHeader value={draft} onChange={onChange} onSubmit={onSubmit} />;
}
