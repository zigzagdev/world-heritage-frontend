import type { WorldHeritageImageVm } from "../../../../../domain/types.ts";
import { Button } from "@shared/uis/Button.tsx";

type Props = {
  images: WorldHeritageImageVm[];
  previewCount?: number;
  onOpenGallery?: () => void;
  onSelectImage?: (img: Pick<WorldHeritageImageVm, "id" | "url" | "alt" | "credit">) => void;
};

export function HeritageGallery({ images, previewCount = 6, onOpenGallery, onSelectImage }: Props) {
  if (!images?.length) return null;

  const hasMore = images.length > previewCount;
  const preview = images.slice(0, previewCount);

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white shadow-sm px-5 py-5 md:px-6 md:py-6">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-sm font-extrabold tracking-wide text-zinc-900">GALLERY</h2>
        </div>

        {hasMore && (
          <Button
            type="button"
            size="sm"
            onClick={onOpenGallery}
            className="shrink-0 rounded-full"
            aria-label="See all photos"
          >
            See all
          </Button>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {preview.map((img) => (
          <button
            key={img.id}
            type="button"
            onClick={() =>
              onSelectImage?.({ id: img.id, url: img.url, alt: img.alt, credit: img.credit })
            }
            className="group text-left"
            aria-label={img.alt ? `Open photo: ${img.alt}` : "Open photo"}
            title={img.alt ?? "Open photo"}
          >
            <figure className="overflow-hidden border border-zinc-200 bg-white">
              <img
                src={img.url}
                alt={img.alt ?? ""}
                loading="lazy"
                className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              />

              <figcaption className="flex items-center justify-between">
                <span className="truncate text-[11px] font-medium text-zinc-500">
                  {img.credit ? `© ${img.credit}` : " "}
                </span>
              </figcaption>
            </figure>
          </button>
        ))}
      </div>

      {hasMore && (
        <div className="mt-4 text-xs font-medium text-zinc-500">
          Showing {preview.length} of {images.length} photos
        </div>
      )}
    </section>
  );
}
