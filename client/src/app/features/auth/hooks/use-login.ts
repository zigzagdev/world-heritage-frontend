import { useCallback, useEffect, useRef, useState } from "react";
import { login, getCurrentUser } from "../apis";
import { toLoginRequest } from "../mapper/to-login-request";
import { setStoredToken } from "@shared/auth/token-storage.ts";
import { useAuth } from "@shared/auth/AuthHooks.ts";
import type { LoginFormValues } from "../types";

const isAbortError = (e: unknown): boolean => {
  return e instanceof DOMException && e.name === "AbortError";
};

export function useLogin() {
  const { setUser } = useAuth();
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  const submit = useCallback(
    async (values: LoginFormValues): Promise<boolean> => {
      abortRef.current?.abort();
      const abortController = new AbortController();
      abortRef.current = abortController;

      setLoading(true);
      setError(null);

      try {
        const init = { signal: abortController.signal };
        const { token } = await login(toLoginRequest(values), init);
        setStoredToken(token);
        const user = await getCurrentUser(token, init);
        setUser(user);
        return true;
      } catch (e) {
        if (!isAbortError(e)) setError(e);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [setUser],
  );

  return { submit, isLoading, error };
}
