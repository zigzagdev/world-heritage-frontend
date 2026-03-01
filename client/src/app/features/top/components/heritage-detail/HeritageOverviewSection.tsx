import type { WorldHeritageDetailVm } from "../../../../../domain/types.ts";
import { textType } from "@shared/styles/typography.ts";

type Props = {
  item: WorldHeritageDetailVm;
};

export function HeritageOverViewSection({ item }: Props) {
  return (
    <section
      id="overview"
      className="rounded-3xl border border-zinc-200 bg-white shadow-sm px-5 py-6 md:px-8 md:py-8"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className={`${textType.h2} text-zinc-900`}>Overview</h2>
        </div>

        {item.unescoSiteUrl && (
          <a
            href={item.unescoSiteUrl}
            target="_blank"
            rel="noreferrer"
            className="shrink-0 rounded-full border border-sky-200 bg-sky-50
            px-3 py-1.5 text-xs font-semibold text-sky-900 hover:bg-sky-100"
          >
            View on UNESCO
          </a>
        )}
      </div>

      {item.shortDescription ? (
        <p className={`${textType.body} ${textType.measure} mt-4 whitespace-pre-wrap`}>
          {item.shortDescription}
        </p>
      ) : (
        <p className={`${textType.body} mt-4 text-zinc-400`}>—</p>
      )}
    </section>
  );
}
