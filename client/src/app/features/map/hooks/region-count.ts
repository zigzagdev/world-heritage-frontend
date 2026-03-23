import { useState, useEffect } from "react";
import { fetchRegionCount } from "../apis";
import type { RegionCount } from "../../../../domain/types.ts";

type State = {
  data: RegionCount[];
  isLoading: boolean;
  error: Error | null;
};

export function useRegionCount() {
  // define the initial state with an empty data.
  const [state, setState] = useState<State>({
    data: [],
    isLoading: true,
    error: null,
  });

  // fetch the region count data when the component mounts.
  useEffect(() => {
    const abortController = new AbortController();

    fetchRegionCount({ signal: abortController.signal })
      .then((data) => {
        setState({ data, isLoading: false, error: null });
      })
      .catch((error) => {
        if (error.name === "AbortError") return;
        setState({ data: [], isLoading: false, error });
      });

    return () => abortController.abort();
  }, []);

  return state;
}
