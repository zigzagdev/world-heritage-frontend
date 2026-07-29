import React, { createContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { getCurrentUser } from "@features/auth/apis";
import type { ApiCurrentUserDto } from "@features/auth/apis/auth-api.ts";
import { getStoredToken, clearStoredToken } from "./token-storage.ts";

export type AuthUser = ApiCurrentUserDto;

const isAbortError = (e: unknown): boolean => {
  return e instanceof DOMException && e.name === "AbortError";
};

const AuthContext = createContext<
  | {
      user: AuthUser | null;
      isLoading: boolean;
      setUser: (user: AuthUser | null) => void;
    }
  | undefined
>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      setLoading(false);
      return;
    }

    const abortController = new AbortController();

    getCurrentUser(token, { signal: abortController.signal })
      .then((current) => {
        setUser(current);
        if (!current) clearStoredToken();
      })
      .catch((e) => {
        if (!isAbortError(e)) setUser(null);
      })
      .finally(() => {
        if (!abortController.signal.aborted) setLoading(false);
      });

    return () => abortController.abort();
  }, []);

  const value = useMemo(() => ({ user, isLoading, setUser }), [user, isLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
