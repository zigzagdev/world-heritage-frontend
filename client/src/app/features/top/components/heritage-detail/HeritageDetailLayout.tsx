import type { WorldHeritageDetailVm } from "../../types";
import "./heritage-detail.css";
import { HeritageHero } from "./HeritageHero";
import { HeritageOverviewSection } from "./HeritageOverviewSection.tsx";
import { HeritageSidebar } from "./HeritageSidebar.tsx";
import { HeritageGallery } from "./HeritageGallery";
import type { Locale } from "../../../../../domain/criteria.ts";

type Props = {
  item: WorldHeritageDetailVm;
  locale: Locale;
};

export function HeritageDetailLayout({ item, locale }: Props) {
  return (
    <div className="heritage-detail">
      <HeritageHero item={item} locale={locale} />

      <main className="heritage-detail__body">
        <div className="heritage-detail__main">
          <HeritageOverviewSection item={item} locale={locale} />
          <HeritageGallery images={item.images} />
        </div>

        <HeritageSidebar item={item} locale={locale} />
      </main>
    </div>
  );
}
