import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import type { HeritageSearchParams } from "../../../../domain/types";
import {
  parseHeritageSearchParams,
  serializeHeritageSearchParams,
} from "../mapper/search-heritages.params";

import { useHeritageSearchQuery } from "../../search/hooks/use-search-heritage-query";
import SearchResultsPage from "../components/SearchResultsPage";
import type {
  ApiWorldHeritageDto,
  Pagination,
  SearchValues,
  WorldHeritageVm,
} from "../../../../domain/types";
import { toWorldHeritageListVm } from "@features/heritages/mappers/to-world-heritage-vm";
import { HeritageSubHeader } from "@features/top/components/HeritageSubHeader";
import { DEFAULT_HERITAGE_SEARCH_PARAMS as SEARCH_PARAMS } from "../mapper/search-heritage.types";
import { useLocale } from "@shared/locale/LocaleHooks";

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
): value is { items: ApiWorldHeritageDto[]; pagination: Pagination } => {
  if (!isObject(value)) {
    return false;
  }

  return Array.isArray(value.items) && isObject(value.pagination);
};

/** Determine whether any valid search condition exists */
const hasSearchParams = (params: HeritageSearchParams): boolean =>
  params.search_query !== null ||
  params.region !== null ||
  params.category !== null ||
  params.year_inscribed_from !== null ||
  params.year_inscribed_to !== null ||
  params.is_endangered === true ||
  params.criteria.length > 0;

const toDraftValues = (params: HeritageSearchParams): SearchValues => ({
  region: params.region ?? "",
  category: params.category ?? "",
  keyword: params.search_query ?? "",
  yearInscribedFrom: params.year_inscribed_from !== null ? String(params.year_inscribed_from) : "",
  yearInscribedTo: params.year_inscribed_to !== null ? String(params.year_inscribed_to) : "",
  isEndangered: params.is_endangered === true,
  criteria: params.criteria,
});

const toSearchParams = (draft: SearchValues): HeritageSearchParams => ({
  ...SEARCH_PARAMS,
  search_query: draft.keyword.trim() ? draft.keyword.trim() : null,
  region: draft.region || null,
  category: draft.category || null,
  year_inscribed_from: draft.yearInscribedFrom ? Number(draft.yearInscribedFrom) : null,
  year_inscribed_to: draft.yearInscribedTo ? Number(draft.yearInscribedTo) : null,
  is_endangered: draft.isEndangered ? true : null,
  criteria: draft.criteria,
  current_page: 1,
});

const mergeDraft = (currentDraft: SearchValues, partial: Partial<SearchValues>): SearchValues => ({
  region: partial.region ?? currentDraft.region,
  category: partial.category ?? currentDraft.category,
  keyword: partial.keyword ?? currentDraft.keyword,
  yearInscribedFrom: partial.yearInscribedFrom ?? currentDraft.yearInscribedFrom,
  yearInscribedTo: partial.yearInscribedTo ?? currentDraft.yearInscribedTo,
  isEndangered: partial.isEndangered ?? currentDraft.isEndangered,
  criteria: partial.criteria ?? currentDraft.criteria,
});

// 現在の URL に lang=ja があれば、遷移先 search にも持たせる (en はデフォルトなので付けない)
const preserveLang = (nextSearch: string, currentSearch: string): string => {
  const currentLang = new URLSearchParams(currentSearch).get("lang");
  if (currentLang !== "ja") return nextSearch;
  const params = new URLSearchParams(nextSearch.startsWith("?") ? nextSearch.slice(1) : nextSearch);
  params.set("lang", "ja");
  return `?${params.toString()}`;
};

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
  const { locale } = useLocale();

  const params = React.useMemo<HeritageSearchParams>(
    () => parseHeritageSearchParams(location.search),
    [location.search],
  );

  // If no search condition exists, redirect to the list page.
  const isSearchMode = hasSearchParams(params);

  React.useEffect(() => {
    if (!isSearchMode) {
      navigate({ pathname: "/heritages", search: location.search }, { replace: true });
    }
  }, [isSearchMode, location.search, navigate]);

  const { draft, setDraft, handleChange } = useHeritageSearchDraft(params);

  const { data, isLoading, error } = useHeritageSearchQuery(params, { enabled: isSearchMode });

  const handleClickItem = React.useCallback(
    (id: number) => {
      const search = preserveLang("", location.search);
      navigate(`/heritages/${id}${search}`);
    },
    [navigate, location.search],
  );

  const handlePageChange = React.useCallback(
    (page: number) => {
      const nextParams: HeritageSearchParams = {
        ...params,
        current_page: page,
      };

      const search = preserveLang(serializeHeritageSearchParams(nextParams), location.search);

      navigate(
        {
          pathname: location.pathname,
          search,
        },
        { replace: false },
      );
    },
    [navigate, location.pathname, location.search, params],
  );

  const handleSubmit = React.useCallback(
    (partial: Partial<SearchValues>) => {
      const nextDraft = mergeDraft(draft, partial);
      const nextParams = toSearchParams(nextDraft);
      const search = preserveLang(serializeHeritageSearchParams(nextParams), location.search);

      navigate(
        {
          pathname: "/heritages/results",
          search,
        },
        { replace: false },
      );

      setDraft(nextDraft);
    },
    [draft, navigate, setDraft, location.search],
  );

  // Hooks must be called at the top level before any early returns.
  const handleBackToAllSites = React.useCallback(() => {
    const search = preserveLang("", location.search);
    navigate(`/heritages${search}`, { replace: true });
  }, [navigate, location.search]);

  const header = (
    <HeritageSubHeader value={draft} onChange={handleChange} onSubmit={handleSubmit} />
  );

  const baseProps = {
    header,
    onBackToAllSites: handleBackToAllSites,
    items: [] as WorldHeritageVm[],
    pagination: null,
  };

  if (isLoading) {
    return <SearchResultsPage {...baseProps} pagination={null} rangeText="Loading…" />;
  }

  if (error) {
    const message = error instanceof Error ? error.message : "Failed";

    return <SearchResultsPage {...baseProps} rangeText="Failed to load." errorMessage={message} />;
  }

  if (!data || !isValidListResult(data)) {
    return (
      <SearchResultsPage
        {...baseProps}
        rangeText="Unexpected response."
        errorMessage={!data ? undefined : "Invalid data structure: items or pagination missing."}
      />
    );
  }

  const items = toWorldHeritageListVm(data.items, locale);
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
      onBackToAllSites={handleBackToAllSites}
    />
  );
}
