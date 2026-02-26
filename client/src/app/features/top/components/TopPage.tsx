import type { WorldHeritageVm } from "../../../../domain/types.ts";
import { HeritageCard } from "../cards/HeritageCard";
import type { ReactNode } from "react";
import { Pagination } from "@features/top/components/Pagination.tsx";

export type SortOption = "default" | "year_desc" | "year_asc";

export type TopPageProps = {
  items: ReadonlyArray<WorldHeritageVm>;
  onClickItem?: (id: number) => void;
  onReload?: () => void;
  sortOption?: SortOption;
  onChangeSort?: (option: SortOption) => void;
  header?: ReactNode;
  currentPage?: number;
  lastPage?: number;
  onChangePage?: (page: number) => void;
  paginationDisabled?: boolean;
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

export default function TopPage({
  items,
  onClickItem,
  onReload,
  sortOption,
  onChangeSort,
  header,
  currentPage,
  lastPage,
  onChangePage,
  paginationDisabled,
}: TopPageProps) {
  const showPagination =
    typeof currentPage === "number" &&
    typeof lastPage === "number" &&
    typeof onChangePage === "function" &&
    lastPage > 1;

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
      </div>

      <div>{header}</div>

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

        {showPagination && (
          <div className="mt-10 flex justify-center">
            <Pagination
              currentPage={currentPage}
              lastPage={lastPage}
              onChange={onChangePage}
              disabled={paginationDisabled}
            />
          </div>
        )}
      </div>
    </main>
  );
}
