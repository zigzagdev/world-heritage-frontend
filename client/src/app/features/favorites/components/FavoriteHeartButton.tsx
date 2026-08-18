import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import IconButton from "@shared/uis/Icon-Button.tsx";

export function FavoriteHeartButton({
  isFavorited,
  isLoading = false,
  onClick,
  className,
}: {
  isFavorited: boolean;
  isLoading?: boolean;
  onClick: () => void;
  className?: string;
}) {
  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();
    event.stopPropagation();
    onClick();
  };

  return (
    <IconButton
      onClick={handleClick}
      disabled={isLoading}
      aria-label={isFavorited ? "Favorited" : "Add to favorites"}
      aria-pressed={isFavorited}
      className={className}
    >
      {isFavorited ? <FavoriteIcon className="!text-rose-500" /> : <FavoriteBorderIcon />}
    </IconButton>
  );
}
