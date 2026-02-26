import * as React from "react";
import { toWorldHeritageListVm } from "@features/heritages/mappers/to-world-heritage-vm.ts";
import type { WorldHeritageVm } from "../../../../domain/types.ts";
import { fetchTopFirstPage } from "../apis";

type Pagination = {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
};

type State = {
  data: WorldHeritageVm[];
  pagination: Pagination;
  loading: boolean;
  error: unknown | null;
};

type Filters = {
  category: string | null;
  region: string | null;
};

type SortOption = "default" | "year_desc" | "year_asc";

const initialFilters: Filters = {
  category: null,
  region: null,
};

const DEFAULT_PER_PAGE = 50;

const initialPagination: Pagination = {
  current_page: 1,
  per_page: DEFAULT_PER_PAGE,
  total: 0,
  last_page: 1,
};

function compareNullableNumber(a: number | null, b: number | null): number {
  if (a === null && b === null) return 0;
  if (a === null) return 1;
  if (b === null) return -1;
  return a - b;
}

const isAbortError = (err: unknown): boolean => {
  if (err instanceof DOMException) return err.name === "AbortError";
  if (typeof err === "object" && err !== null && "name" in err) {
    return (err as { name?: unknown }).name === "AbortError";
  }
  return false;
};

export function useTopPage() {
  const [state, setState] = React.useState<State>({
    data: [],
    pagination: initialPagination,
    loading: true,
    error: null,
  });

  const [filters, setFilters] = React.useState<Filters>(initialFilters);
  const [sort, setSort] = React.useState<SortOption>("default");

  const [page, setPage] = React.useState<number>(1);
  const perPage = state.pagination.per_page;

  const abortRef = React.useRef<AbortController | null>(null);
  const mountedRef = React.useRef(true);

  React.useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      abortRef.current?.abort();
    };
  }, []);

  const load = React.useCallback(
    (targetPage: number) => {
      abortRef.current?.abort();

      const abortController = new AbortController();
      abortRef.current = abortController;

      setState((prev) => ({ ...prev, loading: true, error: null }));

      fetchTopFirstPage({ page: targetPage, perPage, signal: abortController.signal })
        .then((res) =>
          Promise.all([toWorldHeritageListVm(res.items), Promise.resolve(res.pagination)]),
        )
        .then(([vmList, pagination]) => {
          if (!mountedRef.current) return;
          if (abortController.signal.aborted) return;

          setState({
            data: vmList,
            pagination,
            loading: false,
            error: null,
          });
        })
        .catch((err: unknown) => {
          if (isAbortError(err)) return;
          if (!mountedRef.current) return;

          setState((prev) => ({
            ...prev,
            data: [],
            loading: false,
            error: err,
          }));
        });
    },
    [perPage],
  );

  React.useEffect(() => {
    load(page);
  }, [load, page]);

  const reload = React.useCallback(() => {
    load(page);
  }, [load, page]);

  const setCategory = React.useCallback((category: string | null) => {
    setFilters((f) => ({ ...f, category }));
    setPage(1); // ページングと合わせるならリセット必須
  }, []);

  const setRegion = React.useCallback((region: string | null) => {
    setFilters((f) => ({ ...f, region }));
    setPage(1);
  }, []);

  const clearFilters = React.useCallback(() => {
    setFilters(initialFilters);
    setPage(1);
  }, []);

  const hasActiveFilters = Boolean(filters.category || filters.region);

  const categoryOptions = React.useMemo(() => {
    const set = new Set<string>();
    for (const it of state.data) set.add(it.category);
    return Array.from(set).sort();
  }, [state.data]);

  const regionOptions = React.useMemo(() => {
    const set = new Set<string>();
    for (const it of state.data) set.add(it.region);
    return Array.from(set).sort();
  }, [state.data]);

  const items = React.useMemo(() => {
    const { category, region } = filters;

    const filtered =
      !category && !region
        ? state.data
        : state.data.filter((it) => {
            if (category && it.category !== category) return false;
            if (region && it.region !== region) return false;
            return true;
          });

    const sorted = [...filtered];

    sorted.sort((a, b) => {
      if (sort === "default") return a.id - b.id;

      const byYear =
        sort === "year_desc"
          ? b.yearInscribed - a.yearInscribed
          : a.yearInscribed - b.yearInscribed;

      if (byYear !== 0) return byYear;

      const byArea = compareNullableNumber(a.areaHectares, b.areaHectares);
      if (byArea !== 0) return byArea;

      return a.id - b.id;
    });

    return sorted;
  }, [state.data, filters, sort]);

  return {
    items,
    rawItems: state.data,

    pagination: state.pagination,
    page,
    setPage,

    reload,
    isLoading: state.loading,
    isError: state.error != null,
    error: state.error,

    filters,
    setCategory,
    setRegion,
    clearFilters,
    hasActiveFilters,
    categoryOptions,
    regionOptions,

    sort,
    setSort,
  };
}
