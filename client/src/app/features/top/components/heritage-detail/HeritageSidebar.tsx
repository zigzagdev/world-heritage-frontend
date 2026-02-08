import type { WorldHeritageDetailVm } from "../../types";
import { HeritageMetadataList } from "./HeritageMetadataList";
import type { Locale } from "../../../../../domain/criteria";

type Props = {
  item: WorldHeritageDetailVm;
  locale: Locale;
};

const formatCriteriaInline = (criteria: string[] | undefined) =>
  criteria?.length ? criteria.map((c) => `(${c})`).join("") : "—";

export function HeritageSidebar({ item }: Props) {
  const facts = [
    { label: "Country", value: item.country ?? "—" },
    { label: "Date of inscription", value: item.yearInscribed ?? "—" },
    { label: "Criteria", value: formatCriteriaInline(item.criteria) },
    { label: "Property", value: item.areaText ?? "—" },
    { label: "Buffer zone", value: item.bufferText ?? "—" },
    {
      label: "Coordinates",
      value:
        item.latitude != null && item.longitude != null
          ? `${item.latitude.toFixed(4)} ${item.longitude.toFixed(4)}`
          : "—",
      hidden: item.latitude == null && item.longitude == null,
    },
  ] as const;

  return (
    <aside aria-label="Facts" className="flex flex-col gap-6">
      <details className="group grid gap-4" open>
        <div className="rounded-2xl border gap-4 border-zinc-200 bg-white shadow-sm overflow-hidden">
          <summary
            className="flex cursor-pointer list-none items-center justify-between
            px-4 py-3 hover:bg-zinc-50 lg:cursor-default"
          >
            <div className="text-sm font-extrabold tracking-wide text-zinc-900">Status</div>

            <span className="text-zinc-400 transition-transform group-open:rotate-180 lg:hidden">
              ▾
            </span>
          </summary>
          <div className="border-t border-zinc-100 p-5">
            <HeritageMetadataList items={facts} />

            {item.unescoSiteUrl && (
              <a
                href={item.unescoSiteUrl}
                target="_blank"
                rel="noreferrer"
                className="
            mt-4 inline-flex w-full items-center justify-center rounded-xl
            border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-800
            hover:bg-zinc-50
          "
              >
                View on UNESCO
              </a>
            )}
          </div>
        </div>
      </details>
      <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm p-4 gap-3">
        <div className="text-sm font-bold text-zinc-900">Map</div>
        <div className="mt-3 grid h-40 place-items-center rounded-xl bg-zinc-100 text-sm font-medium text-zinc-500">
          Map
        </div>
      </div>
    </aside>
  );
}
