import type { WorldHeritageDetailVm } from "../../types";
import type { Locale } from "../../../../../domain/criteria";

type Props = {
  item: WorldHeritageDetailVm;
  locale: Locale;
};

export function HeritageOverviewSection({ item }: Props) {
  return (
    <section
      id="overview"
      className="rounded-2xl border border-zinc-200 bg-white shadow-sm px-5 py-5 md:px-6 md:py-6"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-extrabold tracking-wide text-zinc-900 mt-3">OVERVIEW</h2>

        {item.unescoSiteUrl && (
          <a
            href={item.unescoSiteUrl}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-semibold text-indigo-700 hover:underline"
          >
            View on UNESCO
          </a>
        )}
      </div>

      {item.shortDescription ? (
        <p className="mt-3 max-w-[70ch] whitespace-pre-wrap text-sm leading-7 text-zinc-700">
          {item.shortDescription}
        </p>
      ) : (
        <p className="mt-3 text-sm text-zinc-400">No overview available.</p>
      )}
    </section>
  );
}
