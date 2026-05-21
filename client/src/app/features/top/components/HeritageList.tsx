import type { WorldHeritageVm } from "../../../../domain/types.ts";
import { HeritageCard } from "../cards/HeritageCard";
import { HeritageCardSkeleton } from "@shared/uis/HeritageCardSkeleton.tsx";

const SKELETON_COUNT = 6;

export function HeritageList({
  items,
  onClickItem,
  isLoading = false,
}: {
  items: ReadonlyArray<WorldHeritageVm>;
  onClickItem?: (id: number) => void;
  isLoading?: boolean;
}) {
  if (isLoading) {
    return (
      <ul className="grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <li key={i} className="list-none">
            <HeritageCardSkeleton />
          </li>
        ))}
      </ul>
    );
  }

  if (items.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-sm text-zinc-600">No sites found.</p>
      </div>
    );
  }

  return (
    <ul className="grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-2 lg:grid-cols-3">
      {items.map((it, index) => (
        <li key={it.id} className="list-none">
          <HeritageCard item={it} onClickItem={onClickItem} isPriority={index < 3} />
        </li>
      ))}
    </ul>
  );
}
