import { useEffect } from "react";
import { useRemoveFavorite } from "../hooks/use-remove-favorite";
import { FavoriteHeartButton } from "../components/FavoriteHeartButton";

export function FavoriteRemoveButtonContainer({
  heritageId,
  onRemoved,
  className,
}: {
  heritageId: number;
  onRemoved?: () => void;
  className?: string;
}) {
  const { submit, isRemoved, isLoading } = useRemoveFavorite();

  useEffect(() => {
    if (isRemoved) onRemoved?.();
  }, [isRemoved, onRemoved]);

  return (
    <FavoriteHeartButton
      isFavorited={!isRemoved}
      isLoading={isLoading}
      onClick={() => void submit(heritageId)}
      className={className}
    />
  );
}
