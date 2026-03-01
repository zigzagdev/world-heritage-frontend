import { useState } from "react";
import type { WorldHeritageDetailVm } from "../../../../../domain/types.ts";
import type { Locale } from "../../../../../domain/criteria";
import { HeritageSubHeader, type SearchValues } from "../HeritageSubHeader.tsx";
import { HeritageHero } from "./HeritageHero";
import { HeritageOverViewSection } from "./HeritageOverviewSection";
import { HeritageSidebar } from "./HeritageSidebar";
import { HeritageGallery } from "./HeritageGallery";
import { textType } from "@shared/styles/typography";

type Props = {
  item: WorldHeritageDetailVm;
  locale: Locale;
};

const DEFAULT_SEARCH: SearchValues = {
  region: "",
  category: "",
  keyword: "",
};

type TabItem = {
  label: string;
  href: `#${string}`;
};

const TABS: readonly TabItem[] = [
  { label: "Description", href: "#content" },
  { label: "Maps", href: "#geo-map" },
  { label: "Documents", href: "#documents" },
  { label: "Gallery", href: "#gallery" },
] as const;

function HeritageDetailTabs({ items }: { items: readonly TabItem[] }) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 mt-6 md:mt-8">
      <nav
        aria-label="Heritage sections"
        className={`flex gap-6 overflow-x-auto border-b border-sky-200 ${textType.body} font-semibold`}
      >
        {items.map((t) => (
          <a
            key={t.href}
            href={t.href}
            className="whitespace-nowrap py-3 text-sky-700 border-b-2 border-transparent hover:text-sky-900 hover:border-sky-500"
          >
            {t.label}
          </a>
        ))}
      </nav>
    </div>
  );
}

export function HeritageDetailLayout({ item, locale }: Props) {
  const [search, setSearch] = useState<SearchValues>(DEFAULT_SEARCH);

  const handleSubmit = (q: Partial<SearchValues>) => {
    const next = { ...search, ...q };
    setSearch(next);
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <HeritageSubHeader value={search} onChange={setSearch} onSubmit={handleSubmit} />

      <HeritageDetailTabs items={TABS} />
      <HeritageHero item={item} locale={locale} />
      <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-10 md:pt-12">
        <div className="grid gap-6 lg:gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          <div className="space-y-10 md:space-y-12">
            <HeritageOverViewSection item={item} />
            <HeritageGallery images={item.images} />
          </div>

          <div className="lg:sticky lg:top-24">
            <HeritageSidebar item={item} />
          </div>
        </div>
      </main>
    </div>
  );
}
