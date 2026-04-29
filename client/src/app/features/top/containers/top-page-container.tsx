import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TopPage from "../components/TopPage";
import { useTopPage } from "../hooks/use-top-page";
import { SearchHeritageFormContainer } from "@features/search/containers/search-heritage-form-container";
import type { IdSortOption } from "../../../../domain/types";
import { parseHeritageSearchParams } from "@features/search/mapper/search-heritages.params";
import { DEFAULT_HERITAGE_SEARCH_PARAMS as SEARCH_PARAMS } from "@features/search/mapper/search-heritage.types";

const DEFAULT_TOP_PER_PAGE = 30;
const DEFAULT_ORDER: IdSortOption = "asc";

export default function TopPageContainer(): React.ReactElement {
  const location = useLocation();
  const navigate = useNavigate();

  const params = React.useMemo(() => {
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

  const handleChangePage = React.useCallback(
    (page: number) => {
      const searchParams = new URLSearchParams(location.search);
      searchParams.set("current_page", String(page));
      searchParams.set("per_page", String(perPage));
      searchParams.set("order", order);
      navigate(
        { pathname: "/heritages", search: `?${searchParams.toString()}` },
        { replace: false },
      );
    },
    [location.search, navigate, order, perPage],
  );

  const handleChangePerPage = React.useCallback(
    (nextPerPage: number) => {
      const searchParams = new URLSearchParams(location.search);
      searchParams.set("current_page", "1");
      searchParams.set("per_page", String(nextPerPage));
      searchParams.set("order", order);
      navigate(
        { pathname: "/heritages", search: `?${searchParams.toString()}` },
        { replace: false },
      );
    },
    [location.search, navigate, order],
  );

  const handleChangeOrder = React.useCallback(
    (nextOrder: IdSortOption) => {
      const searchParams = new URLSearchParams(location.search);
      searchParams.set("current_page", "1");
      searchParams.set("per_page", String(perPage));
      searchParams.set("order", nextOrder);
      navigate(
        { pathname: "/heritages", search: `?${searchParams.toString()}` },
        { replace: false },
      );
    },
    [location.search, navigate, perPage],
  );

  const header = <SearchHeritageFormContainer />;

  if (isLoading) {
    return (
      <>
        {header}
        <main className="p-6">
          <div>Loading…</div>
        </main>
      </>
    );
  }

  if (isError) {
    return (
      <>
        {header}
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
      header={header}
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
