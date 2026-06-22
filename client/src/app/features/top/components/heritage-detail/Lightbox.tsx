import { useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import IconButton from "@shared/uis/Icon-Button.tsx";
import type { WorldHeritageImageVm } from "../../../../../domain/types.ts";

type LightboxImage = Pick<WorldHeritageImageVm, "id" | "url" | "alt" | "credit">;

export function Lightbox({
  images,
  index,
  onClose,
  onNavigate,
}: {
  images: LightboxImage[];
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}) {
  const image = index !== null ? images[index] : null;
  const hasPrev = index !== null && index > 0;
  const hasNext = index !== null && index < images.length - 1;

  useEffect(() => {
    if (!image) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && hasPrev) onNavigate(index! - 1);
      if (e.key === "ArrowRight" && hasNext) onNavigate(index! + 1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [image, index, hasPrev, hasNext, onClose, onNavigate]);

  if (!image) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
    >
      <IconButton
        onClick={onClose}
        aria-label="Close"
        className="!absolute !right-4 !top-4 !text-white"
      >
        <CloseIcon />
      </IconButton>

      {hasPrev && (
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(index! - 1);
          }}
          aria-label="Previous photo"
          className="!absolute !left-4 !top-1/2 !-translate-y-1/2 !text-white"
        >
          <NavigateBeforeIcon />
        </IconButton>
      )}

      {hasNext && (
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(index! + 1);
          }}
          aria-label="Next photo"
          className="!absolute !right-4 !top-1/2 !-translate-y-1/2 !text-white"
        >
          <NavigateNextIcon />
        </IconButton>
      )}

      <figure className="max-h-full max-w-full" onClick={(e) => e.stopPropagation()}>
        <img
          src={image.url}
          alt={image.alt ?? ""}
          referrerPolicy="no-referrer"
          className="max-h-[85vh] max-w-full rounded-lg object-contain"
        />
        {image.credit && (
          <figcaption className="mt-2 text-center text-sm text-zinc-300">
            © {image.credit}
          </figcaption>
        )}
      </figure>
    </div>
  );
}
