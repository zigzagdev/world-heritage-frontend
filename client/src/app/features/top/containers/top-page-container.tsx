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

const DEFAULT_TOP_PER_PAGE = 30;

export default function TopPageContainer(): React.ReactElement {
  const location = useLocation();
  const navigate = useNavigate();
  const params: HeritageSearchParams = React.useMemo(() => {
    const params = parseHeritageSearchParams(location.search);
    return {
      ...SEARCH_PARAMS,
      current_page: params.current_page ?? 1,
      per_page: params.per_page ?? DEFAULT_TOP_PER_PAGE,
    };
  }, [location.search]);

  const { items, pagination, reload, isLoading, isError } = useTopPage({
    currentPage: params.current_page ?? 1,
    perPage: params.per_page ?? DEFAULT_TOP_PER_PAGE,
  });

  const handleClickItem = React.useCallback(
    (id: number) => navigate(`/heritages/${id}`),
    [navigate],
  );

  const [draft, setDraft] = React.useState<SearchValues>({
    region: "",
    category: "",
    keyword: "",
  });

  const handleSubmit = React.useCallback(
    (query: Partial<SearchValues>) => {
      const merged: SearchValues = {
        region: query.region ?? draft.region,
        category: query.category ?? draft.category,
        keyword: query.keyword ?? draft.keyword,
      };

      const nextParams: HeritageSearchParams = {
        ...SEARCH_PARAMS,
        search_query: merged.keyword.trim() ? merged.keyword.trim() : null,
        region: merged.region || null,
        category: merged.category || null,
        current_page: 1,
        per_page: params.per_page ?? DEFAULT_TOP_PER_PAGE,
      };

      const search = serializeHeritageSearchParams(nextParams);
      navigate({ pathname: "/heritages/results", search }, { replace: false });

      setDraft(merged);
    },
    [navigate, draft, params.per_page],
  );

  const handleChangeDraft = React.useCallback((v: SearchValues) => {
    setDraft(v);
  }, []);

  const handleChangePage = React.useCallback(
    (page: number) => {
      const sp = new URLSearchParams(location.search);

      sp.set("current_page", String(page));
      sp.set("per_page", String(params.per_page ?? DEFAULT_TOP_PER_PAGE));

      navigate({ pathname: "/heritages", search: `?${sp.toString()}` }, { replace: false });
    },
    [navigate, location.search, params.per_page],
  );

  const handleChangePerPage = React.useCallback(
    (nextPerPage: number) => {
      const sp = new URLSearchParams(location.search);

      sp.set("current_page", "1");
      sp.set("per_page", String(nextPerPage));

      navigate({ pathname: "/heritages", search: `?${sp.toString()}` }, { replace: false });
    },
    [navigate, location.search],
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
      currentPage={params.current_page ?? 1}
      perPage={params.per_page ?? DEFAULT_TOP_PER_PAGE}
      lastPage={pagination.last_page}
      onChangePage={handleChangePage}
      paginationDisabled={isLoading}
      onChangePerPage={handleChangePerPage}
      perPageOptions={[10, 30, 50, 70]}
    />
  );
}
