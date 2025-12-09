import type { WorldHeritageDetailVm } from "../../types";
import "./heritage-detail.css";
import { HeritageHero } from "./HeritageHero";
import { HeritageOverviewSection } from "./HeritageOverviewSection.tsx";
import { HeritageSidebar } from "./HeritageSidebar.tsx";
import { HeritageGallery } from "./HeritageGallery";

type Props = {
  item: WorldHeritageDetailVm;
};

export function HeritageDetailLayout({ item }: Props) {
  return (
    <div className="heritage-detail">
      <HeritageHero item={item} />

      <main className="heritage-detail__body">
        <div className="heritage-detail__main">
          <HeritageOverviewSection item={item} />
          <HeritageGallery images={item.images} />
        </div>

        <HeritageSidebar item={item} />
      </main>
    </div>
  );
}
