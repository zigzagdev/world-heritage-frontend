import { useMemo, useState } from "react";
import type { WorldHeritageVm } from "../types";
import { HeritageCard } from "../cards/HeritageCard";
import { Button } from "@shared/uis/Button.tsx";

export type SortOption = "default" | "year_desc" | "year_asc";

export type SearchQuery = {
  region?: string;
  category?: string;
  keyword?: string;
};

export type TopPageProps = {
  items: ReadonlyArray<WorldHeritageVm>;
  onClickItem?: (id: number) => void;
  onReload?: () => void;
  onSearch?: (q: SearchQuery) => void;
  sortOption?: SortOption;
  onChangeSort?: (option: SortOption) => void;
};

function SortSelect({
  value = "default",
  onChange,
}: {
  value?: SortOption;
  onChange?: (v: SortOption) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange?.(e.target.value as SortOption)}
      className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-800
                 shadow-sm hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300"
      aria-label="Sort"
    >
      <option value="default">Sort</option>
      <option value="year_desc">Year (new → old)</option>
      <option value="year_asc">Year (old → new)</option>
    </select>
  );
}

function Divider() {
  return <div className="hidden h-8 w-px bg-zinc-200 md:block" aria-hidden="true" />;
}

export default function TopPage({
  items,
  onClickItem,
  onReload,
  onSearch,
  sortOption,
  onChangeSort,
}: TopPageProps) {
  const regionOptions = useMemo(() => ["", "AFR", "ARB", "APA", "EUR", "LAC"] as const, []);
  const categoryOptions = useMemo(() => ["", "Cultural", "Natural", "Mixed"] as const, []);

  const [region, setRegion] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [keyword, setKeyword] = useState<string>("");

  const submitSearch = () => {
    onSearch?.({
      region: region || undefined,
      category: category || undefined,
      keyword: keyword.trim() || undefined,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitSearch();
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-12">
      <div className="sticky top-0 z-20 -mx-4 px-4 pb-4 pt-4 bg-white/95 backdrop-blur border-b border-zinc-200/70">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-3xl font-extrabold tracking-tight text-indigo-700">
              World Heritage
            </h1>
            <p className="mt-1 text-sm font-medium text-zinc-700">
              Learn by searching and comparing sites.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <SortSelect value={sortOption} onChange={onChangeSort} />
            {onReload && (
              <button
                type="button"
                onClick={onReload}
                className="shrink-0 text-xs font-semibold text-zinc-700 hover:text-zinc-900 hover:underline"
              >
                Reload
              </button>
            )}
          </div>
        </div>
        <form onSubmit={handleSubmit} className="mt-5">
          <div
            className="
              flex flex-col gap-3
              rounded-[28px] border border-zinc-200 bg-white px-4 py-3 shadow-sm
              md:flex-row md:items-center md:gap-4
            "
          >
            <div className="flex items-center gap-3 md:w-[220px]">
              <div className="min-w-[72px] leading-tight">
                <div className="text-[11px] font-semibold text-zinc-600">Region</div>
                <div className="text-[11px] text-zinc-400">Area</div>
              </div>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="
                  w-full rounded-xl bg-white px-2 py-2 text-sm font-semibold text-zinc-900
                  focus:outline-none
                "
                aria-label="Region"
              >
                {regionOptions.map((v, i) => (
                  <option key={`${v || "all"}-${i}`} value={v}>
                    {v ? v : "All"}
                  </option>
                ))}
              </select>
            </div>
            <Divider />
            <div className="flex items-center gap-3 md:w-[260px]">
              <div className="min-w-[84px] leading-tight">
                <div className="text-[11px] font-semibold text-zinc-600">Category</div>
                <div className="text-[11px] text-zinc-400">Type</div>
              </div>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="
                  w-full rounded-xl bg-white px-2 py-2 text-sm font-semibold text-zinc-900
                  focus:outline-none
                "
                aria-label="Category"
              >
                {categoryOptions.map((v, i) => (
                  <option key={`${v || "all"}-${i}`} value={v}>
                    {v ? v : "All"}
                  </option>
                ))}
              </select>
            </div>
            <Divider />

            <div className="flex items-center gap-3 md:flex-1">
              <div className="min-w-[84px] leading-tight">
                <div className="text-[11px] font-semibold text-zinc-600">Keyword</div>
                <div className="text-[11px] text-zinc-400">Name / Country</div>
              </div>

              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Search by name / country / keyword…"
                className="
                  w-full rounded-xl bg-white px-2 py-2 text-sm text-zinc-900 placeholder:text-zinc-400
                  focus:outline-none
                "
                aria-label="Keyword"
              />

              <Button type="submit" size="sm" className="rounded-full px-4">
                Search
              </Button>
            </div>
          </div>

          <div className="mt-2 text-[11px] font-medium text-zinc-600">
            Algolia wiring will replace this local search later.
          </div>
        </form>
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
