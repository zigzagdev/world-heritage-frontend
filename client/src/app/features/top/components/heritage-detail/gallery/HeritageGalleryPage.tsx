import type { WorldHeritageImageVm } from "../../../../../../domain/types.ts";
import { Lightbox } from "../Lightbox.tsx";

export function HeritageGalleryPage({
  title,
  images,
  lightboxIndex,
  onSelectImage,
  onCloseLightbox,
  onNavigateLightbox,
  onBack,
}: {
  title: string;
  images: WorldHeritageImageVm[];
  lightboxIndex: number | null;
  onSelectImage: (index: number) => void;
  onCloseLightbox: () => void;
  onNavigateLightbox: (index: number) => void;
  onBack: () => void;
}) {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12">
      <button onClick={onBack} className="text-sm text-blue-600 hover:underline">
        ← {title}
      </button>

      <h1 className="mt-2 text-2xl font-semibold">Gallery</h1>
      <p className="mt-1 text-sm text-zinc-600">{images.length} photos</p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((img, index) => (
          <button
            key={img.id}
            type="button"
            onClick={() => onSelectImage(index)}
            className="group text-left"
            aria-label={img.alt ? `Open photo: ${img.alt}` : "Open photo"}
            title={img.alt ?? "Open photo"}
          >
            <figure className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
              <img
                src={img.url}
                alt={img.alt ?? ""}
                referrerPolicy="no-referrer"
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

      <Lightbox
        images={images}
        index={lightboxIndex}
        onClose={onCloseLightbox}
        onNavigate={onNavigateLightbox}
      />
    </main>
  );
}
