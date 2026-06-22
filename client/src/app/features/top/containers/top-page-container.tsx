import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TopPage from "../components/TopPage";
import { useTopPage } from "../hooks/use-top-page";
import { SearchHeritageFormContainer } from "@features/search/containers/search-heritage-form-container";
import { TopPageTitleBar } from "../components/TopPageTitleBar";
import { TopPageHero } from "../components/TopPageHero";
import { HeritageList } from "../components/HeritageList";
import { TopPagePagination } from "../components/TopPagePagination";
import type { IdSortOption } from "../../../../domain/types";
import { parseHeritageSearchParams } from "@features/search/mapper/search-heritages.params";
import { DEFAULT_HERITAGE_SEARCH_PARAMS as SEARCH_PARAMS } from "@features/search/mapper/search-heritage.types";
import { Spinner } from "@shared/uis/Spinner.tsx";

const DEFAULT_TOP_PER_PAGE = 30;
const DEFAULT_ORDER: IdSortOption = "asc";
const PER_PAGE_OPTIONS = [10, 30, 50, 70] as const;

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
          <Spinner />
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
      hero={<TopPageHero />}
      titleBar={
        <TopPageTitleBar order={order} onChangeOrder={handleChangeOrder} onReload={reload} />
      }
      header={header}
      content={<HeritageList items={items} onClickItem={handleClickItem} />}
      pagination={
        <TopPagePagination
          currentPage={currentPage}
          perPage={perPage}
          lastPage={pagination.last_page}
          onChangePage={handleChangePage}
          onChangePerPage={handleChangePerPage}
          perPageOptions={PER_PAGE_OPTIONS}
          disabled={isLoading}
        />
      }
    />
  );
}
