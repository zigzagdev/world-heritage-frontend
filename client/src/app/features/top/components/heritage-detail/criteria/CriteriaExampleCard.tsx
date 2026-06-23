import type { WorldHeritageVm } from "../../../../../../domain/types.ts";
import { CriteriaTags } from "@shared/uis/CriteriaTags.tsx";
import { useText } from "@shared/locale/ui-text.ts";
import { useLocale } from "@shared/locale/LocaleHooks.ts";

export function CriteriaExampleCard({
  item,
  onClickItem,
}: {
  item: WorldHeritageVm;
  onClickItem: (id: number) => void;
}) {
  const text = useText();
  const { locale } = useLocale();

  const metadataLine = [
    text.region,
    text.regionLabels[item.region] ?? "—",
    "/",
    text.country,
    item.country,
    "/",
    text.category,
    text.categoryLabels[item.category] ?? "—",
    "/",
    text.yearInscribed,
    item.yearInscribed,
  ].join(" ");

  return (
    <li className="list-none rounded-2xl border border-zinc-200 bg-white/80 p-5 shadow-sm backdrop-blur">
      <h3 className="text-lg font-semibold text-zinc-900">{item.title}</h3>
      <p className="mt-2 line-clamp-3 text-sm text-zinc-600">{item.displayDescription}</p>
      <p className="mt-3 text-xs text-zinc-500">{metadataLine}</p>
      <div className="mt-3">
        <CriteriaTags criteria={item.criteria} locale={locale} />
      </div>
      <button
        onClick={() => onClickItem(item.id)}
        className="mt-4 text-sm font-medium text-blue-600 hover:underline"
      >
        {text.viewDetails}
      </button>
    </li>
  );
}
