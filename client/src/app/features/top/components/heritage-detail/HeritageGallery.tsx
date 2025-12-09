import type { WorldHeritageImageVm } from "../../types";
import "./heritage-detail.css";

type Props = {
  images: WorldHeritageImageVm[];
};

export function HeritageGallery({ images }: Props) {
  if (images.length <= 1) return null;

  return (
    <section className="heritage-detail__section">
      <h2 className="heritage-detail__section-title">Gallery</h2>
      <div className="heritage-detail__gallery">
        {images.map((img) => (
          <figure
            key={img.id}
            className={
              "heritage-detail__thumb" + (img.isPrimary ? " heritage-detail__thumb--primary" : "")
            }
          >
            <img src={img.url} alt={img.alt} className="heritage-detail__thumb-image" />
            <figcaption className="heritage-detail__thumb-caption">
              <div className="heritage-detail__thumb-caption-left">
                {img.isPrimary && <span className="badge badge--primary">Primary</span>}
              </div>
              <div className="heritage-detail__thumb-caption-right">
                {img.credit && <span className="credit">© {img.credit}</span>}
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
