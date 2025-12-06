import type { WorldHeritageDetailVm } from "../types.ts";

type Props = {
  item: WorldHeritageDetailVm;
};

export function HeritageSidebar({ item }: Props) {
  const hasCoordinates = item.latitude != null && item.longitude != null;

  return (
    <aside className="heritage-detail__sidebar" aria-label="World heritage summary">
      <div className="heritage-detail__sidebar-card">
        <h2 className="heritage-detail__sidebar-title">Information</h2>
        <dl className="heritage-detail__definition-list">
          <div className="heritage-detail__definition-item">
            <dt>Country</dt>
            <dd>{item.country}</dd>
          </div>
          <div className="heritage-detail__definition-item">
            <dt>Region</dt>
            <dd>{item.region}</dd>
          </div>
          <div className="heritage-detail__definition-item">
            <dt>Year of inscription</dt>
            <dd>{item.yearInscribed}</dd>
          </div>
          <div className="heritage-detail__definition-item">
            <dt>Criteria</dt>
            <dd>{item.criteriaText}</dd>
          </div>
          <div className="heritage-detail__definition-item">
            <dt>Area</dt>
            <dd>{item.areaText}</dd>
          </div>
          <div className="heritage-detail__definition-item">
            <dt>Buffer zone</dt>
            <dd>{item.bufferText}</dd>
          </div>
          {hasCoordinates && (
            <div className="heritage-detail__definition-item">
              <dt>Coordinates</dt>
              <dd>
                {item.latitude}, {item.longitude}
              </dd>
            </div>
          )}
        </dl>

        {item.unescoSiteUrl && (
          <a
            href={item.unescoSiteUrl}
            target="_blank"
            rel="noreferrer"
            className="heritage-detail__unesco-link"
          >
            View on UNESCO
          </a>
        )}
      </div>
    </aside>
  );
}
