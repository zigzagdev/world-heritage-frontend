import React, { useMemo } from "react";
import TopPage from "./app/features/top/components/TopPage";
import { useTopPage } from "./app/features/top/hooks/use-top-page";
import type { WorldHeritageVm } from "./app/features/top/types";

type Item = {
  id: number;
  title: string;
  subtitle: string;
  category: string;
  year: number;
  areaText: string;
  bufferText: string;
  thumbnail?: string;
};

function vmToItem(vm: WorldHeritageVm): Item {
  return {
    id: vm.id,
    title: vm.title,
    subtitle: vm.subtitle,
    category: vm.category,
    year: vm.yearInscribed,
    areaText: vm.areaText,
    bufferText: vm.bufferText,
    thumbnail: vm.thumbnail,
  };
}

export default function App(): React.ReactElement {
  const { items, reload, isLoading, isError, error } = useTopPage();

  const uiItems = useMemo(() => items.map(vmToItem), [items]);

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
