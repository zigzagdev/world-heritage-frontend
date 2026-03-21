import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TopPage from "../components/TopPage";
import { useTopPage } from "../hooks/use-top-page";

import { HeritageSubHeader } from "../components/HeritageSubHeader";
import { type SearchValues } from "../components/HeritageSearchForm";
import type {
  Category,
  HeritageSearchParams,
  IdSortOption,
  StudyRegion,
} from "../../../../domain/types";
import {
  parseHeritageSearchParams,
  serializeHeritageSearchParams,
} from "@features/search/mapper/search-heritages.params";
import { DEFAULT_HERITAGE_SEARCH_PARAMS as SEARCH_PARAMS } from "@features/search/mapper/search-heritage.types";

const DEFAULT_TOP_PER_PAGE = 30;
const DEFAULT_ORDER: IdSortOption = "asc";

const toStudyRegionOrNull = (value: StudyRegion | ""): StudyRegion | null => {
  return value === "" ? null : value;
};

const toCategoryOrNull = (value: Category | ""): Category | null => {
  return value === "" ? null : value;
};

const toSearchYearOrNull = (value: string): number | null => {
  const trimmed = value.trim();
  if (trimmed === "") return null;

  const parsed = Number(trimmed);
  if (!Number.isFinite(parsed)) return null;

  return Math.floor(parsed);
};

export default function TopPageContainer(): React.ReactElement {
  const location = useLocation();
  const navigate = useNavigate();

  const params: HeritageSearchParams = React.useMemo(() => {
    const parsed = parseHeritageSearchParams(location.search);

    return {
      ...SEARCH_PARAMS,
      ...parsed,
      current_page: parsed.current_page ?? 1,
      per_page: parsed.per_page ?? DEFAULT_TOP_PER_PAGE,
      order: parsed.order ?? DEFAULT_ORDER,
    };
  }, [location.search]);

  const currentPage = params.current_page ?? 1;
  const perPage = params.per_page ?? DEFAULT_TOP_PER_PAGE;
  const order = params.order ?? DEFAULT_ORDER;

  const { items, pagination, reload, isLoading, isError } = useTopPage({
    currentPage,
    perPage,
    order,
  });

  const handleClickItem = React.useCallback(
    (id: number) => navigate(`/heritages/${id}`),
    [navigate],
  );

  const [draft, setDraft] = React.useState<SearchValues>({
    region: params.region ?? "",
    category: params.category ?? "",
    keyword: params.search_query ?? "",
    yearInscribedFrom:
      params.year_inscribed_from !== null ? String(params.year_inscribed_from) : "",
    yearInscribedTo: params.year_inscribed_to !== null ? String(params.year_inscribed_to) : "",
  });

  React.useEffect(() => {
    setDraft({
      region: params.region ?? "",
      category: params.category ?? "",
      keyword: params.search_query ?? "",
      yearInscribedFrom:
        params.year_inscribed_from !== null ? String(params.year_inscribed_from) : "",
      yearInscribedTo: params.year_inscribed_to !== null ? String(params.year_inscribed_to) : "",
    });
  }, [
    params.region,
    params.category,
    params.search_query,
    params.year_inscribed_from,
    params.year_inscribed_to,
  ]);

  const handleSubmit = React.useCallback(
    (query: Partial<SearchValues>) => {
      const merged: SearchValues = {
        region: query.region ?? draft.region,
        category: query.category ?? draft.category,
        keyword: query.keyword ?? draft.keyword,
        yearInscribedFrom: query.yearInscribedFrom ?? draft.yearInscribedFrom,
        yearInscribedTo: query.yearInscribedTo ?? draft.yearInscribedTo,
      };

      const nextParams: HeritageSearchParams = {
        ...SEARCH_PARAMS,
        search_query: merged.keyword.trim() === "" ? null : merged.keyword.trim(),
        region: toStudyRegionOrNull(merged.region),
        category: toCategoryOrNull(merged.category),
        year_inscribed_from: toSearchYearOrNull(merged.yearInscribedFrom),
        year_inscribed_to: toSearchYearOrNull(merged.yearInscribedTo),
        current_page: 1,
        per_page: perPage,
        order,
        country: null,
      };

      const search = serializeHeritageSearchParams(nextParams);

      navigate({ pathname: "/heritages/results", search }, { replace: false });
      setDraft(merged);
    },
    [draft, navigate, order, perPage],
  );

  const handleChangeDraft = React.useCallback((value: SearchValues) => {
    setDraft(value);
  }, []);

  const handleChangePage = React.useCallback(
    (page: number) => {
      const sp = new URLSearchParams(location.search);

      sp.set("current_page", String(page));
      sp.set("per_page", String(perPage));
      sp.set("order", order);

      navigate({ pathname: "/heritages", search: `?${sp.toString()}` }, { replace: false });
    },
    [location.search, navigate, order, perPage],
  );

  const handleChangePerPage = React.useCallback(
    (nextPerPage: number) => {
      const sp = new URLSearchParams(location.search);

      sp.set("current_page", "1");
      sp.set("per_page", String(nextPerPage));
      sp.set("order", order);

      navigate({ pathname: "/heritages", search: `?${sp.toString()}` }, { replace: false });
    },
    [location.search, navigate, order],
  );

  const handleChangeOrder = React.useCallback(
    (nextOrder: IdSortOption) => {
      const sp = new URLSearchParams(location.search);

      sp.set("current_page", "1");
      sp.set("per_page", String(perPage));
      sp.set("order", nextOrder);

      navigate({ pathname: "/heritages", search: `?${sp.toString()}` }, { replace: false });
    },
    [location.search, navigate, perPage],
  );

  if (isLoading) {
    return (
      <>
        <HeritageSubHeader value={draft} onChange={handleChangeDraft} onSubmit={handleSubmit} />
        <main className="p-6">
          <div>Loading…</div>
        </main>
      </>
    );
  }

  if (isError) {
    return (
      <>
        <HeritageSubHeader value={draft} onChange={handleChangeDraft} onSubmit={handleSubmit} />
        <main className="space-y-3 p-6">
          <div className="text-red-700">Failed to load.</div>
          <button type="button" onClick={reload} className="underline">
            Retry
          </button>
        </main>
      </>
    );
  }
  return (
    <TopPage
      header={
        <HeritageSubHeader value={draft} onChange={handleChangeDraft} onSubmit={handleSubmit} />
      }
      items={items}
      onClickItem={handleClickItem}
      onReload={reload}
      currentPage={currentPage}
      perPage={perPage}
      order={order}
      onChangeOrder={handleChangeOrder}
      lastPage={pagination.last_page}
      onChangePage={handleChangePage}
      paginationDisabled={isLoading}
      onChangePerPage={handleChangePerPage}
      perPageOptions={[10, 30, 50, 70]}
    />
  );
}
