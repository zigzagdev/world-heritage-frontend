import * as React from "react";
import { useNavigate } from "react-router-dom";
import TopPage from "../components/TopPage";
import { useTopPage } from "../hooks/use-top-page";

import { HeritageSubHeader, type SearchValues } from "../components/HeritageSubHeader";
import type { HeritageSearchParams } from "@features/search/mapper/search-heritage.types";
import { serializeHeritageSearchParams } from "@features/search/mapper/search-heritages.params";
import { DEFAULT_HERITAGE_SEARCH_PARAMS as SEARCH_PARAMS } from "@features/search/mapper/search-heritage.types";

export default function TopPageContainer(): React.ReactElement {
  const { items, pagination, setPage, reload, isLoading, isError } = useTopPage();
  const navigate = useNavigate();

  const handleClickItem = React.useCallback(
    (id: number) => navigate(`/heritages/${id}`),
    [navigate],
  );

  const [draft, setDraft] = React.useState<SearchValues>({
    region: "",
    category: "",
    keyword: "",
  });

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

      const params: HeritageSearchParams = {
        ...SEARCH_PARAMS,
        search_query: merged.keyword.trim() ? merged.keyword.trim() : null,
        region: merged.region || null,
        category: merged.category || null,
        current_page: 1,
      };

      const search = serializeHeritageSearchParams(params);
      navigate({ pathname: "/heritages/results", search }, { replace: false });

      setDraft(merged);
    },
    [navigate, draft],
  );

  if (isLoading) {
    return (
      <>
        <HeritageSubHeader value={draft} onChange={handleChange} onSubmit={handleSubmit} />
        <main className="p-6">
          <div>Loading…</div>
        </main>
      </>
    );
  }

  if (isError) {
    return (
      <>
        <HeritageSubHeader value={draft} onChange={handleChange} onSubmit={handleSubmit} />
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
      header={<HeritageSubHeader value={draft} onChange={handleChange} onSubmit={handleSubmit} />}
      items={items}
      onClickItem={handleClickItem}
      onReload={reload}
      currentPage={pagination.current_page}
      lastPage={pagination.last_page}
      onChangePage={setPage}
      paginationDisabled={isLoading}
    />
  );
}
