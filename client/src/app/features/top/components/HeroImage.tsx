import React from "react";

type HeroImageProps = {
  src: string;
  alt: string;
  credit?: string | null;
  unescoUrl?: string | null;
};

export const HeroImage: React.FC<HeroImageProps> = ({ src, alt, credit, unescoUrl }) => (
  <figure className="heritage-detail__hero">
    <img src={src} alt={alt} className="heritage-detail__hero-image" />

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
