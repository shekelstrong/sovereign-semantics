/**
 * Типы и утилиты, безопасные для client-side импорта.
 * Не импортируют node:fs / node:path.
 */

export type ArticleTag =
  | "geopolitics"
  | "it-ai"
  | "economy"
  | "lifestyle"
  | "methodology";

export interface Article {
  slug: string;
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
}

const TAG_LABELS: Record<ArticleTag, string> = {
  geopolitics: "Геополитика",
  "it-ai": "IT и ИИ",
  economy: "Экономика",
  lifestyle: "ЗОЖ и Эффективность",
  methodology: "Методология",
};

export function getTagLabel(tag: ArticleTag): string {
  return TAG_LABELS[tag] || tag;
}

export function getAllTags(): ArticleTag[] {
  return Object.keys(TAG_LABELS) as ArticleTag[];
}
