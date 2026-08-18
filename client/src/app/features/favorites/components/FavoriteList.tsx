import type { WorldHeritageVm } from "../../../../domain/types.ts";
import { HeritageCard } from "@features/top/cards/HeritageCard";
import { useText } from "@shared/locale/ui-text.ts";
import { FavoriteRemoveButtonContainer } from "../containers/favorite-remove-button-container";

export function FavoriteList({
  items,
  onClickItem,
  onRemove,
}: {
  items: ReadonlyArray<WorldHeritageVm>;
  onClickItem?: (id: number) => void;
  onRemove?: () => void;
}) {
  const text = useText();

  if (items.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-sm text-zinc-600">{text.favoritesEmpty}</p>
      </div>
    );
  }

  return (
    <ul className="grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-2 lg:grid-cols-3">
      {items.map((it) => (
        <li key={it.id} className="list-none">
          <HeritageCard
            item={it}
            onClickItem={onClickItem}
            action={
              <FavoriteRemoveButtonContainer
                heritageId={it.id}
                onRemoved={onRemove}
                className="!text-white"
              />
            }
          />
        </li>
      ))}
    </ul>
  );
}
