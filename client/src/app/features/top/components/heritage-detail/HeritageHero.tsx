import type { WorldHeritageDetailVm, WorldHeritageImageVm } from "../../../../../domain/types.ts";
import type { Locale } from "../../../../../domain/criteria.ts";

type Props = {
  item: WorldHeritageDetailVm;
  locale: Locale;
};

export function HeritageHero({ item }: Props) {
  const primaryImage: WorldHeritageImageVm | undefined =
    item.images.find((img) => img.isPrimary) ?? item.images[0];

  return (
    <header className="mx-auto w-full max-w-6xl px-4 pt-10 pb-6">
      <div className="mb-5 md:mb-6">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-900">
          {item.heritageNameJp}
          {item.name && (
            <span className="ml-2 text-xl md:text-2xl font-bold text-zinc-500">
              （{item.name}）
            </span>
          )}
        </h1>

        {item.subtitle && (
          <p className="mt-2 text-sm font-medium text-zinc-700 md:text-base">{item.subtitle}</p>
        )}
      </div>

      <div className="mt-6">
        {primaryImage ? (
          <figure>
            <div className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-950 shadow-sm">
              <img
                src={primaryImage.url}
                alt={primaryImage.alt ?? ""}
                referrerPolicy="no-referrer"
                loading="lazy"
                className="h-72 w-full object-cover md:h-[600px]"
              />
              {/* subtle gradient overlay */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent" />
              {primaryImage.credit && (
                <div className="absolute right-3 top-3 rounded-full bg-black/35 px-3 py-1 text-[11px] text-white/80 backdrop-blur">
                  © {primaryImage.credit}
                </div>
              )}
            </div>

            {(primaryImage.credit || item.unescoSiteUrl) && (
              <figcaption className="mt-3 flex items-center justify-between gap-3 text-[12px] text-zinc-500">
                <span className="truncate">
                  {primaryImage.credit ? `© ${primaryImage.credit}` : ""}
                </span>

                {item.unescoSiteUrl && (
                  <a
                    href={item.unescoSiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 font-semibold text-zinc-700 hover:underline"
                  >
                    View on UNESCO
                  </a>
                )}
              </figcaption>
            )}
          </figure>
        ) : (
          <div className="rounded-3xl border border-dashed border-zinc-200 bg-white p-10 text-sm text-zinc-500 shadow-sm">
            No image available.
          </div>
        )}
      </div>
    </header>
  );
}
