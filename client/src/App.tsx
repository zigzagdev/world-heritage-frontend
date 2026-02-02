import React from "react";
import TopPage from "@features/top/components/TopPage";
import { useTopPage } from "@features/top/hooks/use-top-page";

export default function App(): React.ReactElement {
  const { items, reload, isLoading, isError, error } = useTopPage();

  const uiItems = items.length ? [...items] : items;

  if (isLoading) {
    return <main className="p-6">Loading…</main>;
  }
  if (isError) {
    return (
      <main className="p-6 space-y-3">
        <div className="text-red-700">Failed to load.</div>
        <pre className="text-xs opacity-70">{String(error)}</pre>
        <button type="button" onClick={reload} className="underline">
          Retry
        </button>
      </main>
    );
  }

  return (
    <TopPage items={uiItems} onReload={reload} onClickItem={(id) => console.log("clicked", id)} />
  );
}
