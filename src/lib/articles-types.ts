/**
 * Типы и утилиты, безопасные для client-side импорта.
 * Не импортируют node:fs / node:path.
 */

export type Locale = "ru" | "en";

export type ArticleTag =
  | "geopolitics"
  | "it-ai"
  | "economy"
  | "lifestyle"
  | "methodology";

export interface Article {
  slug: string;
  locale: Locale;
  title: string;
  description: string;
  date: string;
  updated?: string;
  tags: ArticleTag[];
  cover?: string;
  coverPrompt?: string;
  readingTime?: number;
  content: string;
  html: string;
  draft?: boolean;
  author?: string;
  cta?: { label: string; href: string };
  related?: string[];
  /** Slug переведённой версии в другой локали (если есть) */
  translations?: Partial<Record<Locale, string>>;
}

const TAG_LABELS: Record<Locale, Record<ArticleTag, string>> = {
  ru: {
    geopolitics: "Геополитика",
    "it-ai": "IT и ИИ",
    economy: "Экономика",
    lifestyle: "ЗОЖ и Эффективность",
    methodology: "Методология",
  },
  en: {
    geopolitics: "Geopolitics",
    "it-ai": "IT & AI",
    economy: "Economy",
    lifestyle: "Health & Performance",
    methodology: "Methodology",
  },
};

export function getTagLabel(tag: ArticleTag, locale: Locale = "ru"): string {
  return TAG_LABELS[locale][tag] || tag;
}

export function getAllTags(): ArticleTag[] {
  return ["geopolitics", "it-ai", "economy", "lifestyle", "methodology"];
}
