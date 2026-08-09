import { useAddFavorite } from "../hooks/use-add-favorite";
import { useAuth } from "@shared/auth/AuthHooks.ts";

export function FavoriteButtonContainer({ heritageId }: { heritageId: number }) {
  const { user } = useAuth();
  const { submit, isAdded, isLoading } = useAddFavorite();

  if (!user) return null;

  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    void submit(heritageId);
  };

  return (
    <button
      type="button"
      aria-label={isAdded ? "Favorited" : "Add to favorites"}
      aria-pressed={isAdded}
      disabled={isLoading || isAdded}
      onClick={handleClick}
    >
      {isAdded ? "♥" : "♡"}
    </button>
  );
}
