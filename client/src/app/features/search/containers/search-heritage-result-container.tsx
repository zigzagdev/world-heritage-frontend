import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import type { HeritageSearchParams } from "../mapper/search-heritage.types";
import {
  parseHeritageSearchParams,
  serializeHeritageSearchParams,
} from "../mapper/search-heritages.params";

import { useHeritageSearchQuery } from "../../search/hooks/use-search-heritage-query";
import SearchResultsPage from "../components/SearchResultsPage";
import { toWorldHeritageListVm } from "@features/heritages/mappers/to-world-heritage-vm";
import type { Pagination, HeritageSearchResponse } from "../types";
import { HeritageSubHeader, type SearchValues } from "@features/top/components/HeritageSubHeader";
import { DEFAULT_HERITAGE_SEARCH_PARAMS as SEARCH_PARAMS } from "../mapper/search-heritage.types";

const fmtRangeText = (p: Pagination, count: number) => {
  if (count === 0) return `0 of ${p.total.toLocaleString("en-CA")}`;
  const start = (p.current_page - 1) * p.per_page + 1;
  const end = start + count - 1;
  return `${start}–${end} of ${p.total.toLocaleString("en-CA")}`;
};

const isObject = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null;

const isHeritageSearchResponse = (v: unknown): v is HeritageSearchResponse => {
  if (!isObject(v)) return false;
  if (v.status !== "success" && v.status !== "error") return false;

  const d = v.data;
  if (!isObject(d)) return false;

  return Array.isArray(d.items) && isObject(d.pagination);
};

export function SearchHeritageResultsContainer(): React.ReactElement {
  const location = useLocation();
  const navigate = useNavigate();

  const params: HeritageSearchParams = React.useMemo(
    () => parseHeritageSearchParams(location.search),
    [location.search],
  );

  const [draft, setDraft] = React.useState<SearchValues>({
    region: params.region ?? "",
    category: params.category ?? "",
    keyword: params.search_query ?? "",
  });

  React.useEffect(() => {
    setDraft({
      region: params.region ?? "",
      category: params.category ?? "",
      keyword: params.search_query ?? "",
    });
  }, [params.region, params.category, params.search_query]);

  const { data, isLoading, error } = useHeritageSearchQuery(params);

  const handleClickItem = React.useCallback(
    (id: number) => navigate(`/heritages/${id}`),
    [navigate],
  );

  const goToPage = React.useCallback(
    (page: number) => {
      const next: HeritageSearchParams = { ...params, current_page: page };
      const search = serializeHeritageSearchParams(next);
      navigate({ pathname: location.pathname, search }, { replace: false });
    },
    [navigate, location.pathname, params],
  );

  const handleChange = React.useCallback((v: SearchValues) => {
    setDraft(v);
  }, []);

  const handleSubmit = React.useCallback(
    (q: Partial<SearchValues>) => {
      const merged: SearchValues = {
        region: q.region ?? draft.region,
        category: q.category ?? draft.category,
        keyword: q.keyword ?? draft.keyword,
      };

      const nextParams: HeritageSearchParams = {
        ...SEARCH_PARAMS,
        search_query: merged.keyword.trim() ? merged.keyword.trim() : null,
        region: merged.region || null,
        category: merged.category || null,
        current_page: 1,
      };

      const search = serializeHeritageSearchParams(nextParams);
      navigate({ pathname: "/heritages/results", search }, { replace: false });
      setDraft(merged);
    },
    [navigate, draft],
  );

  const header = (
    <HeritageSubHeader value={draft} onChange={handleChange} onSubmit={handleSubmit} />
  );

  if (isLoading) {
    return <SearchResultsPage header={header} items={[]} pagination={null} rangeText="Loading…" />;
  }

  if (error) {
    const msg = error instanceof Error ? error.message : "Failed";
    return (
      <SearchResultsPage
        header={header}
        items={[]}
        pagination={null}
        rangeText="Failed to load."
        errorMessage={msg}
      />
    );
  }

  if (!data) {
    return <SearchResultsPage header={header} items={[]} pagination={null} rangeText="Loading…" />;
  }
  if (!isHeritageSearchResponse(data) || data.status !== "success") {
    const status = isObject(data) && "status" in data ? String(data.status) : "unknown";
    return (
      <SearchResultsPage
        header={header}
        items={[]}
        pagination={null}
        rangeText="Unexpected response."
        errorMessage={`API status is not success: ${status}`}
      />
    );
  }

  const dtoList = data.data.items;
  const pagination = data.data.pagination;

  const items = toWorldHeritageListVm(dtoList);
  const rangeText = fmtRangeText(pagination, items.length);

  return (
    <SearchResultsPage
      header={header}
      items={items}
      pagination={pagination}
      rangeText={rangeText}
      onClickItem={handleClickItem}
      onPageChange={goToPage}
    />
  );
}
