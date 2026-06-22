import { useCallback, useEffect, useMemo, useState } from "react";
import type { HeritageSearchParams } from "../../../../domain/types.ts";
import { fetchSearchHeritagesResult } from "../apis";
import type { SearchParams } from "../apis/search-api";
import type { ApiWorldHeritageDto, ListResult } from "../../../../domain/types";

const isAbortError = (e: unknown): boolean => {
  return e instanceof DOMException && e.name === "AbortError";
};

const toSearchParams = (params: HeritageSearchParams): SearchParams => ({
  keyword: params.search_query ?? undefined,
  region: params.region ?? undefined,
  category: params.category ?? undefined,
  yearInscribedFrom: params.year_inscribed_from ?? undefined,
  yearInscribedTo: params.year_inscribed_to ?? undefined,
  isEndangered: params.is_endangered === true ? true : undefined,
  criteria: params.criteria.length > 0 ? params.criteria : undefined,
  currentPage: params.current_page,
  perPage: params.per_page,
});

type Options = {
  /** If false, the API call is skipped. Default is true. */
  enabled?: boolean;
};

export function useHeritageSearchQuery(
  params: HeritageSearchParams,
  { enabled = true }: Options = {},
) {
  const [data, setData] = useState<ListResult<ApiWorldHeritageDto> | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const [reloadToken, setReloadToken] = useState(0);

  const request: SearchParams = useMemo(() => toSearchParams(params), [params]);
  const refetch = useCallback(() => setReloadToken((t) => t + 1), []);

  useEffect(() => {
    if (!enabled) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    const abortController = new AbortController();

    setLoading(true);
    setError(null);

    fetchSearchHeritagesResult(request, { signal: abortController.signal })
      .then((res) => {
        setData(res);
      })
      .catch((e: unknown) => {
        if (isAbortError(e)) return;
        setError(e);
      })
      .finally(() => setLoading(false));

    return () => abortController.abort();
  }, [enabled, request, reloadToken]);

  return { data, isLoading, error, refetch };
}
