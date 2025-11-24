import * as React from "react";
import { toWorldHeritageVm } from "../mappers/to-world-heritage-vm";
import type { WorldHeritageVm } from "../types";
import { fetchWorldHeritageDetail } from "../apis";

type State = {
  data: WorldHeritageVm | null;
  loading: boolean;
  error: unknown | null;
};

export function useWorldHeritageDetail(id: string | null | undefined) {
  const [state, setState] = React.useState<State>({
    data: null,
    loading: true,
    error: null,
  });

  const abortRef = React.useRef<AbortController | null>(null);

  const load = React.useCallback(() => {
    if (!id) {
      setState((s) => ({
        ...s,
        loading: false,
        error: new Error("World heritage id is required"),
      }));
      return;
    }

    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    setState((s) => ({ ...s, loading: true, error: null }));

    fetchWorldHeritageDetail(id, { signal: ac.signal })
      .then((dto) => toWorldHeritageVm(dto))
      .then((vm) => {
        setState({ data: vm, loading: false, error: null });
      })
      .catch((err: unknown) => {
        if ((err as { name?: string }).name === "AbortError") return;
        setState({ data: null, loading: false, error: err });
      });
  }, [id]);

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
    item: state.data,
    reload,
    isLoading: state.loading,
    isError: state.error != null,
    error: state.error,
  };
}
