import { useText } from "@shared/locale/ui-text.ts";

export function TopPageHero() {
  const text = useText();

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-indigo-800 to-blue-900">
      <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-indigo-700/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-blue-700/30 blur-3xl" />

      <div className="relative mx-auto flex h-[300px] max-w-7xl flex-col items-center justify-center px-4 text-center md:h-[400px]">
        <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-5xl">
          {text.heroHeadline}
        </h2>
        <p className="mt-4 max-w-xl text-base text-indigo-200 md:text-lg">{text.heroSubheadline}</p>
        <a
          href="#heritage-list"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-indigo-700 shadow-lg transition-colors hover:bg-indigo-50"
        >
          {text.heroCtaLabel} ↓
        </a>
      </div>
    </div>
  );
}
