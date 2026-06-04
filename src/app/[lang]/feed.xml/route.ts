import { getAllArticles } from "@/lib/articles";
import { routes } from "@/lib/routes";
import type { Locale } from "@/lib/articles-types";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://sovereign-semantics.ru";

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

const META: Record<Locale, { title: string; desc: string; lang: string; editor: string }> = {
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

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ lang: string }> },
) {
  const { lang } = await params;
  const locale: Locale = lang === "en" ? "en" : "ru";
  const meta = META[locale];
  const selfUrl = `${SITE_URL}${routes.feed(locale)}`;

  const articles = await getAllArticles({ locale, includeDrafts: false });
  const lastBuild = new Date().toUTCString();

  const items = articles
    .map((a) => {
      const url = `${SITE_URL}${routes.blogPost(a.slug, locale)}`;
      const description = a.description || stripMarkdown(a.content).slice(0, 280);
      return `    <item>
      <title>${escapeXml(a.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(a.date).toUTCString()}</pubDate>
      <author>vasileneopekin@yandex.ru (${escapeXml(a.author || meta.editor)})</author>
      <dc:creator>${escapeXml(a.author || meta.editor)}</dc:creator>
      <category>${escapeXml(a.tags[0] || (locale === "en" ? "IT" : "IT"))}</category>
      <description>${escapeXml(description)}</description>
      ${a.cover ? `<enclosure url="${a.cover.startsWith("http") ? a.cover : SITE_URL + a.cover}" type="image/jpeg" />` : ""}
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(meta.title)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(meta.desc)}</description>
    <language>${meta.lang}</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <atom:link href="${selfUrl}" rel="self" type="application/rss+xml" />
    <managingEditor>vasileneopekin@yandex.ru (${escapeXml(meta.editor)})</managingEditor>
    <webMaster>vasileneopekin@yandex.ru (${escapeXml(meta.editor)})</webMaster>
    <image>
      <url>${SITE_URL}/icon</url>
      <title>${escapeXml(meta.title)}</title>
      <link>${SITE_URL}</link>
    </image>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
