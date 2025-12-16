import type { WorldHeritageDetailVm } from "../../types";
import "./heritage-detail.css";
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
    <aside className="heritage-detail__sidebar" aria-label="Facts">
      <div className="heritage-detail__facts-card">
        <h2 className="heritage-detail__facts-title">Facts</h2>
        <HeritageMetadataList items={facts} />

        {item.unescoSiteUrl && (
          <a
            href={item.unescoSiteUrl}
            target="_blank"
            rel="noreferrer"
            className="heritage-detail__link heritage-detail__unesco-link"
          >
            View on UNESCO
          </a>
        )}
      </div>
      <div className="heritage-detail__map-card" aria-label="Map">
        <div className="heritage-detail__map-placeholder">Map</div>
      </div>
    </aside>
  );
}
