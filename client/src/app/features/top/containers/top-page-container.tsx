import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { WorldHeritageVm } from "../types";
import { fetchTopFirstPage } from "../apis";
import { toWorldHeritageListVm } from "../mappers/to-world-heritage-vm";
import TopPage from "../components/TopPage";

export default function TopPageContainer(): React.ReactElement {
  const [items, setItems] = useState<WorldHeritageVm[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown | null>(null);
  const [reloadTick, setReloadTick] = useState<number>(0);
  const abortRef = useRef<AbortController | null>(null);
  const navigate = useNavigate();
  const load = useCallback(() => {
    abortRef.current?.abort();
    const Aborting = new AbortController();
    abortRef.current = Aborting;

    setIsLoading(true);
    setError(null);

    fetchTopFirstPage({ signal: Aborting.signal })
      .then(toWorldHeritageListVm)
      .then((vmList) => {
        setItems(vmList);
      })
      .catch((err: unknown) => {
        if ((err as { name?: string }).name === "AbortError") return;
        setItems([]);
        setError(err);
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    load();
    return () => abortRef.current?.abort();
  }, [load, reloadTick]);

  const handleReload = useCallback(() => {
    setReloadTick((n) => n + 1);
  }, []);

  const handleClickItem = useCallback(
    (id: number) => {
      navigate(`/heritages/${id}`);
    },
    [navigate],
  );

  const handleSearch = useCallback(() => {
    console.log("Search is currently disabled.");
  }, []);

  if (isLoading) {
    return (
      <main className="p-6">
        <div>Loading…</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="p-6 space-y-3">
        <div className="text-red-700">Failed to load.</div>
        <button type="button" onClick={handleReload} className="underline">
          Retry
        </button>
      </main>
    );
  }

  return (
    <TopPage
      items={items}
      onClickItem={handleClickItem}
      onReload={handleReload}
      onSearch={handleSearch}
    />
  );
}
