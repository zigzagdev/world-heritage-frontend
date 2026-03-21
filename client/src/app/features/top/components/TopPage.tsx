import type { WorldHeritageVm } from "../../../../domain/types.ts";
import { HeritageCard } from "../cards/HeritageCard";
import type { ReactNode } from "react";
import { Pagination } from "@features/top/components/Pagination.tsx";
import type { IdSortOption } from "../../../../domain/types.ts";
import { Map } from "./Map.tsx";

export type TopPageProps = {
  items: ReadonlyArray<WorldHeritageVm>;
  onClickItem?: (id: number) => void;
  onReload?: () => void;
  header?: ReactNode;
  currentPage?: number;
  perPage?: number;
  lastPage?: number;
  order: IdSortOption;
  onChangeOrder: (order: IdSortOption) => void;
  onChangePage?: (page: number) => void;
  onChangePerPage?: (perPage: number) => void;
  perPageOptions?: readonly number[];
  paginationDisabled?: boolean;
};

export default function TopPage({
  items,
  onClickItem,
  onReload,
  header,
  currentPage,
  perPage,
  lastPage,
  order,
  onChangeOrder,
  onChangePage,
  onChangePerPage,
  perPageOptions,
  paginationDisabled,
}: TopPageProps) {
  const options = (perPageOptions ?? [10, 30, 50, 70]) as readonly number[];

  const showPagination =
    typeof currentPage === "number" &&
    typeof perPage === "number" &&
    typeof lastPage === "number" &&
    typeof onChangePage === "function" &&
    lastPage > 1;

  const showPerPageSelect =
    showPagination && typeof onChangePerPage === "function" && options.length > 0;

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
            <select
              value={order}
              onChange={(e) => onChangeOrder(e.target.value as IdSortOption)}
              className="
                h-10 rounded-xl border border-zinc-200 bg-white px-3 text-xs font-semibold text-zinc-800
                shadow-sm hover:bg-zinc-50
                focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300
              "
              aria-label="Sort by ID"
            >
              <option value="asc">ID ascending</option>
              <option value="desc">ID descending</option>
            </select>

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

      <div className="mt-4">
        <Map />
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

        {showPagination && typeof perPage === "number" && (
          <div className="mt-10 flex flex-col items-center gap-3">
            {showPerPageSelect && (
              <div className="flex items-center gap-2">
                <label className="text-xs text-zinc-500">Per page</label>
                <select
                  value={perPage}
                  onChange={(e) => onChangePerPage?.(Number(e.target.value))}
                  disabled={paginationDisabled}
                  className="h-9 rounded-full border border-zinc-200 bg-white px-3 text-sm text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
                  aria-label="Per page"
                >
                  {options.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <Pagination
              perPage={perPage}
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
