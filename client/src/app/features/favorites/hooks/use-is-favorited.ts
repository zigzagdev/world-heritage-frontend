import { useCallback, useEffect, useRef, useState } from "react";
import { getFavorites } from "../apis";
import { toFavoriteIdLookup, type FavoriteIdLookup } from "../mappers/to-favorite-id-lookup";
import { getStoredToken } from "@shared/auth/token-storage.ts";

const isAbortError = (element: unknown): boolean => {
  return element instanceof DOMException && element.name === "AbortError";
};

export function useIsFavorited() {
  const [lookup, setLookup] = useState<FavoriteIdLookup>({});
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const abortController = new AbortController();
    abortRef.current = abortController;

    setLoading(true);
    setError(null);

    const token = getStoredToken();
    if (!token) {
      setLookup({});
      setLoading(false);
      return () => abortController.abort();
    }

    getFavorites(token, { signal: abortController.signal })
      .then((dtos) => setLookup(toFavoriteIdLookup(dtos)))
      .catch((element) => {
        if (!isAbortError(element)) setError(element);
      })
      .finally(() => setLoading(false));

    return () => abortController.abort();
  }, []);

  const isFavorited = useCallback((heritageId: number) => Boolean(lookup[heritageId]), [lookup]);

  return { isFavorited, isLoading, error };
}
