import type { WorldHeritageDetailVm } from "../../../../../domain/types.ts";
import { HeritageMetadataList } from "./HeritageMetadataList";

type Props = {
  item: WorldHeritageDetailVm;
};

const formatCriteriaInline = (criteria: string[] | undefined) =>
  criteria?.length ? criteria.map((c) => `(${c})`).join("") : "—";

const isZeroCoord = (lat: number | null | undefined, lng: number | null | undefined) =>
  lat != null && lng != null && lat === 0 && lng === 0;

const formatCoordinates = (lat: number | null | undefined, lng: number | null | undefined) => {
  if (lat == null || lng == null) return "—";
  if (isZeroCoord(lat, lng)) return "—";
  return `${lat.toFixed(4)} ${lng.toFixed(4)}`;
};

function GroupTitle({ children }: { children: React.ReactNode }) {
  return <div className="text-[11px] font-extrabold tracking-wide text-zinc-500">{children}</div>;
}

function CardTitle({ children }: { children: React.ReactNode }) {
  return <div className="text-sm font-extrabold tracking-wide text-zinc-900">{children}</div>;
}

export function HeritageSidebar({ item }: Props) {
  const identity = [
    { label: "Country", value: item.country ?? "—" },
    ...(item.stateParty ? [{ label: "State Party", value: item.stateParty }] : []),
    { label: "Category", value: item.category ?? "—" },
    { label: "Endangered", value: item.isEndangered ? "Yes" : "No" },
  ] as const;

  const geography = [
    { label: "Region", value: item.region ?? "—" },
    {
      label: "Coordinates",
      value: formatCoordinates(item.latitude, item.longitude),
      hidden:
        (item.latitude == null && item.longitude == null) ||
        isZeroCoord(item.latitude ?? null, item.longitude ?? null),
    },
  ] as const;

  const inscription = [
    { label: "Year inscribed", value: item.yearInscribed ?? "—" },
    { label: "Criteria", value: formatCriteriaInline(item.criteria) },
    { label: "Property area", value: item.areaText ?? "—" },
    { label: "Buffer zone", value: item.bufferText ?? "—" },
  ] as const;

  return (
    <aside aria-label="Facts" className="flex flex-col gap-6">
      <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
        <div className="px-5 py-4">
          <CardTitle>Heritage Data</CardTitle>
        </div>

        <div className="border-t border-zinc-100 p-5 space-y-5">
          <div className="space-y-2">
            <GroupTitle>IDENTITY</GroupTitle>
            <HeritageMetadataList items={identity} />
          </div>

          <div className="space-y-2">
            <GroupTitle>GEOGRAPHY</GroupTitle>
            <HeritageMetadataList items={geography} />
          </div>

          <div className="space-y-2">
            <GroupTitle>INSCRIPTION</GroupTitle>
            <HeritageMetadataList items={inscription} />
          </div>
          {item.unescoSiteUrl && (
            <a
              href={item.unescoSiteUrl}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="View on UNESCO"
              className="mt-2 inline-flex w-full items-center justify-center rounded-xl
               border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold
               text-zinc-800 hover:bg-zinc-50"
            >
              View on UNESCO
            </a>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm p-4">
        <div className="text-sm font-bold text-zinc-900">Map</div>
        <div className="mt-3 grid h-40 place-items-center rounded-xl bg-zinc-100 text-sm font-medium text-zinc-500">
          Map
        </div>
      </div>
    </aside>
  );
}
