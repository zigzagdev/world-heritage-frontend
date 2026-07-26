import { useCallback, useEffect, useRef, useState } from "react";
import { deleteUser } from "../apis";

const isAbortError = (element: unknown): boolean => {
  return element instanceof DOMException && element.name === "AbortError";
};

export function useDeleteUser() {
  const [done, setDone] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  const submit = useCallback(async (id: number) => {
    abortRef.current?.abort();
    const abortController = new AbortController();
    abortRef.current = abortController;

    setLoading(true);
    setError(null);

    try {
      await deleteUser(id, { signal: abortController.signal });
      setDone(true);
    } catch (error) {
      if (!isAbortError(error)) setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { submit, done, isLoading, error };
}
