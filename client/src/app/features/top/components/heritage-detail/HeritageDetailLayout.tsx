import { useState } from "react";
import type { WorldHeritageDetailVm } from "../../types";
import { HeritageHero } from "./HeritageHero";
import { HeritageOverviewSection } from "./HeritageOverviewSection";
import { HeritageSidebar } from "./HeritageSidebar";
import { HeritageGallery } from "./HeritageGallery";
import type { Locale } from "../../../../../domain/criteria";
import { HeritageSubHeader } from "./HeritageSubHeader";

type Props = {
  item: WorldHeritageDetailVm;
  locale: Locale;
};

export function HeritageDetailLayout({ item, locale }: Props) {
  const [keyword, setKeyword] = useState("");

  const handleSubmit = () => {
    console.log("search:", keyword);
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <HeritageSubHeader title={item.title} onKeywordChange={setKeyword} onSearch={handleSubmit} />

      <HeritageHero item={item} locale={locale} />

      <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-6">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          <div className="space-y-5">
            <HeritageOverviewSection item={item} locale={locale} />
            <HeritageGallery images={item.images} />
          </div>
          <div className="lg:sticky lg:top-5">
            <HeritageSidebar item={item} locale={locale} />
          </div>
        </div>
      </main>
    </div>
  );
}
