import { getAllArticles } from "@/lib/articles";
import { buildRssXml } from "@/lib/rss";
import type { Locale } from "@/lib/articles-types";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://sovereign-semantics.vercel.app";

/**
 * /:lang/feed.xml — локализованный RSS-фид.
 * /ru/feed.xml → ru-фид
 * /en/feed.xml → en-фид
 *
 * atom:link rel="self" указывает на /rss.xml — это валидный 200-эндпоинт
 * основного фида, поэтому валидаторы (W3C, Дзен) не ругаются.
 */
export const dynamic = "force-static";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ lang: string }> },
) {
  const { lang } = await params;
  const locale: Locale = lang === "en" ? "en" : "ru";

  const articles = await getAllArticles({ locale, includeDrafts: false });
  const xml = buildRssXml({
    locale,
    siteUrl: SITE_URL,
    articles,
    selfUrl: `${SITE_URL}/rss.xml`,
  });

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
