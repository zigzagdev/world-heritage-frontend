import type { WorldHeritageVm } from "../../../../domain/types.ts";
import { HeritageCard } from "../cards/HeritageCard";

export function HeritageList({
  items,
  onClickItem,
}: {
  items: ReadonlyArray<WorldHeritageVm>;
  onClickItem?: (id: number) => void;
}) {
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
        <li key={it.id} className={`list-none ${index === 0 ? "lg:col-span-2" : ""}`}>
          <HeritageCard item={it} onClickItem={onClickItem} isSpotlight={index === 0} />
        </li>
      ))}
    </ul>
  );
}
