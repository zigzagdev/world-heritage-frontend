import { useCallback, useEffect, useRef, useState } from "react";
import { addFavorite } from "../apis";
import { getStoredToken } from "@shared/auth/token-storage.ts";

const isAbortError = (e: unknown): boolean => {
  return e instanceof DOMException && e.name === "AbortError";
};

export function useAddFavorite() {
  const [isAdded, setIsAdded] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  const submit = useCallback(async (worldHeritageId: number) => {
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

      await addFavorite({ world_heritage_id: worldHeritageId }, token, {
        signal: abortController.signal,
      });
      setIsAdded(true);
    } catch (e) {
      if (!isAbortError(e)) setError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  return { submit, isAdded, isLoading, error };
}
