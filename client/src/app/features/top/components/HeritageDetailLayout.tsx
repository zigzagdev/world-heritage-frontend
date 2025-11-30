import type { WorldHeritageDetailVm } from "../types";

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
            <img
              src={primaryImage.url}
              alt={primaryImage.alt}
              className="heritage-detail__hero-image"
            />
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
        <section className="heritage-detail__section">
          <h2 className="heritage-detail__section-title">Overview</h2>
          <p className="heritage-detail__description">{item.shortDescription}</p>

          <dl className="heritage-detail__definition-list">
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
          </dl>
        </section>

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

        {item.images.length > 1 && (
          <section className="heritage-detail__section">
            <h2 className="heritage-detail__section-title">Gallery</h2>
            <div className="heritage-detail__gallery">
              {item.images.map((img) => (
                <figure
                  key={img.id}
                  className={`heritage-detail__thumbnail${
                    img.isPrimary ? " heritage-detail__thumbnail--primary" : ""
                  }`}
                >
                  <img src={img.url} alt={img.alt} className="heritage-detail__thumbnail-image" />
                  <figcaption className="heritage-detail__thumbnail-caption">
                    {img.isPrimary && <span className="badge badge--primary">Primary</span>}
                    {img.credit && <span className="credit">© {img.credit}</span>}
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
