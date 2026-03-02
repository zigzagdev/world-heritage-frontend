import * as React from "react";
import { toWorldHeritageDetailVm } from "@features/heritages/mappers/to-world-heritage-detail-vm";
import type { WorldHeritageDetailVm } from "../../../../domain/types.ts";
import { fetchWorldHeritageDetail } from "../apis";

type State = {
  data: WorldHeritageDetailVm | null;
  loading: boolean;
  error: unknown | null;
};

function isAbortError(err: unknown): boolean {
  if (typeof err !== "object" || err === null) return false;
  const e = err as { name?: unknown; message?: unknown };
  return e.name === "AbortError" || e.message === "The user aborted a request.";
}

export function useWorldHeritageDetail(id: string | null | undefined) {
  const [state, setState] = React.useState<State>({
    data: null,
    loading: false,
    error: null,
  });

  const abortRef = React.useRef<AbortController | null>(null);
  const reqIdRef = React.useRef(0);

  const load = React.useCallback(() => {
    if (!id) {
      abortRef.current?.abort();
      abortRef.current = null;
      setState({ data: null, loading: false, error: null });
      return;
    }

    // increment request ID for each load to identify the latest request
    reqIdRef.current += 1;
    const reqId = reqIdRef.current;

    // former request is still in-flight, abort it
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setState((s) => ({ ...s, loading: true, error: null }));

    fetchWorldHeritageDetail(id, { signal: controller.signal })
      .then(toWorldHeritageDetailVm)
      .then((vm) => {
        // prepare for the next request
        if (reqId !== reqIdRef.current) return;
        setState({ data: vm, loading: false, error: null });
      })
      .catch((err: unknown) => {
        if (isAbortError(err)) return;
        if (reqId !== reqIdRef.current) return;
        setState({ data: null, loading: false, error: err });
      });
  }, [id]);

  React.useEffect(() => {
    load();
    return () => {
      abortRef.current?.abort();
    };
  }, [load]);

  return {
    item: state.data,
    reload: load,
    isLoading: state.loading,
    isError: state.error != null,
    error: state.error,
  };
}
