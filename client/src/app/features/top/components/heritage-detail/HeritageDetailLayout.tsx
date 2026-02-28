import { useState } from "react";
import type { WorldHeritageDetailVm } from "../../../../../domain/types.ts";
import type { Locale } from "../../../../../domain/criteria";
import { HeritageSubHeader, type SearchValues } from "../HeritageSubHeader.tsx";
import { HeritageHero } from "./HeritageHero";
import { HeritageOverviewSection } from "./HeritageOverviewSection";
import { HeritageSidebar } from "./HeritageSidebar";
import { HeritageGallery } from "./HeritageGallery";

type Props = {
  item: WorldHeritageDetailVm;
  locale: Locale;
};

const DEFAULT_SEARCH: SearchValues = {
  region: "",
  category: "",
  keyword: "",
};

export function HeritageDetailLayout({ item, locale }: Props) {
  const [search, setSearch] = useState<SearchValues>(DEFAULT_SEARCH);

  const handleSubmit = (q: Partial<SearchValues>) => {
    const next = { ...search, ...q };
    setSearch(next);
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <HeritageSubHeader value={search} onChange={setSearch} onSubmit={handleSubmit} />

      <HeritageHero item={item} locale={locale} />

      <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-6">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          <div className="space-y-5">
            <HeritageOverviewSection item={item} locale={locale} />
            <HeritageGallery images={item.images} />
          </div>
          <div className="lg:sticky lg:top-5">
            <HeritageSidebar item={item} />
          </div>
        </div>
      </main>
    </div>
  );
}
