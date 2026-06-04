import type { Locale } from "./articles-types";

/**
 * URL-хелперы. Префикс `/en` для английской локали, без префикса для русской.
 */
export const routes = {
  home: (l: Locale = "ru") => (l === "en" ? "/en" : "/"),
  blog: (l: Locale = "ru") => (l === "en" ? "/en/blog" : "/blog"),
  blogPost: (slug: string, l: Locale = "ru") =>
    l === "en" ? `/en/blog/${slug}` : `/blog/${slug}`,
  manifesto: (l: Locale = "ru") =>
    l === "en" ? "/en/manifesto" : "/manifesto",
  contact: (l: Locale = "ru") => (l === "en" ? "/en/contact" : "/contact"),
  // Канонический RSS для ru = /rss.xml (отдаёт ru-фид напрямую, 200).
  // Локализованный en-фид = /en/feed.xml (через [lang]/feed.xml/route.ts).
  // /feed.xml в корне больше не существует — раньше был 307-редирект на /ru/feed.xml.
  feed: (l: Locale = "ru") => (l === "en" ? "/en/feed.xml" : "/rss.xml"),
  admin: () => "/admin",
};

/**
 * Поменять локаль в текущем pathname, сохранив остальной путь.
 * Пример: /blog/foo + l="en" → /en/blog/foo
 */
export function switchLocalePath(pathname: string, target: Locale): string {
  // Убираем ведущий /en/ или /ru/ если есть
  const stripped = pathname.replace(/^\/(en|ru)(?=\/|$)/, "") || "/";

  if (target === "en") {
    return stripped === "/" ? "/en" : `/en${stripped}`;
  }
  return stripped;
}
