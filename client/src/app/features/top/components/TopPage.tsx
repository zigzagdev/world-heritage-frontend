export type Item = {
  id: number;
  title: string;
  subtitle: string;
  category: string;
  year: number;
  areaText: string;
  bufferText: string;
  thumbnail?: string;
};

export type TopPageProps = {
  items: ReadonlyArray<Item>;
  onReload?: () => void;
  onClickItem?: (id: number) => void;
};

import { HeritageCard } from "../cards/HeritageCard";
import { Button } from "@shared/uis/Button.tsx";

export default function TopPage({ items, onReload, onClickItem }: TopPageProps) {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          World Heritage
        </h1>

        {onReload && (
          <Button variant="secondary" size="sm" onClick={onReload} aria-label="Reload list">
            Reload
          </Button>
        )}
      </header>

      {items.length === 0 ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">No sites yet.</p>
      ) : (
        <ul className="m-0 grid list-none gap-6 p-0 md:grid-cols-2 lg:grid-cols-3 [&>li]:m-0 [&>li]:list-none">
          {items.map((it) => (
            <HeritageCard key={it.id} item={it} onClickItem={onClickItem} />
          ))}
        </ul>
      )}
    </main>
  );
}
