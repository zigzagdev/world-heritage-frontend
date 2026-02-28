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

  // --- filtered results (no refetch) ---
  const filteredItems = React.useMemo(() => {
    const { category, region } = filters;

    // micro-optimisation: no filters -> return original reference
    if (!category && !region) return state.data;

    return state.data.filter((it) => {
      if (category && it.category !== category) return false;
      if (region && it.region !== region) return false;
      return true;
    });
  }, [state.data, filters]);

  return {
    // list
    items: filteredItems,
    rawItems: state.data,

    // fetch state
    reload,
    isLoading: state.loading,
    isError: state.error != null,
    error: state.error,

    // filters (controlled)
    filters,
    setCategory,
    setRegion,
    clearFilters,
    hasActiveFilters,

    // UI options
    categoryOptions,
    regionOptions,
  };
}
