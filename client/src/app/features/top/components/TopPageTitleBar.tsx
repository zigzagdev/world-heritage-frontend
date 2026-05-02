import type { IdSortOption } from "../../../../domain/types.ts";
import { LocaleToggle } from "@shared/locale/LocaleToggle.tsx";
import { useText } from "@shared/locale/ui-text.ts";

export function TopPageTitleBar({
  order,
  onChangeOrder,
  onReload,
}: {
  order: IdSortOption;
  onChangeOrder: (order: IdSortOption) => void;
  onReload?: () => void;
}) {
  const text = useText();
  return (
    <div className="sticky top-0 z-20 -mx-4 border-b border-zinc-200 bg-white/95 px-4 pb-4 pt-4 backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-3xl font-extrabold tracking-tight text-indigo-700">
            {text.appTitle}
          </h1>
          <p className="mt-1 text-sm font-medium text-zinc-700">{text.appTagline}</p>
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
            aria-label={text.sortById}
          >
            <option value="asc">{text.ascending}</option>
            <option value="desc">{text.descending}</option>
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
              {text.reload}
            </button>
          )}

          <LocaleToggle />
        </div>
      </div>
    </div>
  );
}
