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

/** Determine whether any valid search condition exists */
const hasSearchParams = (params: HeritageSearchParams): boolean =>
  params.search_query !== null ||
  params.region !== null ||
  params.category !== null ||
  params.year_inscribed_from !== null ||
  params.year_inscribed_to !== null;

type Props = {
  /** Notify the parent which API should be used: list or search */
  onApiModeChange?: (isSearch: boolean) => void;
};

export function SearchHeritageFormContainer({ onApiModeChange }: Props) {
  const location = useLocation();
  const navigate = useNavigate();

  const params: HeritageSearchParams = useMemo(
    () => parseHeritageSearchParams(location.search),
    [location.search],
  );

  // If any search parameter exists, we consider it as "search mode". Otherwise, it's "list mode".
  const isSearchMode = useMemo(() => hasSearchParams(params), [params]);

  useEffect(() => {
    onApiModeChange?.(isSearchMode);
  }, [isSearchMode, onApiModeChange]);

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
        region: merged.region.trim() || null,
        category: merged.category.trim() || null,
        search_query: merged.keyword.trim() || null,
        year_inscribed_from: toSearchYearOrNull(merged.yearInscribedFrom),
        year_inscribed_to: toSearchYearOrNull(merged.yearInscribedTo),
        current_page: 1,
      };

      const search = serializeHeritageSearchParams(nextParams);
      navigate({ pathname: location.pathname, search }, { replace: false });
    },
    [navigate, location.pathname, params, draft],
  );

  return <HeritageSubHeader value={draft} onChange={onChange} onSubmit={onSubmit} />;
}
