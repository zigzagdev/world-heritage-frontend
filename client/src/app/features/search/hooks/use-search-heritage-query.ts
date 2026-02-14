import { useEffect, useState } from "react";
import type { HeritageSearchParams } from "../types";
import { fetchSearchHeritagesResult } from "../apis";
import type { SearchResponse } from "../apis/search-api";

export function useHeritageSearchQuery(params: HeritageSearchParams) {
  const [data, setData] = useState<SearchResponse | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    const abortController = new AbortController();
    const run = async () => {
      setLoading(true);
      setError(null);

      try {
        const json = await fetchSearchHeritagesResult(
          {
            keyword: params.keyword,
            region: params.region,
            category: params.category,
            page: params.page,
            perPage: params.perPage,
          },
          { signal: abortController.signal },
        );

        setData(json);
      } catch (e: unknown) {
        // Throgh this DOMException, access to element property.
        if (e instanceof DOMException && e.name === "AbortError") return;

        setError(e);
      } finally {
        setLoading(false);
      }
    };

    run();
    return () => abortController.abort();
  }, [params.keyword, params.region, params.category, params.page, params.perPage]);

  return { data, isLoading, error };
}
