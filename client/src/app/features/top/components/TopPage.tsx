import { useMemo } from "react";
import type { WorldHeritageVm } from "../types";
import { HeritageCard } from "../cards/HeritageCard";
import { Button } from "@shared/uis/Button.tsx";

export type TopPageProps = {
  items: ReadonlyArray<WorldHeritageVm>;
  onClickItem?: (id: number) => void;
  onReload?: () => void;
  onSearch?: (keyword: string) => void;
};

type FilterChip = {
  key: string;
  label: string;
};

function Chip({ label, disabled = true }: { label: string; disabled?: boolean }) {
  return (
    <button
      type="button"
      disabled={disabled}
      aria-disabled={disabled}
      className={[
        "shrink-0 rounded-full border px-3 py-1 text-xs font-medium",
        "border-zinc-200 bg-white text-zinc-600",
        disabled ? "opacity-60 cursor-not-allowed" : "hover:bg-zinc-50 dark:hover:bg-zinc-900",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

export default function TopPage({ items, onClickItem, onReload, onSearch }: TopPageProps) {
  const filterChips: FilterChip[] = useMemo(
    () => [
      { key: "category", label: "Category" },
      { key: "region", label: "Region" },
      { key: "country", label: "Country" },
      { key: "endangered", label: "Endangered" },
      { key: "year", label: "Year" },
      { key: "criteria", label: "Criteria" },
      { key: "area", label: "Area" },
      { key: "buffer", label: "Buffer Zone" },
    ],
    [],
  );

  return (
    <main className="mx-auto max-w-7xl px-4 py-12">
      <div className="sticky top-0 z-20 -mx-4 px-4 pb-4 pt-6 bg-white/95 backdrop-blur border-b border-zinc-200/70">
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-1">
            <h1 className="text-4xl font-extrabold tracking-tight text-indigo-700 dark:text-indigo-400">
              World Heritage
            </h1>
            <p className="text-lg text-zinc-700 dark:text-zinc-300">
              Explore the wonders of the world.
            </p>
          </div>

          {onReload && (
            <button
              type="button"
              onClick={onReload}
              className="text-xs font-semibold text-zinc-700 hover:text-zinc-900 hover:underline dark:text-zinc-300 dark:hover:text-zinc-100"
            >
              Reload data
            </button>
          )}
        </header>

        <div className="mt-6 space-y-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative w-full sm:max-w-xl">
              <input
                type="text"
                disabled
                aria-disabled="true"
                aria-describedby="search-help"
                placeholder="Search sites..."
                className="
            w-full rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm
            text-zinc-700 placeholder:text-zinc-400
            disabled:bg-zinc-100 disabled:text-zinc-600 disabled:border-zinc-200 disabled:cursor-not-allowed"
              />
              <p
                id="search-help"
                className="mt-1 text-[11px] font-medium text-zinc-600 dark:text-zinc-400"
              >
                Search coming soon
              </p>
            </div>

            <div className="flex items-center gap-2 sm:ml-auto">
              <Button
                disabled
                size="sm"
                className="
            rounded-full
            disabled:opacity-100 disabled:bg-zinc-100 disabled:text-zinc-600 disabled:border disabled:border-zinc-200
            dark:disabled:bg-zinc-900 dark:disabled:text-zinc-300 dark:disabled:border-zinc-700
          "
                onClick={() => onSearch?.("")}
              >
                Search
              </Button>
              <Button
                disabled
                size="sm"
                className="
            rounded-full
            disabled:opacity-100 disabled:bg-zinc-100 disabled:text-zinc-600 disabled:border disabled:border-zinc-200
            dark:disabled:bg-zinc-900 dark:disabled:text-zinc-300 dark:disabled:border-zinc-700
          "
              >
                Filters
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex w-full items-center gap-2 overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch]">
              {filterChips.map((c) => (
                <Chip key={c.key} label={c.label} disabled />
              ))}
            </div>

            <div className="hidden md:block">
              <Button
                disabled
                size="sm"
                className="
            rounded-full
            disabled:opacity-100 disabled:bg-zinc-100 disabled:text-zinc-600 disabled:border disabled:border-zinc-200
            dark:disabled:bg-zinc-900 dark:disabled:text-zinc-300 dark:disabled:border-zinc-700
          "
              >
                Clear
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="pt-8">
        {items.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-sm text-zinc-500">No sites found.</p>
          </div>
        ) : (
          <ul className="grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-2 lg:grid-cols-3">
            {items.map((it) => (
              <li key={it.id} className="list-none">
                <HeritageCard item={it} onClickItem={onClickItem} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
