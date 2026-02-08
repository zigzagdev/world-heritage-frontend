import React, { useMemo, useState, useCallback } from "react";
import type { WorldHeritageVm } from "../types";
import { HeritageCard } from "../cards/HeritageCard";
import { Button } from "@shared/uis/Button.tsx";
import SearchIcon from "@mui/icons-material/Search";

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
      className="
        h-10 rounded-xl border border-zinc-200 bg-white px-3 text-xs font-semibold text-zinc-800
        shadow-sm hover:bg-zinc-50
        focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300
      "
      aria-label="Sort"
    >
      <option value="default">Sort</option>
      <option value="year_desc">Year (new → old)</option>
      <option value="year_asc">Year (old → new)</option>
    </select>
  );
}

function Divider() {
  return <div className="hidden h-10 w-px bg-zinc-200 md:block" aria-hidden="true" />;
}

function FieldLabel({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="min-w-[84px] leading-tight">
      <div className="text-[11px] font-semibold text-zinc-700">{title}</div>
      <div className="text-[11px] text-zinc-400">{subtitle}</div>
    </div>
  );
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

  const submitSearch = useCallback(() => {
    onSearch?.({
      region: region || undefined,
      category: category || undefined,
      keyword: keyword.trim() || undefined,
    });
  }, [onSearch, region, category, keyword]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      submitSearch();
    },
    [submitSearch],
  );

  return (
    <main className="mx-auto max-w-7xl px-4 py-12">
      <div className="sticky top-0 z-20 -mx-4 border-b border-zinc-200 bg-white/95 px-4 pb-4 pt-4 backdrop-blur">
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
                className="
                  h-10 rounded-xl px-3 text-xs font-semibold text-zinc-700
                  hover:bg-zinc-50 hover:text-zinc-900
                  focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:ring-offset-2 focus:ring-offset-white
                "
              >
                Reload
              </button>
            )}
          </div>
        </div>
        <form onSubmit={handleSubmit} className="mt-5">
          <div
            className="
              rounded-[28px] border border-zinc-200 bg-white px-4 py-3 shadow-sm
              focus-within:ring-2 focus-within:ring-indigo-200 focus-within:border-indigo-300
            "
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
              <div className="flex items-center gap-3 md:w-[220px]">
                <FieldLabel title="Region" subtitle="Area" />
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="
                    h-10 w-full rounded-xl bg-transparent px-2 text-sm font-semibold text-zinc-900
                    hover:bg-zinc-50
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
                <FieldLabel title="Category" subtitle="Type" />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="
                    h-10 w-full rounded-xl bg-transparent px-2 text-sm font-semibold text-zinc-900
                    hover:bg-zinc-50
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
                <FieldLabel title="Keyword" subtitle="Name / Country" />

                <input
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Search by name / country / keyword…"
                  className="
                    h-10 w-full rounded-xl bg-transparent px-2 text-sm text-zinc-900 placeholder:text-zinc-400
                    hover:bg-zinc-50
                    focus:outline-none
                  "
                  aria-label="Keyword"
                />

                <Button
                  type="submit"
                  size="sm"
                  className="h-10 w-10 shrink-0 rounded-full p-0 !bg-rose-600 !text-white
                    hover:!bg-rose-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400
                    focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                  aria-label="Search"
                  title="Search"
                >
                  <SearchIcon fontSize="small" />
                </Button>
              </div>
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
            <p className="text-sm text-zinc-600">No sites found.</p>
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
