import { getAllArticles } from "@/lib/articles";
import { buildRssXml } from "@/lib/rss";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://sovereign-semantics.vercel.app";

/**
 * /feed.xml — основной RSS-эндпоинт (ru-локализация по умолчанию).
 * Отдаёт RSS 2.0 напрямую (200, application/rss+xml), без редиректов —
 * чтобы RSS-ридеры (Дзен, Feedly, W3C validator) сразу видели валидный фид.
 */
export const dynamic = "force-static";

export async function GET() {
  const articles = await getAllArticles({ locale: "ru", includeDrafts: false });
  const xml = buildRssXml({
    locale: "ru",
    siteUrl: SITE_URL,
    articles,
    // atom:link rel="self" ОБЯЗАН указывать на реальный 200-эндпоинт.
    selfUrl: `${SITE_URL}/rss.xml`,
  });

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
