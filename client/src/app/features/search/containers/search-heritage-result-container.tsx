import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import type { HeritageSearchParams } from "../../../../domain/types";
import {
  parseHeritageSearchParams,
  serializeHeritageSearchParams,
} from "../mapper/search-heritages.params";

import { useHeritageSearchQuery } from "../../search/hooks/use-search-heritage-query";
import SearchResultsPage from "../components/SearchResultsPage";
import { toWorldHeritageListVm } from "@features/heritages/mappers/to-world-heritage-vm";
import type { Pagination } from "../types";
import { HeritageSubHeader, type SearchValues } from "@features/top/components/HeritageSubHeader";
import { DEFAULT_HERITAGE_SEARCH_PARAMS as SEARCH_PARAMS } from "../mapper/search-heritage.types";
import type { ApiSearchResponse } from "@features/search/apis/search-api";

const fmtRangeText = (pagination: Pagination, count: number): string => {
  if (count === 0) {
    return `0 of ${pagination.total.toLocaleString("en-CA")}`;
  }

  const start = (pagination.current_page - 1) * pagination.per_page + 1;
  const end = start + count - 1;

  return `${start}–${end} of ${pagination.total.toLocaleString("en-CA")}`;
};

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isValidListResult = (
  value: unknown,
): value is { items: ApiSearchResponse[]; pagination: Pagination } => {
  if (!isObject(value)) {
    return false;
  }

  return Array.isArray(value.items) && isObject(value.pagination);
};

const toDraftValues = (params: HeritageSearchParams): SearchValues => ({
  region: params.region ?? "",
  category: params.category ?? "",
  keyword: params.search_query ?? "",
  yearInscribedFrom: params.year_inscribed_from !== null ? String(params.year_inscribed_from) : "",
  yearInscribedTo: params.year_inscribed_to !== null ? String(params.year_inscribed_to) : "",
});

const toSearchParams = (draft: SearchValues): HeritageSearchParams => ({
  ...SEARCH_PARAMS,
  search_query: draft.keyword.trim() ? draft.keyword.trim() : null,
  region: draft.region || null,
  category: draft.category || null,
  year_inscribed_from: draft.yearInscribedFrom ? Number(draft.yearInscribedFrom) : null,
  year_inscribed_to: draft.yearInscribedTo ? Number(draft.yearInscribedTo) : null,
  current_page: 1,
});

const mergeDraft = (currentDraft: SearchValues, partial: Partial<SearchValues>): SearchValues => ({
  region: partial.region ?? currentDraft.region,
  category: partial.category ?? currentDraft.category,
  keyword: partial.keyword ?? currentDraft.keyword,
  yearInscribedFrom: partial.yearInscribedFrom ?? currentDraft.yearInscribedFrom,
  yearInscribedTo: partial.yearInscribedTo ?? currentDraft.yearInscribedTo,
});

function useHeritageSearchDraft(params: HeritageSearchParams) {
  const [draft, setDraft] = React.useState<SearchValues>(() => toDraftValues(params));

  React.useEffect(() => {
    setDraft(toDraftValues(params));
  }, [params]);

  const handleChange = React.useCallback((value: SearchValues) => {
    setDraft(value);
  }, []);

  return {
    draft,
    setDraft,
    handleChange,
  };
}

export function SearchHeritageResultsContainer(): React.ReactElement {
  const location = useLocation();
  const navigate = useNavigate();

  const params = React.useMemo<HeritageSearchParams>(
    () => parseHeritageSearchParams(location.search),
    [location.search],
  );

  const { draft, setDraft, handleChange } = useHeritageSearchDraft(params);

  const { data, isLoading, error } = useHeritageSearchQuery(params);

  const handleClickItem = React.useCallback(
    (id: number) => {
      navigate(`/heritages/${id}`);
    },
    [navigate],
  );

  const handlePageChange = React.useCallback(
    (page: number) => {
      const nextParams: HeritageSearchParams = {
        ...params,
        current_page: page,
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
    [navigate, location.pathname, params],
  );

  const handleSubmit = React.useCallback(
    (partial: Partial<SearchValues>) => {
      const nextDraft = mergeDraft(draft, partial);
      const nextParams = toSearchParams(nextDraft);
      const search = serializeHeritageSearchParams(nextParams);

      navigate(
        {
          pathname: "/heritages/results",
          search,
        },
        { replace: false },
      );

      setDraft(nextDraft);
    },
    [draft, navigate, setDraft],
  );

  const header = (
    <HeritageSubHeader value={draft} onChange={handleChange} onSubmit={handleSubmit} />
  );

  if (isLoading) {
    return <SearchResultsPage header={header} items={[]} pagination={null} rangeText="Loading…" />;
  }

  if (error) {
    const message = error instanceof Error ? error.message : "Failed";

    return (
      <SearchResultsPage
        header={header}
        items={[]}
        pagination={null}
        rangeText="Failed to load."
        errorMessage={message}
      />
    );
  }

  if (!data || !isValidListResult(data)) {
    return (
      <SearchResultsPage
        header={header}
        items={[]}
        pagination={null}
        rangeText="Unexpected response."
        errorMessage={!data ? undefined : "Invalid data structure: items or pagination missing."}
      />
    );
  }

  const items = toWorldHeritageListVm(data.items);
  const pagination = data.pagination;
  const rangeText = fmtRangeText(pagination, items.length);

  return (
    <SearchResultsPage
      header={header}
      items={items}
      pagination={pagination}
      rangeText={rangeText}
      onClickItem={handleClickItem}
      onPageChange={handlePageChange}
    />
  );
}
