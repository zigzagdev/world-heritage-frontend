import React, { createContext, useCallback, useMemo } from "react";
import type { ReactNode } from "react";
import { useSearchParams } from "react-router-dom";
import { LOCALES, type Locale } from "../../../domain/criteria.ts";

type LocaleContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
};

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

const isLocale = (value: string): value is Locale => LOCALES.some((l) => l === value);

const resolveLocale = (raw: string | null): Locale => {
  if (!raw) return "en";
  return isLocale(raw) ? raw : "en";
};

export const LocaleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const locale = useMemo(() => resolveLocale(searchParams.get("lang")), [searchParams]);

  const setLocale = useCallback(
    (next: Locale) => {
      setSearchParams(
        (prev) => {
          const updated = new URLSearchParams(prev);
          updated.set("lang", next);
          return updated;
        },
        { replace: false },
      );
    },
    [setSearchParams],
  );

  const toggleLocale = useCallback(() => {
    setLocale(locale === "ja" ? "en" : "ja");
  }, [locale, setLocale]);

  const value = useMemo(
    () => ({ locale, setLocale, toggleLocale }),
    [locale, setLocale, toggleLocale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
};

export default LocaleContext;
