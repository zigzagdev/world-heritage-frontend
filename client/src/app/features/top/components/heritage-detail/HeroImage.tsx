import type { FC } from "react";

export const HeroImage: FC<{
  src: string;
  alt: string;
  credit?: string | null;
  unescoUrl?: string | null;
}> = ({ src, alt, credit, unescoUrl }) => (
  <figure className="heritage-detail__hero">
    <img src={src} alt={alt} className="heritage-detail__hero-image" referrerPolicy="no-referrer" />

    {(credit || unescoUrl) && (
      <figcaption className="heritage-detail__hero-caption">
        {credit && <span>© {credit}</span>}
        {unescoUrl && (
          <a href={unescoUrl} target="_blank" rel="noreferrer" className="heritage-detail__link">
            View on UNESCO
          </a>
        )}
      </figcaption>
    )}
  </figure>
);
