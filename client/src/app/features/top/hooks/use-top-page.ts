import * as React from "react";
import { toWorldHeritageListVm } from "../mappers/to-world-heritage-vm";
import type { WorldHeritageVm } from "../types";
import { fetchTopFirstPage } from "../apis";

type State = {
  data: WorldHeritageVm[];
  loading: boolean;
  error: unknown | null;
};

export function useTopPage() {
  const [state, setState] = React.useState<State>({
    data: [],
    loading: true,
    error: null,
  });

  const abortRef = React.useRef<AbortController | null>(null);

  const load = React.useCallback(() => {
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    setState((s) => ({ ...s, loading: true, error: null }));

    fetchTopFirstPage({ signal: ac.signal })
      .then((dtoList) => toWorldHeritageListVm(dtoList))
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

  return {
    items: state.data,
    reload,
    isLoading: state.loading,
    isError: state.error != null,
    error: state.error,
  };
}
