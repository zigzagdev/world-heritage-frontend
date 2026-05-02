import { Pagination } from "@features/top/components/Pagination.tsx";

export function TopPagePagination({
  currentPage,
  perPage,
  lastPage,
  onChangePage,
  onChangePerPage,
  perPageOptions,
  disabled,
}: {
  currentPage: number;
  perPage: number;
  lastPage: number;
  onChangePage: (page: number) => void;
  onChangePerPage?: (perPage: number) => void;
  perPageOptions?: readonly number[];
  disabled?: boolean;
}) {
  if (lastPage <= 1) return null;

  const options = perPageOptions ?? [];
  const showPerPageSelect = typeof onChangePerPage === "function" && options.length > 0;

  return (
    <div className="mt-10 flex flex-col items-center gap-3">
      {showPerPageSelect && (
        <div className="flex items-center gap-2">
          <label className="text-xs text-zinc-500">Per page</label>
          <select
            value={perPage}
            onChange={(e) => onChangePerPage?.(Number(e.target.value))}
            disabled={disabled}
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
        disabled={disabled}
      />
    </div>
  );
}
