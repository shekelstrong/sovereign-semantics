import type { Article, Locale } from "./articles-types";

const META: Record<
  Locale,
  { title: string; desc: string; lang: string; editor: string }
> = {
  ru: {
    title: "Архитектура суверенных смыслов",
    desc: "Аналитика · IT · ИИ · Технологический суверенитет. Без воды, с фактами.",
    lang: "ru-ru",
    editor: "Редакция АСС",
  },
  en: {
    title: "Architecture of Sovereign Meaning",
    desc: "Analytics · IT · AI · Technological sovereignty. No fluff, only facts.",
    lang: "en-us",
    editor: "ACC Editorial",
  },
};

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function stripMarkdown(md: string): string {
  return md
    .replace(/^---[\s\S]*?---/, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_`>#]/g, "")
    .replace(/\n+/g, " ")
    .trim();
}

export interface BuildRssOptions {
  locale: Locale;
  siteUrl: string;
  articles: Article[];
  /**
   * Абсолютный URL для <atom:link rel="self">. Должен указывать на реальный
   * 200-эндпоинт того же фида, иначе валидаторы (W3C, RSS-ридеры, Дзен) ругаются.
   */
  selfUrl: string;
}

/**
 * Сборка RSS 2.0 XML из статей. Чистая функция — не делает fetch,
 * принимает уже загруженные данные. Используется всеми feed-эндпоинтами.
 */
export function buildRssXml({
  locale,
  siteUrl,
  articles,
  selfUrl,
}: BuildRssOptions): string {
  const meta = META[locale];
  const lastBuild = new Date().toUTCString();

  const items = articles
    .map((a) => {
      const url = `${siteUrl}${a.locale === "en" ? "/en" : ""}/blog/${a.slug}`;
      const description = a.description || stripMarkdown(a.content).slice(0, 280);
      const category = a.tags[0] || (locale === "en" ? "IT" : "IT");
      const coverUrl = a.cover
        ? a.cover.startsWith("http")
          ? a.cover
          : `${siteUrl}${a.cover}`
        : null;

      return `    <item>
      <title>${escapeXml(a.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(a.date).toUTCString()}</pubDate>
      <author>vasileneopekin@yandex.ru (${escapeXml(a.author || meta.editor)})</author>
      <dc:creator>${escapeXml(a.author || meta.editor)}</dc:creator>
      <category>${escapeXml(category)}</category>
      <description>${escapeXml(description)}</description>${
        coverUrl
          ? `\n      <enclosure url="${coverUrl}" type="image/jpeg" />`
          : ""
      }
    </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(meta.title)}</title>
    <link>${siteUrl}</link>
    <description>${escapeXml(meta.desc)}</description>
    <language>${meta.lang}</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <atom:link href="${selfUrl}" rel="self" type="application/rss+xml" />
    <managingEditor>vasileneopekin@yandex.ru (${escapeXml(meta.editor)})</managingEditor>
    <webMaster>vasileneopekin@yandex.ru (${escapeXml(meta.editor)})</webMaster>
    <image>
      <url>${siteUrl}/icon</url>
      <title>${escapeXml(meta.title)}</title>
      <link>${siteUrl}</link>
    </image>
${items}
  </channel>
</rss>`;
}
