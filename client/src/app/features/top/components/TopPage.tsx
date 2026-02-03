import type { WorldHeritageVm } from "../types";
import { HeritageCard } from "../cards/HeritageCard";
import { Button } from "@shared/uis/Button.tsx";

export type TopPageProps = {
  items: ReadonlyArray<WorldHeritageVm>;
  onClickItem?: (id: number) => void;
  onReload?: () => void;
  onSearch?: (keyword: string) => void;
};

export default function TopPage({ items, onClickItem, onReload, onSearch }: TopPageProps) {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12">
      <header className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold tracking-tight text-indigo-700 dark:text-indigo-400">
            World Heritage
          </h1>
          <p className="text-lg text-zinc-500 dark:text-zinc-400">
            Explore the wonders of the world.
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="flex w-full max-w-sm items-center gap-2">
            <div className="relative w-full">
              <input
                type="text"
                disabled
                placeholder="Search sites..."
                className="w-full rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm text-zinc-400 cursor-not-allowed dark:border-zinc-800 dark:bg-zinc-900"
              />
              <span className="absolute -bottom-5 right-2 text-[10px] text-zinc-400">
                Search coming soon
              </span>
            </div>
            <Button
              disabled
              size="sm"
              className="rounded-full opacity-50"
              onClick={() => onSearch?.("")}
            >
              Search
            </Button>
          </div>

          {onReload && (
            <button
              onClick={onReload}
              className="mt-4 text-xs font-medium text-zinc-400 hover:text-zinc-600 hover:underline dark:hover:text-zinc-200"
            >
              Reload data
            </button>
          )}
        </div>
      </header>

      {items.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-sm text-zinc-500">No sites found.</p>
        </div>
      ) : (
        <ul className="grid list-none grid-cols-1 gap-8 p-0 md:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => (
            <li key={it.id} className="list-none">
              <HeritageCard item={it} onClickItem={onClickItem} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
