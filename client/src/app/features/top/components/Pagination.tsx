import type { MouseEvent } from "react";

type PaginationProps = {
  currentPage: number;
  lastPage: number;
  onChange: (page: number) => void;
  disabled?: boolean;
  windowSize?: number;
  simple?: boolean;
};

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

function buildPageItems(current: number, last: number, windowSize: number): Array<number | "…"> {
  if (last <= 1) return [1];

  const pages = new Set<number>();
  pages.add(1);
  pages.add(last);

  for (let p = current - windowSize; p <= current + windowSize; p++) {
    if (p >= 1 && p <= last) pages.add(p);
  }

  const sorted = Array.from(pages).sort((a, b) => a - b);

  const out: Array<number | "…"> = [];
  for (let i = 0; i < sorted.length; i++) {
    const p = sorted[i];
    const prev = i === 0 ? null : sorted[i - 1];
    if (prev !== null && p - prev > 1) out.push("…");
    out.push(p);
  }
  return out;
}

export function Pagination({
  currentPage,
  lastPage,
  onChange,
  disabled = false,
  windowSize = 2,
  simple = false,
}: PaginationProps) {
  const last = Math.max(1, lastPage);
  const current = clamp(currentPage, 1, last);

  if (last <= 1) return null;

  const go = (page: number) => {
    if (disabled) return;
    onChange(clamp(page, 1, last));
  };

  const onClickNumber = (page: number) => (e: MouseEvent) => {
    e.preventDefault();
    go(page);
  };

  const pageItems = simple ? [] : buildPageItems(current, last, windowSize);

  return (
    <nav className="flex flex-wrap items-center gap-2" aria-label="Pagination">
      <button
        type="button"
        disabled={disabled || current <= 1}
        onClick={() => go(current - 1)}
        className="inline-flex items-center justify-center rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
        aria-label="Previous page"
      >
        Prev
      </button>

      {!simple && (
        <div className="flex flex-wrap items-center gap-1">
          {pageItems.map((it, idx) =>
            it === "…" ? (
              <span
                key={`ellipsis-${idx}`}
                className="px-2 text-sm text-zinc-500 dark:text-zinc-400"
                aria-hidden="true"
              >
                …
              </span>
            ) : (
              <button
                key={it}
                type="button"
                disabled={disabled || it === current}
                onClick={onClickNumber(it)}
                className={`inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-2 text-sm ${
                  it === current
                    ? "border-zinc-300 bg-zinc-100 font-bold text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                    : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
                } disabled:cursor-not-allowed disabled:opacity-60`}
                aria-current={it === current ? "page" : undefined}
                aria-label={`Page ${it}`}
              >
                {it}
              </button>
            ),
          )}
        </div>
      )}

      <button
        type="button"
        disabled={disabled || current >= last}
        onClick={() => go(current + 1)}
        className="inline-flex items-center justify-center rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
        aria-label="Next page"
      >
        Next
      </button>

      <span className="ml-1 text-xs text-zinc-500 dark:text-zinc-400">
        Page {current} / {last}
      </span>
    </nav>
  );
}
