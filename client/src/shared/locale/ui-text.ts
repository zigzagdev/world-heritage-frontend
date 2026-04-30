import en from "../../locals/en/ui.json";
import ja from "../../locals/ja/ui.json";
import { type Locale } from "../../domain/criteria.ts";
import { useLocale } from "./LocaleHooks.ts";

export type UiText = typeof en;

const TEXTS: Record<Locale, UiText> = { en, ja };

export const useText = (): UiText => {
  const { locale } = useLocale();
  return TEXTS[locale];
};
