import { useLocale } from "./LocaleHooks.ts";

export function LocaleToggle() {
  const { locale, toggleLocale } = useLocale();
  return (
    <button
      type="button"
      onClick={toggleLocale}
      aria-label="Toggle locale"
      className="rounded-full border border-zinc-200 px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 shrink-0"
    >
      {locale === "ja" ? "🇯🇵" : "🇬🇧"}
    </button>
  );
}
