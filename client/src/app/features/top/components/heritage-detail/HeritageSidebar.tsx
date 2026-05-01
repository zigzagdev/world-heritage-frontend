import type { WorldHeritageDetailVm } from "../../../../../domain/types.ts";
import { DetailHeritageMap } from "@features/top/components/heritage-detail/DetailHeritageMap.tsx";
import { HeritageMetadataList } from "./HeritageMetadataList.tsx";
import { useText } from "@shared/locale/ui-text.ts";

const formatCriteriaInline = (criteria: string[] | undefined) =>
  criteria?.length ? criteria.map((c) => `(${c})`).join("") : "—";

const isZeroCoord = (lat: number | null | undefined, lng: number | null | undefined) =>
  lat != null && lng != null && lat === 0 && lng === 0;

const formatLatitude = (lat: number): string => {
  const direction = lat >= 0 ? "N" : "S";
  return `${Math.abs(lat).toFixed(4)}° ${direction}`;
};

const formatLongitude = (lng: number): string => {
  const direction = lng >= 0 ? "E" : "W";
  return `${Math.abs(lng).toFixed(4)}° ${direction}`;
};

export function HeritageSidebar({ item }: { item: WorldHeritageDetailVm }) {
  const text = useText();
  const hasCoord =
    item.latitude != null && item.longitude != null && !isZeroCoord(item.latitude, item.longitude);

  const metadataItems = [
    { label: text.country, value: item.country ?? "—" },
    ...(item.stateParty ? [{ label: text.stateParty, value: item.stateParty }] : []),
    { label: text.category, value: item.category ?? "—" },
    { label: text.endangered, value: item.isEndangered ? text.yes : text.no },
    { label: text.region, value: item.region ?? "—" },
    { label: text.yearInscribed, value: item.yearInscribed ?? "—" },
    { label: text.criteria, value: formatCriteriaInline(item.criteria) },
    { label: text.propertyArea, value: item.areaText ?? "—" },
    { label: text.bufferZone, value: item.bufferText ?? "—" },
    ...(hasCoord
      ? [
          { label: text.latitude, value: formatLatitude(item.latitude!) },
          { label: text.longitude, value: formatLongitude(item.longitude!) },
        ]
      : []),
  ];

  return (
    <aside aria-label="Facts" className="flex flex-col gap-4">
      <div className="hidden lg:block rounded-3xl overflow-hidden">
        <DetailHeritageMap latitude={item.latitude} longitude={item.longitude} />
      </div>

      {/* Heritage Data */}
      <div className="rounded-3xl border border-zinc-200 bg-white/80 shadow-sm backdrop-blur overflow-hidden">
        <div className="px-5 py-4 text-base font-extrabold tracking-tight text-zinc-900">
          {text.heritageData}
        </div>

        <div className="border-t border-zinc-100 px-5 py-4 space-y-3">
          <HeritageMetadataList items={metadataItems} />

          {item.unescoSiteUrl && (
            <a
              href={item.unescoSiteUrl}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={text.viewOnUnesco}
              className="mt-4 inline-flex w-full items-center justify-center rounded-xl
               border border-sky-200 bg-sky-50 px-3 py-2 text-sm font-semibold
               text-sky-900 hover:bg-sky-100"
            >
              {text.viewOnUnesco}
            </a>
          )}
        </div>
      </div>
    </aside>
  );
}
