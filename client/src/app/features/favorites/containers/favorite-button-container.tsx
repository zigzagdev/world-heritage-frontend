import { useAddFavorite } from "../hooks/use-add-favorite";
import { useRemoveFavorite } from "../hooks/use-remove-favorite";
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
  const { submit: submitAdd, isAdded, isLoading: isAdding } = useAddFavorite();
  const { submit: submitRemove, isRemoved, isLoading: isRemoving } = useRemoveFavorite();

  if (!user) return null;

  const isFavorited = isAdded && !isRemoved;

  const handleClick = () => {
    if (isFavorited) {
      void submitRemove(heritageId);
    } else {
      void submitAdd(heritageId);
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
