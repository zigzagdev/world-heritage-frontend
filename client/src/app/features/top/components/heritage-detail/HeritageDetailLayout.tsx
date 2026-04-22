import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { WorldHeritageDetailVm } from "../../../../../domain/types.ts";
import type { Locale } from "../../../../../domain/criteria";
import { HeritageSubHeader } from "../HeritageSubHeader.tsx";
import { type SearchValues } from "@features/top/components/HeritageSearchForm.tsx";
import { HeritageHero } from "./HeritageHero";
import { HeritageOverViewSection } from "./HeritageOverviewSection";
import { HeritageSidebar } from "./HeritageSidebar";
import { HeritageGallery } from "./HeritageGallery";
import { DetailHeritageMap } from "@features/top/components/heritage-detail/DetailHeritageMap.tsx";
import { textType } from "@shared/styles/typography";
import { useSetBreadcrumbLabel } from "@features/breadcrumbs/BreadCrumbHooks.ts";
import { BreadcrumbList } from "@shared/components/BreadcrumbList.tsx";

type Props = {
  item: WorldHeritageDetailVm;
  locale: Locale;
  toggleLocale: () => void;
};

const DEFAULT_SEARCH: SearchValues = {
  region: "",
  category: "",
  keyword: "",
  yearInscribedFrom: "",
  yearInscribedTo: "",
};

type TabItem = {
  label: string;
  href: `#${string}`;
};

const TABS: readonly TabItem[] = [
  { label: "Description", href: "#content" },
  { label: "Maps", href: "#geo-map" },
  { label: "Gallery", href: "#gallery" },
] as const;

const formatCriteriaInline = (criteria: string[] | undefined) =>
  criteria?.length ? criteria.map((c) => `(${c})`).join("") : "—";

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

// Key exam info: visible without scrolling on all screen sizes.
function KeyExamInfo({ item }: { item: WorldHeritageDetailVm }) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 mt-4">
      <div className="flex flex-wrap gap-x-6 gap-y-2">
        <div>
          <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wide">
            Region
          </div>
          <div className="text-sm font-semibold text-zinc-900">{item.region ?? "—"}</div>
        </div>
        <div>
          <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wide">
            Category
          </div>
          <div className="text-sm font-semibold text-zinc-900">{item.category ?? "—"}</div>
        </div>
        <div>
          <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wide">
            Year Inscribed
          </div>
          <div className="text-sm font-semibold text-zinc-900">{item.yearInscribed ?? "—"}</div>
        </div>
        <div>
          <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wide">
            Criteria
          </div>
          <div className="text-sm font-semibold text-zinc-900">
            {formatCriteriaInline(item.criteria)}
          </div>
        </div>
      </div>
    </div>
  );
}

export function HeritageDetailLayout({ item, locale, toggleLocale }: Props) {
  const [search, setSearch] = useState<SearchValues>(DEFAULT_SEARCH);
  const setLabel = useSetBreadcrumbLabel();
  const navigate = useNavigate();

  const handleSubmit = (q: Partial<SearchValues>) => {
    const next = { ...search, ...q };
    setSearch(next);

    const params = new URLSearchParams();
    if (next.keyword) params.set("search_query", next.keyword);
    if (next.region) params.set("region", next.region);
    if (next.category) params.set("category", next.category);
    if (next.yearInscribedFrom) params.set("year_inscribed_from", next.yearInscribedFrom);
    if (next.yearInscribedTo) params.set("year_inscribed_to", next.yearInscribedTo);

    navigate(`/heritages/results?${params.toString()}`);
  };

  useEffect(() => {
    if (item.id && item.name) {
      setLabel(`/heritages/${item.id}`, item.name);
    }
  }, [item.id, item.name, setLabel]);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <HeritageSubHeader value={search} onChange={setSearch} onSubmit={handleSubmit} />

      <div className="mx-auto w-full max-w-6xl px-4 mt-6 md:mt-8 flex items-center justify-between">
        <HeritageDetailTabs items={TABS} />
        <button
          onClick={toggleLocale}
          className="rounded-full border border-zinc-200 px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 shrink-0"
        >
          {locale === "ja" ? "🇯🇵" : "🇬🇧"}
        </button>
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 mt-4">
        <BreadcrumbList />
      </div>

      {/* Hero image */}
      <HeritageHero item={item} locale={locale} />

      {/* Key exam info: always visible */}
      <KeyExamInfo item={item} />

      {/* Map: mobile only (PC shows in sidebar) */}
      <div className="mx-auto w-full max-w-6xl px-4 mt-6 lg:hidden" id="geo-map">
        <DetailHeritageMap latitude={item.latitude} longitude={item.longitude} />
      </div>

      <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-8">
        <div className="grid gap-6 lg:gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          {/* Left: Overview → Gallery */}
          <div className="space-y-8" id="content">
            <HeritageOverViewSection item={item} locale={locale} />
            <HeritageGallery images={item.images} />
          </div>

          {/* Right: Sidebar (PC only) */}
          <div className="lg:sticky lg:top-24">
            <HeritageSidebar item={item} />
          </div>
        </div>
      </main>
    </div>
  );
}
