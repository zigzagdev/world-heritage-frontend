import type { WorldHeritageDetailVm, WorldHeritageImageVm } from "../../types";
import { HeroImage } from "./HeroImage";
import "./heritage-detail.css";
import { CriteriaTags } from "@shared/uis/CriteriaTags.tsx";
import type { Locale } from "../../../../../domain/criteria.ts";

type Props = {
  item: WorldHeritageDetailVm;
  locale: Locale;
};

export function HeritageHero({ item, locale }: Props) {
  const primaryImage: WorldHeritageImageVm | undefined =
    item.images.find((img) => img.isPrimary) ?? item.images[0];

  return (
    <header className="heritage-detail__header">
      <div className="heritage-detail__title-block">
        <h1 className="heritage-detail__title">
          {item.title}
          {item.nameJp && <span className="heritage-detail__subtitle-jp">（{item.nameJp}）</span>}
        </h1>
        <p className="heritage-detail__subtitle">{item.subtitle}</p>

        <div className="heritage-detail__meta-chips">
          <CriteriaTags criteria={item.criteria} locale={locale} />
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
  );
}
