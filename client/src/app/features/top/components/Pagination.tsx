import type { MouseEvent } from "react";

type PaginationProps = {
  currentPage: number;
  perPage: number;
  lastPage: number;
  onChange: (page: number) => void;
  disabled?: boolean;
  windowSize?: number;
  simple?: boolean;
};

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

function buildPageItems(
  current: number,
  last: number,
  windowSize: number,
  edgeCount: number = 4, //先頭/末尾で必ず出す個数
): Array<number | "…"> {
  if (last <= 1) return [1];

  const pages = new Set<number>();

  // 先頭ページ
  for (let p = 1; p <= Math.min(edgeCount, last); p++) pages.add(p);

  // 末尾ページ
  for (let p = Math.max(1, last - edgeCount + 1); p <= last; p++) pages.add(p);

  // 現在ページ
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
  perPage,
  lastPage,
  onChange,
  disabled = false,
  windowSize = 1,
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

  const navBtn =
    "inline-flex items-center justify-center gap-2 rounded-full px-3 py-2 text-sm " +
    "text-zinc-700 hover:bg-zinc-100 active:bg-zinc-200 " +
    "disabled:cursor-not-allowed disabled:opacity-40 " +
    "dark:text-zinc-200 dark:hover:bg-zinc-800 dark:active:bg-zinc-700";

  const pageBtnBase =
    "inline-flex h-9 min-w-9 items-center justify-center rounded-full px-3 text-sm " +
    "text-zinc-700 hover:bg-zinc-100 active:bg-zinc-200 " +
    "dark:text-zinc-200 dark:hover:bg-zinc-800 dark:active:bg-zinc-700";

  const pageBtnActive =
    "bg-zinc-100 text-zinc-900 ring-1 ring-zinc-200 " +
    "dark:bg-zinc-800 dark:text-zinc-100 dark:ring-zinc-700";

  return (
    <nav className="flex flex-wrap items-center justify-center gap-2" aria-label="Pagination">
      <button
        type="button"
        disabled={disabled || current <= 1}
        onClick={() => go(current - 1)}
        className={navBtn}
        aria-label="Previous page"
      >
        <span aria-hidden="true">←</span>
        <span>Previous</span>
      </button>

      {!simple && (
        <div className="mx-1 flex flex-wrap items-center gap-1">
          {pageItems.map((it, idx) =>
            it === "…" ? (
              <span
                key={`ellipsis-${idx}`}
                className="px-2 text-sm text-zinc-400 dark:text-zinc-500"
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
                className={`${pageBtnBase} ${it === current ? pageBtnActive : ""} disabled:opacity-100`}
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
        className={navBtn}
        aria-label="Next page"
      >
        <span>Next</span>
        <span aria-hidden="true">→</span>
      </button>

      <span className="ml-2 text-xs text-zinc-400 dark:text-zinc-500">
        Page <span className="text-zinc-600 dark:text-zinc-300">{current}</span> / {last}
        <span className="ml-2">·</span>
        <span className="ml-2">per {perPage}</span>
      </span>
    </nav>
  );
}
