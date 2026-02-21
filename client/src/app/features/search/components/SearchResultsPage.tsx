import type { ReactNode } from "react";
import type { WorldHeritageVm } from "../../../../domain/types";
import { HeritageCard } from "@features/top/cards/HeritageCard";

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
};

function Pager({
  canPrev,
  canNext,
  onPrev,
  onNext,
}: {
  canPrev: boolean;
  canNext: boolean;
  onPrev?: () => void;
  onNext?: () => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        disabled={!canPrev}
        onClick={onPrev}
        className="
          h-10 rounded-xl border border-zinc-200 bg-white px-3 text-xs font-semibold text-zinc-800
          shadow-sm hover:bg-zinc-50 disabled:opacity-40
          focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300
        "
      >
        Prev
      </button>
      <button
        type="button"
        disabled={!canNext}
        onClick={onNext}
        className="
          h-10 rounded-xl border border-zinc-200 bg-white px-3 text-xs font-semibold text-zinc-800
          shadow-sm hover:bg-zinc-50 disabled:opacity-40
          focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300
        "
      >
        Next
      </button>
    </div>
  );
}

export default function SearchResultsPage({
  header,
  items,
  pagination,
  rangeText,
  onClickItem,
  onPrev,
  onNext,
  errorMessage,
}: SearchResultsPageProps) {
  const canPrev = Boolean(pagination && pagination.current_page > 1);
  const canNext = Boolean(pagination && pagination.current_page < pagination.last_page);
  const showPager = Boolean(pagination && pagination.last_page > 1);

  return (
    <>
      {header ?? null}

      <main className="mx-auto max-w-7xl px-4 py-12">
        <div className="sticky top-0 z-20 -mx-4 border-b border-zinc-200 bg-white/95 px-4 pb-4 pt-4 backdrop-blur">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-3xl font-extrabold tracking-tight text-indigo-700">
                Search results
              </h1>
              <p className="mt-1 text-sm font-medium text-zinc-700">{rangeText}</p>
              {errorMessage ? (
                <p className="mt-1 text-xs font-medium text-red-700">{errorMessage}</p>
              ) : null}
            </div>

            {showPager ? (
              <Pager canPrev={canPrev} canNext={canNext} onPrev={onPrev} onNext={onNext} />
            ) : null}
          </div>
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

        {showPager ? (
          <div className="pt-10">
            <div className="mx-auto max-w-7xl">
              <div className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white px-4 py-3">
                <div className="text-xs text-zinc-600">
                  Page {pagination?.current_page} / {pagination?.last_page} · Total{" "}
                  {pagination?.total.toLocaleString("en-CA")}
                </div>
                <Pager canPrev={canPrev} canNext={canNext} onPrev={onPrev} onNext={onNext} />
              </div>
            </div>
          </div>
        ) : null}
      </main>
    </>
  );
}
