import type { WorldHeritageDetailVm } from "../../types";
import "./heritage-detail.css";
import { HeritageMetadataList } from "./HeritageMetadataList";

type Props = {
  item: WorldHeritageDetailVm;
};

export function HeritageSidebar({ item }: Props) {
  const items = [
    { label: "Country", value: item.country },
    { label: "Region", value: item.region },
    { label: "Year of inscription", value: item.yearInscribed },
    { label: "Criteria", value: item.criteriaText || "—" },
    { label: "Area", value: item.areaText },
    { label: "Buffer zone", value: item.bufferText },
    {
      label: "Coordinates",
      value:
        item.latitude != null && item.longitude != null
          ? `${item.latitude.toFixed(4)}, ${item.longitude.toFixed(4)}`
          : "—",
      hidden: item.latitude == null && item.longitude == null,
    },
  ] as const;

  return (
    <aside className="heritage-detail__sidebar" aria-label="Summary">
      <div className="heritage-detail__sidebar-card">
        <h2 className="heritage-detail__sidebar-title">Info</h2>

        <HeritageMetadataList items={items} />

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
    </aside>
  );
}
