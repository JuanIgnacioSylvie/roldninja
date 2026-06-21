"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { en } from "./en";
import { es, type Locale, type TranslationKeys } from "./es";

const STORAGE_KEY = "roldninja-locale";

interface LocaleContextValue {
  locale: Locale;
  t: TranslationKeys;
  setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

const dictionaries: Record<Locale, TranslationKeys> = { es, en };

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("es");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (saved === "es" || saved === "en") setLocaleState(saved);
  }, []);

  function setLocale(next: Locale) {
    setLocaleState(next);
    localStorage.setItem(STORAGE_KEY, next);
    document.documentElement.lang = next;
  }

  return (
    <LocaleContext.Provider value={{ locale, t: dictionaries[locale], setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("LocaleProvider not mounted");
  return ctx;
}

export function useTranslation() {
  return useLocale().t;
}
