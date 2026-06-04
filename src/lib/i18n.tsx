"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import ru from "@/locales/ru.json";
import en from "@/locales/en.json";

export type Locale = "ru" | "en";
const STORAGE_KEY = "site-locale";

const dictionaries: Record<Locale, Record<string, unknown>> = {
  ru: ru as Record<string, unknown>,
  en: en as Record<string, unknown>,
};

interface I18nContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

function lookup(dict: Record<string, unknown>, key: string): string {
  const parts = key.split(".");
  let cur: unknown = dict;
  for (const p of parts) {
    if (cur && typeof cur === "object" && p in (cur as Record<string, unknown>)) {
      cur = (cur as Record<string, unknown>)[p];
    } else {
      return key;
    }
  }
  return typeof cur === "string" ? cur : key;
}

function interpolate(s: string, vars?: Record<string, string | number>): string {
  if (!vars) return s;
  return s.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`));
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("ru");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (stored === "ru" || stored === "en") {
      setLocaleState(stored);
    } else {
      // Автодетект по браузеру
      const browser = navigator.language.split("-")[0];
      setLocaleState(browser === "en" ? "en" : "ru");
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.lang = locale;
      localStorage.setItem(STORAGE_KEY, locale);
    }
  }, [locale, mounted]);

  const value = useMemo<I18nContextValue>(() => {
    const dict = dictionaries[locale];
    return {
      locale,
      setLocale: setLocaleState,
      t: (key, vars) => interpolate(lookup(dict, key), vars),
    };
  }, [locale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useT() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    // SSR fallback — безопасно, возвращает ключ
    return {
      locale: "ru" as Locale,
      setLocale: () => {},
      t: (k: string) => k,
    };
  }
  return ctx;
}
