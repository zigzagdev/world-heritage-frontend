import { useCallback, useEffect, useRef, useState } from "react";
import { getFavorites } from "../apis";
import { toWorldHeritageListVm } from "@features/heritages/mappers/to-world-heritage-vm.ts";
import { useLocale } from "@shared/locale/LocaleHooks.ts";
import { getStoredToken } from "@shared/auth/token-storage.ts";
import type { WorldHeritageVm } from "../../../../domain/types.ts";

const isAbortError = (element: unknown): boolean => {
  return element instanceof DOMException && element.name === "AbortError";
};

export function useFavorites() {
  const { locale } = useLocale();
  const [data, setData] = useState<WorldHeritageVm[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const abortRef = useRef<AbortController | null>(null);

  const load = useCallback(() => {
    abortRef.current?.abort();
    const abortController = new AbortController();
    abortRef.current = abortController;

    setLoading(true);
    setError(null);

    const token = getStoredToken();
    if (!token) {
      setData([]);
      setLoading(false);
      return;
    }

    getFavorites(token, { signal: abortController.signal })
      .then((dtos) => setData(toWorldHeritageListVm(dtos, locale)))
      .catch((element) => {
        if (!isAbortError(element)) setError(element);
      })
      .finally(() => setLoading(false));
  }, [locale]);

  useEffect(() => {
    load();
    return () => abortRef.current?.abort();
  }, [load]);

  return { data, reload: load, isLoading, error };
}
