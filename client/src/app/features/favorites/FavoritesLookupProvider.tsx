import React, { createContext, useMemo } from "react";
import type { ReactNode } from "react";
import { useAuth } from "@shared/auth/AuthHooks.ts";
import { useIsFavorited } from "./hooks/use-is-favorited";

type FavoritesLookupContextValue = {
  isFavorited: (heritageId: number) => boolean;
  isLoading: boolean;
  error: unknown;
};

const FavoritesLookupContext = createContext<FavoritesLookupContextValue | undefined>(undefined);

function FavoritesLookupInner({ children }: { children: ReactNode }) {
  const { isFavorited, isLoading, error } = useIsFavorited();

  const value = useMemo(() => ({ isFavorited, isLoading, error }), [isFavorited, isLoading, error]);

  return (
    <FavoritesLookupContext.Provider value={value}>{children}</FavoritesLookupContext.Provider>
  );
}

// GET /api/v1/favorites を一覧ページのカード枚数分バラバラに叩かないよう、
// 取得は最上位でこのProviderが1回だけ行い、各カードは共有のlookupを参照する。
export const FavoritesLookupProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  // keyでuser切り替え時にuseIsFavoritedを再マウントし、ログイン/ログアウトを反映する。
  return <FavoritesLookupInner key={user?.id ?? "anonymous"}>{children}</FavoritesLookupInner>;
};

export default FavoritesLookupContext;
