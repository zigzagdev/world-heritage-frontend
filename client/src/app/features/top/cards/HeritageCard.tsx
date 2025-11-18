import type { ReactNode, MouseEvent } from "react";
import { useState } from "react";
import type { WorldHeritageVm } from "../types";
import { BaseCard } from "@shared/uis/BaseCard.tsx";

function MetaChip({ label, value }: { label: string; value: ReactNode }) {
  return (
    <span
      className="
        rounded-full bg-zinc-100/70 px-2 py-1 text-xs text-zinc-700
        dark:bg-zinc-800/60 dark:text-zinc-300
      "
    >
      <strong>{label}:</strong> {value}
    </span>
  );
}

type HeritageCardProps = {
  item: WorldHeritageVm;
  onClickItem?: (id: number) => void;
};

const SHORT_DESC_MAX = 50;
const MEDIUM_DESC_MAX = 150;

export function HeritageCard({ item, onClickItem }: HeritageCardProps) {
  const [previewStage, setPreviewStage] = useState<"short" | "medium">("short");

  const rawDesc = (item.shortDescription ?? "").trim();
  const len = rawDesc.length;
  const hasMedium = len > MEDIUM_DESC_MAX;

  const goDetail = () => {
    if (!onClickItem) return;
    onClickItem(item.id);
  };

  const advancePreviewOrNavigate = () => {
    if (len <= SHORT_DESC_MAX) {
      goDetail();
      return;
    }

    if (previewStage === "short") {
      setPreviewStage("medium");
      return;
    }

    if (hasMedium) {
      goDetail();
    } else {
      goDetail();
    }
  };

  const handleCardClick = () => {
    advancePreviewOrNavigate();
  };

  const handleViewDetailClick = (e: MouseEvent) => {
    e.stopPropagation();
    advancePreviewOrNavigate();
  };

  const visibleDescription = (() => {
    if (!rawDesc) return "";

    if (len <= SHORT_DESC_MAX) {
      return rawDesc;
    }

    if (previewStage === "short") {
      return rawDesc.slice(0, SHORT_DESC_MAX) + "…";
    }

    const visibleLen = Math.min(len, MEDIUM_DESC_MAX);

    return rawDesc.slice(0, visibleLen) + (len > visibleLen ? "…" : "");
  })();

  const showTailNote = len > MEDIUM_DESC_MAX && previewStage === "medium";

  return (
    <BaseCard onClick={handleCardClick}>
      <div className="relative">
        {item.thumbnail ? (
          <img
            src={item.thumbnail}
            alt={item.title || "World Heritage"}
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

        <div
          className="
            pointer-events-none absolute inset-x-0 bottom-0 h-12
            bg-gradient-to-t from-zinc-950/15 to-transparent
            dark:from-black/40
          "
        />
      </div>

      <div className="space-y-3 px-4 py-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold text-zinc-900 dark:text-zinc-100">
              {item.title}
            </h3>
            {item.subtitle && (
              <p className="truncate text-sm text-zinc-500 dark:text-zinc-400">{item.subtitle}</p>
            )}
          </div>

          {item.category && (
            <span
              className="
                shrink-0 rounded-full border border-zinc-200/70
                bg-white/70 px-2 py-1 text-xs font-medium text-zinc-700
                dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-300
              "
            >
              {item.category}
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-600 dark:text-zinc-300">
          <MetaChip label="Year" value={item.yearInscribed} />
          {item.region && <MetaChip label="Region" value={item.region} />}
          {(item.areaText || item.bufferText) && (
            <MetaChip
              label="Area"
              value={
                <>
                  {item.areaText}
                  <span className="px-1 text-zinc-400">/</span>
                  Buffer {item.bufferText}
                </>
              }
            />
          )}
          {item.primaryStatePartyCode?.length ? (
            <MetaChip label="Country" value={item.primaryStatePartyCode} />
          ) : null}
        </div>

        {rawDesc && (
          <div className="pt-1">
            <p className="whitespace-pre-wrap text-sm leading-6 text-zinc-700 dark:text-zinc-200">
              {visibleDescription}
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-3">
              {len > SHORT_DESC_MAX && (
                <button
                  type="button"
                  onClick={handleViewDetailClick}
                  className="text-xs font-medium text-indigo-600 hover:underline focus:underline dark:text-indigo-400"
                >
                  {previewStage === "short" && "View details"}
                  {previewStage === "medium" && (hasMedium ? "Open full details" : "Open detail")}
                </button>
              )}

              {showTailNote && (
                <span className="text-xs text-zinc-400">
                  Full description is available on the detail page.
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </BaseCard>
  );
}
