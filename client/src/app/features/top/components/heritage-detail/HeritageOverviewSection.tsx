import type { WorldHeritageDetailVm } from "../../types";
import "./heritage-detail.css";
import { HeritageMetadataList } from "./HeritageMetadataList";
import { CriteriaTags } from "@shared/uis/CriteriaTags.tsx";
import type { Locale } from "../../../../../domain/criteria.ts";

type Props = {
  item: WorldHeritageDetailVm;
  locale: Locale;
};

export function HeritageOverviewSection({ item, locale }: Props) {
  return (
    <section className="heritage-detail__section" aria-labelledby="heritage-overview-heading">
      <h2 id="heritage-overview-heading" className="heritage-detail__section-title">
        Overview
      </h2>

      {item.shortDescription && (
        <p className="heritage-detail__description">{item.shortDescription}</p>
      )}

      <section className="heritage-detail__subsection" aria-labelledby="heritage-criteria-heading">
        <h3 id="heritage-criteria-heading" className="heritage-detail__subsection-title">
          Criteria
        </h3>

        <div className="heritage-detail__chips">
          {item.criteria?.length ? (
            <CriteriaTags criteria={item.criteria} locale={locale} />
          ) : (
            <span className="heritage-detail__muted">—</span>
          )}
        </div>
      </section>

      <section className="heritage-detail__subsection" aria-labelledby="heritage-area-heading">
        <h3 id="heritage-area-heading" className="heritage-detail__subsection-title">
          Area &amp; Buffer zone
        </h3>

        <HeritageMetadataList
          items={[
            { label: "Area", value: item.areaText ?? "—" },
            { label: "Buffer zone", value: item.bufferText ?? "—" },
          ]}
        />
      </section>

      {item.isEndangered && (
        <section
          className="heritage-detail__subsection heritage-detail__subsection--danger"
          aria-labelledby="heritage-danger-heading"
        >
          <h3 id="heritage-danger-heading" className="heritage-detail__subsection-title">
            Danger status
          </h3>
          <p className="heritage-detail__danger-text">
            This property is inscribed on the List of World Heritage in Danger.
          </p>
        </section>
      )}
    </section>
  );
}
