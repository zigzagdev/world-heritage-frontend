import { useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { HeritageSearchParams } from "../mapper/search-heritage.types";
import {
  parseHeritageSearchParams,
  serializeHeritageSearchParams,
} from "../mapper/search-heritages.params.ts";
import { HeritageSubHeader } from "@features/top/components/HeritageSubHeader.tsx";

type SearchValues = {
  region: string;
  category: string;
  keyword: string;
};

export function SearchHeritageFormContainer() {
  const location = useLocation();
  const navigate = useNavigate();

  const params: HeritageSearchParams = useMemo(
    () => parseHeritageSearchParams(location.search),
    [location.search],
  );

  const value: SearchValues = useMemo(
    () => ({
      region: params.region ?? "",
      category: params.category ?? "",
      keyword: params.search_query ?? "",
    }),
    [params.region, params.category, params.search_query],
  );

  const onSubmit = useCallback(
    (q: { region?: string; category?: string; keyword?: string }) => {
      const next: HeritageSearchParams = {
        ...params,
        region: q.region ?? null,
        category: q.category ?? null,
        search_query: q.keyword?.trim() ? q.keyword.trim() : null,
        current_page: 1,
      };

      const search = serializeHeritageSearchParams(next);

      navigate({ pathname: location.pathname, search }, { replace: false });
    },
    [navigate, location.pathname, params],
  );

  return <HeritageSubHeader title={"World Heritage"} value={value} onSubmit={onSubmit} />;
}
