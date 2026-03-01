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
      {header ?? null}

      <main className="mx-auto max-w-7xl px-4 py-12">
        <div className="sticky top-0 z-20 -mx-4 border-b border-zinc-200 bg-white/95 px-4 pb-4 pt-4 backdrop-blur">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-3xl font-extrabold tracking-tight text-indigo-700">
                World Heritage Sites
              </h1>
              <p className="mt-1 text-sm font-medium text-zinc-700">{rangeText}</p>
              {errorMessage ? (
                <p className="mt-1 text-xs font-medium text-red-700">{errorMessage}</p>
              ) : null}
            </div>
          </div>
        </div>

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
