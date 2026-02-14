import { useEffect, useState } from "react";
import type { HeritageSearchParams } from "../types.ts";

type ApiResponse = {
  status: "success" | "error";
  data: {
    data: object[];
    pagination: {
      current_page: number;
      per_page: number;
      total: number;
      last_page: number;
    };
  };
};

export function useHeritageSearchQuery(params: HeritageSearchParams) {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    const ctrl = new AbortController();

    const run = async () => {
      setLoading(true);
      setError(null);

      try {
        const qs = new URLSearchParams();

        if (params.keyword) qs.set("search_query", params.keyword);
        if (params.region) qs.set("region", params.region);
        if (params.category) qs.set("category", params.category);
        if (params.page) qs.set("page", String(params.page));
        if (params.perPage) qs.set("per_page", String(params.perPage));

        const res = await fetch(`/api/v1/heritages/search?${qs.toString()}`, {
          signal: ctrl.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json = (await res.json()) as ApiResponse;
        setData(json);
      } catch (e) {
        if ((e as undefined) !== "AbortError") setError(e);
      } finally {
        setLoading(false);
      }
    };

    run();
    return () => ctrl.abort();
  }, [params.keyword, params.region, params.category, params.page, params.perPage]);

  return { data, isLoading, error };
}
