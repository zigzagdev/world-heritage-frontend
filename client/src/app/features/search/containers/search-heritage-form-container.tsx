import { useCallback, useMemo, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { HeritageSearchParams } from "../mapper/search-heritage.types";
import {
  parseHeritageSearchParams,
  serializeHeritageSearchParams,
} from "../mapper/search-heritages.params.ts";
import {
  HeritageSubHeader,
  type SearchValues,
} from "@features/top/components/HeritageSubHeader.tsx";

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
    }),
    [params.region, params.category, params.search_query],
  );

  const [draft, setDraft] = useState<SearchValues>(valueFromUrl);

  useEffect(() => {
    setDraft(valueFromUrl);
  }, [valueFromUrl]);

  const onChange = useCallback((next: SearchValues) => {
    setDraft(next);
  }, []);

  const onSubmit = useCallback(
    (q: Partial<SearchValues>) => {
      const merged: SearchValues = {
        region: q.region ?? draft.region,
        category: q.category ?? draft.category,
        keyword: q.keyword ?? draft.keyword,
      };

      const nextParams: HeritageSearchParams = {
        ...params,
        region: merged.region || null,
        category: merged.category || null,
        search_query: merged.keyword.trim() ? merged.keyword.trim() : null,
        current_page: 1,
      };

      const search = serializeHeritageSearchParams(nextParams);
      navigate({ pathname: location.pathname, search }, { replace: false });
    },
    [navigate, location.pathname, params, draft],
  );

  return <HeritageSubHeader value={draft} onChange={onChange} onSubmit={onSubmit} />;
}
