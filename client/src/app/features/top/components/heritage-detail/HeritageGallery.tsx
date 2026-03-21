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
    <section
      id="gallery"
      className="rounded-3xl border border-zinc-200 bg-white px-5 py-6 md:px-8 md:py-8"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-lg md:text-xl font-extrabold tracking-tight text-zinc-900">
            Gallery
          </h2>
          <p className="mt-1 text-sm text-zinc-600">Photos and visual details of the site.</p>
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

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
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
            <figure className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
              <img
                src={img.url}
                alt={img.alt ?? ""}
                referrerPolicy="no-referrer"
                loading="lazy"
                className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              />

              <figcaption className="px-2 py-1.5">
                <span className="block truncate text-[11px] font-medium text-zinc-500">
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
