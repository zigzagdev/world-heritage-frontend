import type { ReactNode, MouseEvent } from "react";
import type { WorldHeritageVm, CriteriaCode } from "../types";
import { BaseCard } from "@shared/uis/BaseCard.tsx";

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

type HeritageCardProps = {
  item: WorldHeritageVm;
  onClickItem?: (id: number) => void;
};

const DESC_CLAMP = 2;
const CRITERIA_MAX = 4;

export function HeritageCard({ item, onClickItem }: HeritageCardProps) {
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

  const title = item.title || "World Heritage";
  const subtitle = item.subtitle ?? "";
  const desc = (item.shortDescription ?? "").trim();

  const criteria = (item.criteria ?? []).slice(0, CRITERIA_MAX);
  const hasMoreCriteria = (item.criteria?.length ?? 0) > CRITERIA_MAX;

  return (
    <BaseCard onClick={handleCardClick}>
      {/* Hero image */}
      <div className="relative overflow-hidden rounded-2xl">
        {item.thumbnail ? (
          <img
            src={item.thumbnail.url}
            alt={item.thumbnail.alt ?? title}
            loading="lazy"
            className="h-56 w-full object-cover sm:h-64 lg:h-72"
          />
        ) : (
          <div
            className="
              h-56 w-full sm:h-64 lg:h-72
              grid place-items-center
              bg-zinc-100 text-sm text-zinc-500
              dark:bg-zinc-800 dark:text-zinc-400
            "
          >
            No image
          </div>
        )}

        {/* Overlay */}
        <div
          className="
            pointer-events-none absolute inset-0
            bg-gradient-to-t from-black/65 via-black/20 to-transparent
          "
        />

        {/* Top-right category badge */}
        {item.category && (
          <div className="absolute right-3 top-3">
            <TagChip>{item.category}</TagChip>
          </div>
        )}

        {/* Title on image */}
        <div className="absolute inset-x-0 bottom-0 p-4">
          <h3 className="text-base font-semibold text-white sm:text-lg">{title}</h3>
          {subtitle && <p className="mt-0.5 text-sm text-white/80">{subtitle}</p>}
        </div>
      </div>

      {/* Body */}
      <div className="space-y-3 px-4 py-4">
        {/* Study-oriented tags (Criteria) */}
        {(criteria.length > 0 || item.isEndangered) && (
          <div className="flex flex-wrap items-center gap-2">
            {criteria.map((c: CriteriaCode) => (
              <MetaChip key={c}>
                Criteria <span className="ml-1 font-semibold">{c}</span>
              </MetaChip>
            ))}
            {hasMoreCriteria && <MetaChip>+{(item.criteria?.length ?? 0) - CRITERIA_MAX}</MetaChip>}

            {item.isEndangered && (
              <span className="inline-flex items-center rounded-full bg-red-600/10 px-2 py-1 text-xs font-medium text-red-700 dark:text-red-300">
                Endangered
              </span>
            )}
          </div>
        )}

        {/* Description (always short in list) */}
        {desc ? (
          <p
            className="
              text-sm leading-6 text-zinc-700 dark:text-zinc-200
              line-clamp-2
            "
            style={{ WebkitLineClamp: DESC_CLAMP } as React.CSSProperties}
          >
            {desc}
          </p>
        ) : (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">No overview available.</p>
        )}

        {/* Facts row (compact) */}
        <div className="flex flex-wrap gap-2 text-xs">
          <MetaChip>
            Year <span className="ml-1 font-semibold">{item.yearInscribed}</span>
          </MetaChip>

          {item.region && (
            <MetaChip>
              Region <span className="ml-1 font-semibold">{item.region}</span>
            </MetaChip>
          )}

          {/* Country: prefer label if you have it; otherwise code */}
          {item.primaryStatePartyCode?.length ? (
            <MetaChip>
              Country <span className="ml-1 font-semibold">{item.primaryStatePartyCode}</span>
            </MetaChip>
          ) : item.country ? (
            <MetaChip>
              Country <span className="ml-1 font-semibold">{item.country}</span>
            </MetaChip>
          ) : null}

          {(item.areaText || item.bufferText) && (
            <MetaChip>
              Area <span className="ml-1 font-semibold">{item.areaText}</span>
              <span className="mx-1 text-zinc-400">·</span>
              Buffer <span className="font-semibold">{item.bufferText}</span>
            </MetaChip>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-zinc-500 dark:text-zinc-400">Click to open details</span>

          <button
            type="button"
            onClick={handleViewDetailClick}
            className="
              inline-flex items-center gap-1 text-sm font-medium text-indigo-600
              hover:underline focus:underline dark:text-indigo-400
            "
          >
            View details <span aria-hidden>→</span>
          </button>
        </div>
      </div>
    </BaseCard>
  );
}
