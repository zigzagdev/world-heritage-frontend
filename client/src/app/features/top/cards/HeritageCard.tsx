import type { Item } from "../components/TopPage";
import { BaseCard } from "@shared/uis/BaseCard.tsx";

type HeritageCardProps = {
  item: Item;
  onClickItem?: (id: number) => void;
};

export function HeritageCard({ item, onClickItem }: HeritageCardProps) {
  return (
    <BaseCard onClick={() => onClickItem?.(item.id)}>
      {item.thumbnail ? (
        <img
          src={item.thumbnail}
          alt={item.title}
          loading="lazy"
          className="h-40 w-full object-cover sm:h-44 lg:h-48"
        />
      ) : (
        <div className="flex h-40 w-full items-center justify-center bg-zinc-100 text-sm text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
          No image
        </div>
      )}

      <div className="space-y-2 px-4 py-4">
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

        <div className="text-sm text-zinc-600 dark:text-zinc-300">
          Year: <span className="tabular-nums">{item.year}</span>
        </div>

        <div className="text-sm text-zinc-600 dark:text-zinc-300">
          Area: {item.areaText} <span className="px-1 text-zinc-400">/</span> Buffer:{" "}
          {item.bufferText}
        </div>
      </div>
    </BaseCard>
  );
}
