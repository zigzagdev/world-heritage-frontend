import type { WorldHeritageVm } from "../types";
import { HeritageCard } from "../cards/HeritageCard";
import { Button } from "@shared/uis/Button.tsx";

export type SortOption = "default" | "year_desc" | "year_asc";

export type TopPageProps = {
  items: ReadonlyArray<WorldHeritageVm>;
  onClickItem?: (id: number) => void;
  onReload?: () => void;
  onSearch?: (keyword: string) => void;
  sortOption?: SortOption;
  onChangeSort?: (option: SortOption) => void;
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

function SortSelect({
  value = "default",
  onChange,
}: {
  value?: SortOption;
  onChange?: (v: SortOption) => void;
}) {
  return (
    <div className="flex items-center justify-end gap-2">
      <select
        value={value}
        onChange={(e) => onChange?.(e.target.value as SortOption)}
        className="rounded-full border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-700
                   shadow-sm hover:bg-zinc-50
                   dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-900"
      >
        <option value="default">Default</option>
        <option value="year_desc">Year (new → old)</option>
        <option value="year_asc">Year (old → new)</option>
      </select>
    </div>
  );
}

export default function TopPage({
  items,
  onClickItem,
  onReload,
  sortOption,
  onChangeSort,
}: TopPageProps) {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12">
      <div className="sticky top-0 z-20 -mx-4 px-4 pb-4 pt-4 bg-white/95 backdrop-blur border-b border-zinc-200/70">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
          <div className="min-w-0">
            <h1 className="text-3xl font-extrabold tracking-tight text-indigo-700 dark:text-indigo-400">
              World Heritage
            </h1>
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
              Learn by searching and comparing sites.
            </p>
          </div>
          <div className="md:flex-1">
            <div className="relative">
              <input
                type="text"
                disabled
                aria-disabled="true"
                placeholder="Search sites…"
                className="w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-sm
                text-zinc-800 placeholder:text-zinc-400
                shadow-sm
                disabled:bg-zinc-100 disabled:text-zinc-600 disabled:border-zinc-200 disabled:cursor-not-allowed
                dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:disabled:bg-zinc-900"
              />
              <div className="mt-1 text-[11px] font-medium text-zinc-600 dark:text-zinc-400">
                Search (Algolia) coming soon
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 md:justify-end">
            <Button
              disabled
              size="sm"
              className=" rounded-full disabled:opacity-100 disabled:bg-zinc-100 disabled:text-zinc-700
              disabled:border disabled:border-zinc-200 dark:disabled:bg-zinc-900
              dark:disabled:text-zinc-300 dark:disabled:border-zinc-700"
            >
              Filters
            </Button>

            {onReload && (
              <button
                type="button"
                onClick={onReload}
                className="text-xs font-semibold text-zinc-700 hover:text-zinc-900 hover:underline
                 dark:text-zinc-300 dark:hover:text-zinc-100"
              >
                Reload
              </button>
            )}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch]">
          <Chip label="Category" disabled />
          <Chip label="Region" disabled />
          <Chip label="Country" disabled />
          <Chip label="Endangered" disabled />
        </div>
        <div className="mt-3">
          <SortSelect value={sortOption} onChange={onChangeSort} />
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
