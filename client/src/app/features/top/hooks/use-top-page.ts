import * as React from "react";
import { toWorldHeritageListVm } from "@features/heritages/mappers/to-world-heritage-vm.ts";
import type {
  ApiWorldHeritageDto,
  IdSortOption,
  ListResult,
  StudyRegion,
  WorldHeritageVm,
} from "../../../../domain/types";
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
  region: StudyRegion | null;
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

export function useTopPage(args: { currentPage: number; perPage: number; order?: IdSortOption }) {
  const { currentPage, perPage, order = "asc" } = args;

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

  const load = React.useCallback(
    (targetPage: number, targetPerPage: number, targetOrder: IdSortOption) => {
      abortRef.current?.abort();

      const abortController = new AbortController();
      abortRef.current = abortController;

      setState((prev) => ({
        ...prev,
        loading: true,
        error: null,
      }));

      fetchTopPage({
        currentPage: targetPage,
        perPage: targetPerPage,
        order: targetOrder,
        signal: abortController.signal,
      })
        .then((res: ListResult<ApiWorldHeritageDto>) => {
          if (!mountedRef.current) return;
          if (abortController.signal.aborted) return;

          const vmList = toWorldHeritageListVm(res.items);

          setState({
            data: vmList,
            pagination: res.pagination,
            loading: false,
            error: null,
          });
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

          setState((prev) => ({
            ...prev,
            loading: false,
            error: e,
          }));
        });
    },
    [],
  );

  React.useEffect(() => {
    load(currentPage, perPage, order);
  }, [load, currentPage, perPage, order]);

  const reload = React.useCallback(() => {
    load(currentPage, perPage, order);
  }, [load, currentPage, perPage, order]);

  const setCategory = React.useCallback((category: string | null) => {
    setFilters((f) => ({ ...f, category }));
  }, []);

  const setRegion = React.useCallback((region: StudyRegion | null) => {
    setFilters((f) => ({ ...f, region }));
  }, []);

  const clearFilters = React.useCallback(() => {
    setFilters(initialFilters);
  }, []);

  const hasActiveFilters = Boolean(filters.category || filters.region);

  const categoryOptions = React.useMemo(() => {
    const set = new Set<string>();
    for (const it of state.data) {
      set.add(it.category);
    }
    return Array.from(set).sort();
  }, [state.data]);

  const regionOptions = React.useMemo(() => {
    const set = new Set<string>();
    for (const it of state.data) {
      set.add(it.region);
    }
    return Array.from(set).sort();
  }, [state.data]);

  const items = React.useMemo(() => {
    const { category, region } = filters;

    return !category && !region
      ? state.data
      : state.data.filter((it) => {
          if (category && it.category !== category) return false;
          if (region && it.region !== region) return false;
          return true;
        });
  }, [state.data, filters]);

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
    categoryOptions,
    regionOptions,
  };
}
