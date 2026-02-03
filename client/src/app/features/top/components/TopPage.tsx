import type { WorldHeritageVm } from "../types";
import { HeritageCard } from "../cards/HeritageCard";
import { Button } from "@shared/uis/Button.tsx";

export type TopPageProps = {
  items: ReadonlyArray<WorldHeritageVm>;
  onSearch?: (keyword: string) => void;
  onClickItem?: (id: number) => void;
};

export default function TopPage({ items, onSearch, onClickItem }: TopPageProps) {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <header className="mb-10 flex flex-col items-end justify-between border-b border-zinc-100 pb-8 sm:flex-row">
        <div className="w-full space-y-1 text-left">
          <h1 className="text-4xl font-black tracking-tighter text-indigo-700">World Heritage</h1>
          <p className="text-sm font-medium text-zinc-500">Explore the wonders of the world.</p>
        </div>

        <div className="flex w-full items-center gap-3 sm:w-[380px]">
          <div className="relative flex flex-1 items-center">
            <input
              type="search"
              disabled
              placeholder="Search sites..."
              className="
        w-full rounded-full border border-zinc-200 bg-zinc-50 py-2 px-4 text-sm
        transition-all focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500
        disabled:cursor-not-allowed disabled:opacity-50
      "
            />
          </div>
          <Button
            size="sm"
            disabled
            className="rounded-full bg-indigo-700 px-5 font-bold text-white transition-colors hover:bg-indigo-800 disabled:bg-zinc-200"
            onClick={() => onSearch?.("")}
          >
            Search
          </Button>
        </div>
      </header>

      {/* Block: ContentGrid */}
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
