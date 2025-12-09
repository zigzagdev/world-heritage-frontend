import type { WorldHeritageDetailVm } from "../../types";
import "./heritage-detail.css";
import { HeritageMetadataList } from "./HeritageMetadataList";

type Props = {
  item: WorldHeritageDetailVm;
};

export function HeritageOverviewSection({ item }: Props) {
  return (
    <section className="heritage-detail__section" aria-labelledby="heritage-overview-heading">
      <h2 id="heritage-overview-heading" className="heritage-detail__section-title">
        Overview
      </h2>

      <p className="heritage-detail__description">{item.shortDescription}</p>

      <div className="heritage-detail__section">
        <h3 className="heritage-detail__subsection-title">Criteria</h3>
        <p className="heritage-detail__text">{item.criteriaText || "—"}</p>
      </div>

      <div className="heritage-detail__section">
        <h3 className="heritage-detail__subsection-title">Area &amp; Buffer zone</h3>
        <HeritageMetadataList
          items={[
            { label: "Area", value: item.areaText },
            { label: "Buffer zone", value: item.bufferText },
          ]}
        />
      </div>

      {item.isEndangered && (
        <div className="heritage-detail__section heritage-detail__section--danger">
          <h3 className="heritage-detail__subsection-title">Danger status</h3>
          <p className="heritage-detail__danger-text">
            This property is inscribed on the List of World Heritage in Danger.
          </p>
        </div>
      )}
    </section>
  );
}
