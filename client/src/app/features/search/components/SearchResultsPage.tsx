import type { ReactNode } from "react";
import type { WorldHeritageVm } from "../../../../domain/types";
import { HeritageCard } from "@features/top/cards/HeritageCard";
import { Pagination } from "@features/top/components/Pagination.tsx";
import { BreadcrumbList } from "@shared/components/BreadcrumbList.tsx";

type Pagination = {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
};

export type SearchResultsPageProps = {
  header?: ReactNode;
  items: ReadonlyArray<WorldHeritageVm>;
  pagination: Pagination | null;
  rangeText: string;
  onClickItem?: (id: number) => void;
  onPrev?: () => void;
  onNext?: () => void;
  errorMessage?: string;
  onPageChange?: (page: number) => void;
};

export default function SearchResultsPage({
  header,
  items,
  pagination,
  rangeText,
  onClickItem,
  errorMessage,
  onPageChange,
}: SearchResultsPageProps) {
  return (
    <>
      <main className="mx-auto max-w-7xl px-4 py-12">
        <div className="sticky top-0 z-20 -mx-4 border-b border-zinc-200 bg-white/95 px-4 py-3 backdrop-blur">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-indigo-700">
                  Search Results
                </h1>

                {rangeText ? (
                  <span className="shrink-0 rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700">
                    {rangeText}
                  </span>
                ) : null}
              </div>

              <p className="mt-1 text-sm text-zinc-600">
                Use filters to narrow down sites for World Heritage exam study.
              </p>

              {errorMessage ? (
                <div className="mt-1 text-sm font-semibold text-red-600">{errorMessage}</div>
              ) : null}
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                disabled
                className="
          h-9 rounded-xl border border-zinc-200 bg-white px-3 text-xs font-semibold text-zinc-700
          shadow-sm opacity-60
        "
                aria-label="Study mode (coming soon)"
                title="Coming soon"
              >
                Study mode (soon)
              </button>

              <button
                type="button"
                disabled
                className="
          h-9 rounded-xl bg-indigo-600 px-3 text-xs font-semibold text-white
          shadow-sm opacity-60
        "
                aria-label="Quick quiz (coming soon)"
                title="Coming soon"
              >
                Quick quiz (soon)
              </button>
            </div>
          </div>
        </div>

        {header ?? null}

        <div className="pt-8">
          <BreadcrumbList />

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

        {pagination && (
          <div className="mt-10 flex justify-center">
            <Pagination
              currentPage={pagination.current_page}
              perPage={pagination.per_page}
              lastPage={pagination.last_page}
              onChange={onPageChange ?? (() => {})}
              disabled={false}
            />
          </div>
        )}
      </main>
    </>
  );
}
