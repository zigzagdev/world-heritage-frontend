import CloseIcon from "@mui/icons-material/Close";
import IconButton from "./Icon-Button.tsx";
import type { WorldHeritageImageVm } from "../../domain/types.ts";

type LightboxImage = Pick<WorldHeritageImageVm, "id" | "url" | "alt" | "credit">;

export function Lightbox({ image, onClose }: { image: LightboxImage | null; onClose: () => void }) {
  if (!image) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
    >
      <IconButton
        onClick={onClose}
        aria-label="Close"
        className="!absolute !right-4 !top-4 !text-white"
      >
        <CloseIcon />
      </IconButton>
    </div>
  );
}
