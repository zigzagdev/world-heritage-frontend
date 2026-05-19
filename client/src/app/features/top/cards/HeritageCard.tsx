import type { ReactNode, MouseEvent } from "react";
import type { WorldHeritageVm, CriteriaCode } from "../../../../domain/types.ts";
import { BaseCard } from "@shared/uis/BaseCard.tsx";
import { useText } from "@shared/locale/ui-text.ts";

function MetaChip({ children }: { children: ReactNode }) {
  return (
    <span
      className="
        inline-flex items-center rounded-full
        bg-zinc-100/70 px-2 py-1 text-xs text-zinc-700
        dark:bg-zinc-800/60 dark:text-zinc-300
      "
    >
      {children}
    </span>
  );
}

function TagChip({ children }: { children: ReactNode }) {
  return (
    <span
      className="
        inline-flex items-center rounded-full
        border border-zinc-200/70 bg-white/70 px-2 py-1 text-xs font-medium text-zinc-700
        dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-200
      "
    >
      {children}
    </span>
  );
}

const DESC_CLAMP = 2;
const CRITERIA_MAX = 4;

export function HeritageCard({
  item,
  onClickItem,
  isSpotlight = false,
}: {
  item: WorldHeritageVm;
  onClickItem?: (id: number) => void;
  isSpotlight?: boolean;
}) {
  const text = useText();

  const goDetail = () => {
    if (!onClickItem) return;
    onClickItem(item.id);
  };

  const handleCardClick = () => {
    goDetail();
  };

  const handleViewDetailClick = (e: MouseEvent) => {
    e.stopPropagation();
    goDetail();
  };

  const title = item.title;
  const subtitle = item.subtitle ?? "";
  const desc = item.displayDescription.trim();

  const criteria = (item.criteria ?? []).slice(0, CRITERIA_MAX);
  const hasMoreCriteria = (item.criteria?.length ?? 0) > CRITERIA_MAX;
  return (
    <BaseCard onClick={handleCardClick}>
      <div className="flex h-full flex-col">
        <div className="relative overflow-hidden rounded-2xl">
          {item.thumbnailUrl ? (
            <img
              src={item.thumbnailUrl}
              alt={item.thumbnailUrl ?? title}
              referrerPolicy="no-referrer"
              loading="lazy"
              className={`w-full object-cover transition-transform duration-300 group-hover:scale-105 ${isSpotlight ? "h-64 sm:h-80 lg:h-96" : "h-56 sm:h-64 lg:h-72"}`}
            />
          ) : (
            <div className="grid h-56 w-full place-items-center bg-gradient-to-br from-indigo-50 to-zinc-100 sm:h-64 lg:h-72 dark:from-indigo-950 dark:to-zinc-800">
              <div className="flex flex-col items-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-14 w-14 text-indigo-200 dark:text-indigo-800"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
                <span className="px-4 text-center text-xs font-medium text-zinc-400 dark:text-zinc-500 line-clamp-2">
                  {title}
                </span>
              </div>
            </div>
          )}

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />

          {item.isEndangered && (
            <div className="absolute right-3 bottom-3">
              <span className="inline-flex items-center rounded-md bg-red-600 px-2 py-1 text-xs font-bold text-white shadow-sm">
                {text.danger}
              </span>
            </div>
          )}

          <div className="absolute inset-x-0 bottom-0 p-4">
            <h3
              className={`text-white font-semibold break-words leading-snug line-clamp-2 ${isSpotlight ? "text-xl lg:text-2xl" : "text-lg"}`}
            >
              {title}
            </h3>
            {subtitle && <p className="mt-0.5 text-sm text-white/80 line-clamp-1">{subtitle}</p>}
          </div>
        </div>

        <div className="flex flex-1 flex-col space-y-4 px-4 py-4">
          <div className="space-y-2">
            {item.category && (
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-bold">
                  {text.heritageCategory}
                </span>
                <div>
                  <TagChip>{item.category}</TagChip>
                </div>
              </div>
            )}

            {criteria.length > 0 && (
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-bold">
                  {text.criteria}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {criteria.map((c: CriteriaCode) => (
                    <MetaChip key={c}>{c}</MetaChip>
                  ))}
                  {hasMoreCriteria && (
                    <MetaChip>+{(item.criteria?.length ?? 0) - CRITERIA_MAX}</MetaChip>
                  )}
                </div>
              </div>
            )}
          </div>

          {desc ? (
            <p
              className="text-sm leading-6 text-zinc-700 dark:text-zinc-200 line-clamp-2"
              style={{ WebkitLineClamp: DESC_CLAMP }}
            >
              {desc}
            </p>
          ) : (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">{text.noOverview}</p>
          )}
          <div className="mt-auto border-t border-zinc-100 pt-2 dark:border-zinc-800">
            <button
              type="button"
              onClick={handleViewDetailClick}
              className="
                group/cta inline-flex w-full items-center justify-center gap-1.5
                rounded-full px-3 py-2
                text-sm font-semibold text-indigo-600
                transition-colors hover:bg-indigo-50
                dark:text-indigo-400 dark:hover:bg-indigo-950/40
              "
            >
              {text.viewDetails}
              <span className="transition-transform duration-200 group-hover/cta:translate-x-1">
                →
              </span>
            </button>
          </div>
        </div>
      </div>
    </BaseCard>
  );
}
