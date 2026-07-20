import { useCallback, useEffect, useRef, useState } from "react";
import { logout } from "../apis";
import { getStoredToken, clearStoredToken } from "@shared/auth/token-storage.ts";
import { useAuth } from "@shared/auth/AuthHooks.ts";

const isAbortError = (e: unknown): boolean => {
  return e instanceof DOMException && e.name === "AbortError";
};

export function useLogout() {
  const { setUser } = useAuth();
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  const submit = useCallback(async (): Promise<boolean> => {
    abortRef.current?.abort();
    const abortController = new AbortController();
    abortRef.current = abortController;

    setLoading(true);
    setError(null);

    try {
      const token = getStoredToken();
      if (token) {
        await logout(token, { signal: abortController.signal });
      }
      clearStoredToken();
      setUser(null);
      return true;
    } catch (e) {
      if (!isAbortError(e)) setError(e);
      return false;
    } finally {
      setLoading(false);
    }
  }, [setUser]);

  return { submit, isLoading, error };
}