import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TopPage from "../components/TopPage";
import { useTopPage } from "../hooks/use-top-page";

import { HeritageSubHeader, type SearchValues } from "../components/HeritageSubHeader";
import type { HeritageSearchParams } from "@features/search/mapper/search-heritage.types";
import {
  parseHeritageSearchParams,
  serializeHeritageSearchParams,
} from "@features/search/mapper/search-heritages.params";
import { DEFAULT_HERITAGE_SEARCH_PARAMS as SEARCH_PARAMS } from "@features/search/mapper/search-heritage.types";
import type { IdSortOption } from "../../../../domain/types";

const DEFAULT_TOP_PER_PAGE = 30;
const DEFAULT_ORDER: IdSortOption = "asc";

export default function TopPageContainer(): React.ReactElement {
  const location = useLocation();
  const navigate = useNavigate();

  const params: HeritageSearchParams = React.useMemo(() => {
    const parsed = parseHeritageSearchParams(location.search);
    return {
      ...SEARCH_PARAMS,
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
    region: "",
    category: "",
    keyword: "",
    yearInscribedFrom: "",
    yearInscribedTo: "",
  });

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
        search_query: merged.keyword.trim() ? merged.keyword.trim() : null,
        region: merged.region || null,
        category: merged.category || null,
        year_inscribed_from: merged.yearInscribedFrom ? Number(merged.yearInscribedFrom) : null,
        year_inscribed_to: merged.yearInscribedTo ? Number(merged.yearInscribedTo) : null,
        current_page: 1,
        per_page: perPage,
        order,
      };

      const search = serializeHeritageSearchParams(nextParams);
      navigate({ pathname: "/heritages/results", search }, { replace: false });

      setDraft(merged);
    },
    [navigate, draft, perPage, order],
  );

  const handleChangeDraft = React.useCallback((v: SearchValues) => {
    setDraft(v);
  }, []);

  const handleChangePage = React.useCallback(
    (page: number) => {
      const sp = new URLSearchParams(location.search);

      sp.set("current_page", String(page));
      sp.set("per_page", String(perPage));
      sp.set("order", order);

      navigate({ pathname: "/heritages", search: `?${sp.toString()}` }, { replace: false });
    },
    [navigate, location.search, perPage, order],
  );

  const handleChangePerPage = React.useCallback(
    (nextPerPage: number) => {
      const sp = new URLSearchParams(location.search);

      sp.set("current_page", "1");
      sp.set("per_page", String(nextPerPage));
      sp.set("order", order);

      navigate({ pathname: "/heritages", search: `?${sp.toString()}` }, { replace: false });
    },
    [navigate, location.search, order],
  );

  const handleChangeOrder = React.useCallback(
    (nextOrder: IdSortOption) => {
      const sp = new URLSearchParams(location.search);

      sp.set("current_page", "1");
      sp.set("per_page", String(perPage));
      sp.set("order", nextOrder);

      navigate({ pathname: "/heritages", search: `?${sp.toString()}` }, { replace: false });
    },
    [navigate, location.search, perPage],
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
        <main className="p-6 space-y-3">
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
