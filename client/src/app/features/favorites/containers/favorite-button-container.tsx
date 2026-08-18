import { useState } from "react";
import { useAddFavorite } from "../hooks/use-add-favorite";
import { useRemoveFavorite } from "../hooks/use-remove-favorite";
import { useFavoritesLookup } from "../hooks/use-favorites-lookup";
import { useAuth } from "@shared/auth/AuthHooks.ts";
import { FavoriteHeartButton } from "../components/FavoriteHeartButton";

export function FavoriteButtonContainer({
  heritageId,
  className,
}: {
  heritageId: number;
  className?: string;
}) {
  const { user } = useAuth();
  const { isFavorited: isFavoritedInLookup } = useFavoritesLookup();
  const { submit: submitAdd, isLoading: isAdding } = useAddFavorite();
  const { submit: submitRemove, isLoading: isRemoving } = useRemoveFavorite();
  const [override, setOverride] = useState<boolean | null>(null);

  if (!user) return null;

  const isFavorited = override ?? isFavoritedInLookup(heritageId);

  const handleClick = () => {
    if (isFavorited) {
      void submitRemove(heritageId).then((ok) => {
        if (ok) setOverride(false);
      });
    } else {
      void submitAdd(heritageId).then((ok) => {
        if (ok) setOverride(true);
      });
    }
  };

  return (
    <FavoriteHeartButton
      isFavorited={isFavorited}
      isLoading={isAdding || isRemoving}
      onClick={handleClick}
      className={className}
    />
  );
}
