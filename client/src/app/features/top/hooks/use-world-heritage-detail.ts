import * as React from "react";
import { toWorldHeritageDetailVm } from "@features/heritages/mappers/to-world-heritage-detail-vm";
import type { WorldHeritageDetailVm } from "../../../../domain/types.ts";
import { fetchWorldHeritageDetail } from "../apis";

type State = {
  data: WorldHeritageDetailVm | null;
  loading: boolean;
  error: unknown | null;
};

export function useWorldHeritageDetail(id: string | null | undefined) {
  const [state, setState] = React.useState<State>({
    data: null,
    loading: false,
    error: null,
  });

  const abortRef = React.useRef<AbortController | null>(null);
  const load = React.useCallback(() => {
    if (!id) {
      setState({ data: null, loading: false, error: null });
      return;
    }

    abortRef.current?.abort();
    const Aborting = new AbortController();
    abortRef.current = Aborting;

    setState((s) => ({ ...s, loading: true, error: null }));

    fetchWorldHeritageDetail(id, { signal: Aborting.signal })
      .then(toWorldHeritageDetailVm)
      .then((vm) => setState({ data: vm, loading: false, error: null }))
      .catch((err: unknown) => {
        if ((err as { name?: string }).name === "AbortError") return;
        setState({ data: null, loading: false, error: err });
      });
  }, [id]);

  React.useEffect(() => {
    if (!id) return;
    load();
    return () => abortRef.current?.abort();
  }, [id, load]);

  return {
    item: state.data,
    reload: load,
    isLoading: state.loading,
    isError: state.error != null,
    error: state.error,
  };
}
