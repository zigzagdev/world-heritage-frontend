import * as React from "react";
import { toWorldHeritageListVm } from "@features/heritages/mappers/to-world-heritage-vm.ts";
import type { ApiWorldHeritageDto, ListResult, WorldHeritageVm } from "../../../../domain/types";
import { fetchTopPage } from "@features/top/apis";

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

const initialFilters: Filters = {
  category: null,
  region: null,
};

const initialPagination: Pagination = {
  current_page: 1,
  per_page: 30,
  total: 0,
  last_page: 1,
};

function compareNullableNumber(a: number | null, b: number | null): number {
  if (a === null && b === null) return 0;
  if (a === null) return 1;
  if (b === null) return -1;
  return a - b;
}

export function useTopPage(args: { currentPage: number; perPage: number }) {
  const { currentPage, perPage } = args;
  const [state, setState] = React.useState<State>({
    data: [],
    pagination: initialPagination,
    loading: true,
    error: null,
  });

  const [filters, setFilters] = React.useState<Filters>(initialFilters);

  const abortRef = React.useRef<AbortController | null>(null);
  const mountedRef = React.useRef(true);

  React.useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      abortRef.current?.abort();
    };
  }, []);

  const load = React.useCallback((targetPage: number, targetPerPage: number) => {
    abortRef.current?.abort();

    const abortController = new AbortController();
    abortRef.current = abortController;

    setState((prev) => ({ ...prev, loading: true, error: null }));

    fetchTopPage({
      currentPage: targetPage,
      perPage: targetPerPage,
      signal: abortController.signal,
    })
      .then((res: ListResult<ApiWorldHeritageDto>) => {
        if (!mountedRef.current) return;

        const vmList = toWorldHeritageListVm(res.items);
        setState({ data: vmList, pagination: res.pagination, loading: false, error: null });
      })
      .catch((e: unknown) => {
        if (!mountedRef.current) return;

        if (
          typeof e === "object" &&
          e !== null &&
          "name" in e &&
          (e as { name: unknown }).name === "AbortError"
        ) {
          return;
        }

        setState((prev) => ({ ...prev, loading: false, error: e }));
      });
  }, []);

  React.useEffect(() => {
    load(currentPage, perPage);
  }, [load, currentPage, perPage]);

  const reload = React.useCallback(() => {
    load(currentPage, perPage);
  }, [load, currentPage, perPage]);

  // --- controlled filter actions ---
  const setCategory = React.useCallback((category: string | null) => {
    setFilters((f) => ({ ...f, category }));
  }, []);

  const setRegion = React.useCallback((region: string | null) => {
    setFilters((f) => ({ ...f, region }));
  }, []);

  const clearFilters = React.useCallback(() => {
    setFilters(initialFilters);
  }, []);

  const hasActiveFilters = Boolean(filters.category || filters.region);

  // --- filter options derived from already-loaded data ---
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

    return state.data.filter((it) => {
      if (category && it.category !== category) return false;
      if (region && it.region !== region) return false;
      return true;
    });
      
    return sorted;
  }, [state.data, filters, sort]);

  return {
    items,
    rawItems: state.data,

    pagination: state.pagination,
    reload,
    isLoading: state.loading,
    isError: state.error != null,
    error: state.error,
    filters,
    setCategory,
    setRegion,
    clearFilters,
    hasActiveFilters,

    // UI options
    categoryOptions,
    regionOptions,

    sort,
    setSort,
  };
}
