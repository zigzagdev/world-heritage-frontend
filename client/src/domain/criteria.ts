import en from "../locals/en/world-heritage-criteria.json";
import ja from "../locals/ja/world-heritage-criteria.json";
import { type CriteriaCode } from "./types.ts";

export type CriteriaText = {
  title: string;
  description: string;
};

export const CRITERIA_CODES = [
  "i",
  "ii",
  "iii",
  "iv",
  "v",
  "vi",
  "vii",
  "viii",
  "ix",
  "x",
] as const;

export type CriteriaDict = Record<CriteriaCode, CriteriaText>;

export const LOCALES = ["en", "ja"] as const;
export type Locale = (typeof LOCALES)[number];

export const UNESCO_CRITERIA_SOURCE_URL = "https://whc.unesco.org/en/criteria/";
const CRITERIA_BY_LOCALE: Record<Locale, CriteriaDict> = {
  en: en as CriteriaDict,
  ja: ja as CriteriaDict,
};

export const getCriteriaDict = (locale: Locale): CriteriaDict => CRITERIA_BY_LOCALE[locale];

export const getCriteria = (code: CriteriaCode, locale: Locale): CriteriaText => {
  const entry = CRITERIA_BY_LOCALE[locale]?.[code];
  if (entry) return entry;

  const fallback = CRITERIA_BY_LOCALE.en?.[code];
  if (fallback) return fallback;

  return { title: code, description: "" };
};

export const isCriteriaCode = (v: string): v is CriteriaCode => {
  return (CRITERIA_CODES as readonly string[]).includes(v);
};
