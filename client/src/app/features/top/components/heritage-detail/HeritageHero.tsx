import type { WorldHeritageDetailVm, WorldHeritageImageVm } from "../../types";
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
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-900">
          {item.title}
          {item.nameJp && (
            <span className="ml-2 text-xl md:text-2xl font-bold text-zinc-500">
              （{item.nameJp}）
            </span>
          )}
        </h1>

        {item.subtitle && <p className="mt-2 text-sm font-medium text-zinc-700">{item.subtitle}</p>}
      </div>

      <div className="mt-6">
        {primaryImage ? (
          <figure>
            <div className="overflow-hidden flex items-center">
              <img
                src={primaryImage.url}
                alt={primaryImage.alt ?? ""}
                loading="lazy"
                className="h-64 w-auto object-contain transform origin-bottom-right scale-[1.06] md:h-[600px]"
              />
            </div>

            {(primaryImage.credit || item.unescoSiteUrl) && (
              <figcaption className="mt-2 flex items-center justify-between gap-3 text-[11px] text-zinc-500">
                <span className="truncate">
                  {primaryImage.credit ? `© ${primaryImage.credit}` : ""}
                </span>

                {item.unescoSiteUrl && (
                  <a
                    href={item.unescoSiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 font-semibold text-indigo-700 hover:underline"
                  >
                    View on UNESCO
                  </a>
                )}
              </figcaption>
            )}
          </figure>
        ) : (
          <div className="rounded-2xl border border-dashed border-zinc-200 bg-white p-6 text-sm text-zinc-500">
            No image available.
          </div>
        )}
      </div>
    </header>
  );
}
