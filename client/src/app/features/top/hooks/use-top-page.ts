import * as React from "react";
import { toWorldHeritageListVm } from "../mappers/to-world-heritage-vm.ts";
import type { WorldHeritageVm } from "../types.ts";
import { fetchTopFirstPage } from "../apis";

type State = {
  data: WorldHeritageVm[];
  loading: boolean;
  error: unknown | null;
};

type Filters = {
  category: string | null;
  region: string | null;
};

type SortOption = "default" | "year_asc" | "year_desc";

const initialFilters: Filters = {
  category: null,
  region: null,
};

export function useTopPage() {
  const [state, setState] = React.useState<State>({
    data: [],
    loading: true,
    error: null,
  });

  const [filters, setFilters] = React.useState<Filters>(initialFilters);
  const [sort, setSort] = React.useState<SortOption>("default");

  const abortRef = React.useRef<AbortController | null>(null);

  const load = React.useCallback(() => {
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    setState((s) => ({ ...s, loading: true, error: null }));

    fetchTopFirstPage({ signal: ac.signal })
      .then(toWorldHeritageListVm)
      .then((vmList) => {
        setState({ data: vmList, loading: false, error: null });
      })
      .catch((err: unknown) => {
        if ((err as { name?: string }).name === "AbortError") return;
        setState({ data: [], loading: false, error: err });
      });
  }, []);

  React.useEffect(() => {
    load();
    return () => {
      abortRef.current?.abort();
    };
  }, [load]);

  const reload = React.useCallback(() => {
    load();
  }, [load]);

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

  const categoryOptions = React.useMemo(() => {
    const set = new Set<string>();
    for (const it of state.data) {
      if (it.category) set.add(it.category);
    }
    return Array.from(set).sort();
  }, [state.data]);

  const regionOptions = React.useMemo(() => {
    const set = new Set<string>();
    for (const it of state.data) {
      if (it.region) set.add(it.region);
    }
    return Array.from(set).sort();
  }, [state.data]);

  const filteredItems = React.useMemo(() => {
    const { category, region } = filters;

    const filtered =
      !category && !region
        ? state.data
        : state.data.filter((it) => {
            if (category && it.category !== category) return false;
            if (region && it.region !== region) return false;
            return true;
          });

    return [...filtered].sort((a, b) => {
      if (sort === "default") return a.id - b.id;

      const d =
        sort === "year_desc"
          ? b.yearInscribed - a.yearInscribed
          : a.yearInscribed - b.yearInscribed;

      if (d !== 0) return d;

      return a.id - b.id;
    });
  }, [state.data, filters, sort]);

  return {
    items: filteredItems,
    rawItems: state.data,
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
