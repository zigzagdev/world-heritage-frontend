import { useAddFavorite } from "../hooks/use-add-favorite";
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
  const { submit, isAdded, isLoading } = useAddFavorite();

  if (!user) return null;

  return (
    <FavoriteHeartButton
      isFavorited={isAdded}
      isLoading={isLoading || isAdded}
      onClick={() => void submit(heritageId)}
      className={className}
    />
  );
}
