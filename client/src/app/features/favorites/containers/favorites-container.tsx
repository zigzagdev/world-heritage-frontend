import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useFavorites } from "../hooks/use-favorites";
import { HeritageList } from "@features/top/components/HeritageList.tsx";
import { Spinner } from "@shared/uis/Spinner.tsx";
import { ErrorPanel } from "@shared/uis/ErrorPanel.tsx";
import { useText } from "@shared/locale/ui-text.ts";

export function FavoritesContainer() {
  const navigate = useNavigate();
  const text = useText();
  const { data, reload, isLoading, error } = useFavorites();

  const handleClickItem = React.useCallback(
    (id: number) => navigate(`/heritages/${id}`),
    [navigate],
  );

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
    <main className="mx-auto max-w-7xl px-4 py-8">
      <HeritageList items={data} onClickItem={handleClickItem} />
    </main>
  );
}
