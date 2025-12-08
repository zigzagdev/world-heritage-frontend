import type { WorldHeritageDetailVm } from "../types";
import "./heritage-detail.css";
import { HeroImage } from "./HeroImage";
import { HeritageGallery } from "./HeritageGallery";

type Props = {
  item: WorldHeritageDetailVm;
};

export function HeritageDetailLayout({ item }: Props) {
  const primaryImage = item.images.find((img) => img.isPrimary) ?? item.images[0];

  return (
    <div className="heritage-detail">
      <header className="heritage-detail__header">
        <div className="heritage-detail__title-block">
          <h1 className="heritage-detail__title">
            {item.title}
            {item.nameJp && <span className="heritage-detail__subtitle-jp">（{item.nameJp}）</span>}
          </h1>
          <p className="heritage-detail__subtitle">{item.subtitle}</p>

          <div className="heritage-detail__meta-chips">
            <span className="chip chip--category">{item.category}</span>
            {item.stateParty && <span className="chip chip--country">{item.stateParty}</span>}
            {item.yearInscribed && (
              <span className="chip chip--year">Inscribed: {item.yearInscribed}</span>
            )}
            {item.isEndangered && <span className="chip chip--danger">Endangered</span>}
          </div>
        </div>

        {primaryImage && (
          <figure className="heritage-detail__hero">
            <HeroImage src={primaryImage.url} alt={primaryImage.alt} />
            {(primaryImage.credit || item.unescoSiteUrl) && (
              <figcaption className="heritage-detail__hero-caption">
                {primaryImage.credit && <span>© {primaryImage.credit}</span>}
                {item.unescoSiteUrl && (
                  <a
                    href={item.unescoSiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="heritage-detail__link"
                  >
                    View on UNESCO
                  </a>
                )}
              </figcaption>
            )}
          </figure>
        )}
      </header>

      <main className="heritage-detail__body">
        <div className="heritage-detail__main">
          <section className="heritage-detail__section">
            <h2 className="heritage-detail__section-title">Overview</h2>
            <p className="heritage-detail__description">{item.shortDescription}</p>
          </section>

          <section className="heritage-detail__section">
            <h3 className="heritage-detail__subsection-title">Criteria</h3>
            <p className="heritage-detail__text">{item.criteriaText || "—"}</p>
          </section>

          <section className="heritage-detail__section">
            <h3 className="heritage-detail__subsection-title">Area &amp; Buffer zone</h3>
            <dl className="heritage-detail__definition-list">
              <div className="heritage-detail__definition-item">
                <dt>Area</dt>
                <dd>{item.areaText}</dd>
              </div>
              <div className="heritage-detail__definition-item">
                <dt>Buffer zone</dt>
                <dd>{item.bufferText}</dd>
              </div>
            </dl>
          </section>

          {item.isEndangered && (
            <section className="heritage-detail__section heritage-detail__section--danger">
              <h3 className="heritage-detail__subsection-title">Danger status</h3>
              <p className="heritage-detail__danger-text">
                This property is inscribed on the List of World Heritage in Danger.
              </p>
            </section>
          )}

          <section className="heritage-detail__section">
            <h2 className="heritage-detail__section-title">Location</h2>
            <dl className="heritage-detail__definition-list">
              <div className="heritage-detail__definition-item">
                <dt>Country</dt>
                <dd>{item.country}</dd>
              </div>
              <div className="heritage-detail__definition-item">
                <dt>Region</dt>
                <dd>{item.region}</dd>
              </div>
              {(item.latitude != null || item.longitude != null) && (
                <div className="heritage-detail__definition-item">
                  <dt>Coordinates</dt>
                  <dd>
                    {item.latitude != null && item.longitude != null
                      ? `${item.latitude.toFixed(4)}, ${item.longitude.toFixed(4)}`
                      : "—"}
                  </dd>
                </div>
              )}
            </dl>
          </section>
          <HeritageGallery images={item.images} />
        </div>

        <aside className="heritage-detail__sidebar" aria-label="Summary">
          <div className="heritage-detail__sidebar-card">
            <h2 className="heritage-detail__sidebar-title">Info</h2>
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
                <dd>{item.criteriaText || "—"}</dd>
              </div>
              <div className="heritage-detail__definition-item">
                <dt>Area</dt>
                <dd>{item.areaText}</dd>
              </div>
              <div className="heritage-detail__definition-item">
                <dt>Buffer zone</dt>
                <dd>{item.bufferText}</dd>
              </div>
              {(item.latitude != null || item.longitude != null) && (
                <div className="heritage-detail__definition-item">
                  <dt>Coordinates</dt>
                  <dd>
                    {item.latitude != null && item.longitude != null
                      ? `${item.latitude.toFixed(4)}, ${item.longitude.toFixed(4)}`
                      : "—"}
                  </dd>
                </div>
              )}
            </dl>

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
      </main>
    </div>
  );
}
