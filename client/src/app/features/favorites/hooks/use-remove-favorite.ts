import { useCallback, useEffect, useRef, useState } from "react";
import { removeFavorite } from "../apis";
import { getStoredToken } from "@shared/auth/token-storage.ts";

const isAbortError = (element: unknown): boolean => {
  return element instanceof DOMException && element.name === "AbortError";
};

export function useRemoveFavorite() {
  const [isRemoved, setIsRemoved] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  const submit = useCallback(async (worldHeritageId: number): Promise<boolean> => {
    abortRef.current?.abort();
    const abortController = new AbortController();
    abortRef.current = abortController;

    setLoading(true);
    setError(null);

    try {
      const token = getStoredToken();
      if (!token) {
        throw new Error("Not authenticated");
      }

      await removeFavorite(worldHeritageId, token, {
        signal: abortController.signal,
      });
      setIsRemoved(true);
      return true;
    } catch (element) {
      if (!isAbortError(element)) setError(element);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { submit, isRemoved, isLoading, error };
}
