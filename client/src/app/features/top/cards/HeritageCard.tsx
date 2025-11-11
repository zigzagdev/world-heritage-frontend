import type { WorldHeritageVm } from "../types";
import { BaseCard } from "@shared/uis/BaseCard.tsx";
import { useState } from "react";

type HeritageCardProps = {
  item: WorldHeritageVm;
  onClickItem?: (id: number) => void;
};

export function HeritageCard({ item, onClickItem }: HeritageCardProps) {
  const [expanded, setExpanded] = useState(false);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded((v) => !v);
  };

  return (
    <BaseCard onClick={() => onClickItem?.(item.id)}>
      {item.thumbnail ? (
        <img
          src={item.thumbnail}
          alt={item.title}
          loading="lazy"
          className="h-40 w-full object-cover sm:h-52 lg:h-60"
        />
      ) : (
        <div className="flex sm:h-52 lg:h-60 w-full items-center justify-center bg-zinc-100 text-sm text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
          No image
        </div>
      )}

      <div className="space-y-2 px-4 py-7">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              {item.title}
            </div>
            <div className="text-sm text-zinc-500 dark:text-zinc-400">{item.subtitle}</div>
          </div>

          <span className="shrink-0 rounded-full bg-zinc-100 px-2 py-1 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
            {item.category}
          </span>
        </div>

        <div className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
          {item.statePartyCodes ?? item.title}
        </div>

        <div className="text-sm text-zinc-600 dark:text-zinc-300">
          Year: <span className="tabular-nums">{item.yearInscribed}</span>
        </div>

        <div className="text-sm text-zinc-600 dark:text-zinc-300">Area: {item.region}</div>

        <div className="text-sm text-zinc-600 dark:text-zinc-300">
          面積: {item.areaText} <span className="px-1 text-zinc-400">/</span> Buffer:{" "}
          {item.bufferText}
        </div>

        <div className="text-sm text-zinc-600 dark:text-zinc-300">Region: {item.region}</div>

        {item.shortDescription && (
          <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
            <p
              className={
                expanded ? "whitespace-pre-wrap line-clamp-6" : "whitespace-pre-wrap line-clamp-2"
              }
            >
              {item.shortDescription}
            </p>

            <div className="mt-1 flex items-center gap-3">
              <button
                type="button"
                onClick={handleToggle}
                className="text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400"
              >
                {expanded ? "Show less" : "Show more"}
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  // TODO: 詳細ページへ遷移させる
                  console.log("go to detail of", item.id);
                }}
                className="text-xs text-zinc-500 hover:underline dark:text-zinc-400"
              >
                View details
              </button>
            </div>
          </div>
        )}
      </div>
    </BaseCard>
  );
}
