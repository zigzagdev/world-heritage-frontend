import * as React from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useFavorites } from "../hooks/use-favorites";
import { FavoriteList } from "../components/FavoriteList";
import { Spinner } from "@shared/uis/Spinner.tsx";
import { ErrorPanel } from "@shared/uis/ErrorPanel.tsx";
import { useText } from "@shared/locale/ui-text.ts";
import { FavoritesTitleBar } from "../components/FavoritesTitleBar";
import { useAuth } from "@shared/auth/AuthHooks.ts";

export function FavoritesContainer() {
  const navigate = useNavigate();
  const text = useText();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { data, reload, isLoading, error } = useFavorites();

  const handleClickItem = React.useCallback(
    (id: number) => navigate(`/heritages/${id}`),
    [navigate],
  );

  if (!user) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-12">
        <Spinner />
      </main>
    );
  }

  // お気に入りは常に自分自身のものしか取得できないため、URLのidが自分のものと
  // 異なる場合は自分の一覧に補正する(他人のidを指定しても中身が見えてしまう
  // ように誤認させない)。
  if (id !== String(user.id)) {
    return <Navigate to={`/users/${user.id}/favorite-list`} replace />;
  }

  if (isLoading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-12">
        <Spinner />
      </main>
    );
  }

  if (error) {
    const message = error instanceof Error ? error.message : text.favoritesError;

    return (
      <main className="mx-auto max-w-2xl px-4 py-12">
        <ErrorPanel message={message} onRetry={reload} />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-12">
      <FavoritesTitleBar />
      <div className="pt-8">
        <FavoriteList items={data} onClickItem={handleClickItem} />
      </div>
    </main>
  );
}
