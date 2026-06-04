import { NextRequest, NextResponse } from "next/server";

const DEFAULT_LOCALE = "ru" as const;
type Locale = "ru" | "en";

// Префиксы статических страниц, которые должны быть локализованы
// (включая вложенные: /blog/<slug>, /feed.xml и т.д.).
// /rss.xml и /feed.xml НЕ входят сюда — это RSS-эндпоинты с собственными
// route handler'ами (src/app/rss.xml/, src/app/[lang]/feed.xml/),
// которые не должны перехватываться middleware rewrite'ом.
const STATIC_PREFIXES = ["/blog", "/manifesto", "/contact", "/about"];

function isLocale(s: string): s is Locale {
  return s === "ru" || s === "en";
}

function detectLocaleFromRequest(req: NextRequest): Locale {
  // 1) Cookie (от прошлого визита)
  const cookieLocale = req.cookies.get("site-locale")?.value ?? "";
  if (isLocale(cookieLocale)) return cookieLocale;
  // 2) Accept-Language
  const acceptLang = req.headers.get("accept-language") || "";
  if (/^en/i.test(acceptLang)) return "en";
  return DEFAULT_LOCALE;
}

/** Нужно ли локализовать pathname? */
function shouldLocalize(pathname: string): boolean {
  if (pathname === "/") return true;
  return STATIC_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );
}

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // API, admin, внутренние ассеты Next, служебные файлы — пропускаем
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    pathname === "/favicon.ico" ||
    pathname === "/icon" ||
    pathname === "/apple-icon" ||
    pathname === "/opengraph-image" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname.startsWith("/logos/") ||
    pathname.startsWith("/og/") ||
    // HTML-файлы верификации (Яндекс.Вебмастер: yandex_*.html, GSC: google*.html)
    /^\/(yandex_|google[a-z0-9_-]*|bing[a-z0-9_-]*)\.html$/i.test(pathname) ||
    // прочие ассеты (css/js/images/fonts) — пропускаем
    /\.[a-z0-9]{1,5}$/i.test(pathname)
  ) {
    return NextResponse.next();
  }

  // Уже локализованный путь — пропускаем
  if (
    pathname === "/ru" ||
    pathname.startsWith("/ru/") ||
    pathname === "/en" ||
    pathname.startsWith("/en/")
  ) {
    return NextResponse.next();
  }

  // Не-локализованный статический путь → отдаём контент нужной локали
  // через INTERNAL REWRITE (URL не меняется, sitemap видит 200 вместо 307).
  // Раньше был NextResponse.redirect — это ломало sitemap, потому что
  // Google Search Console считает 307-редирект «недействительным URL».
  if (shouldLocalize(pathname)) {
    const target = detectLocaleFromRequest(req);
    // Для ru и en ВСЕГДА добавляем префикс локали (иначе петля)
    const newPath =
      target === "en"
        ? pathname === "/"
          ? "/en"
          : `/en${pathname}`
        : pathname === "/"
          ? "/ru"
          : `/ru${pathname}`;
    const url = req.nextUrl.clone();
    url.pathname = newPath;
    url.search = search;
    // rewrite — клиент видит оригинальный URL, GSC видит 200
    const res = NextResponse.rewrite(url);
    res.cookies.set("site-locale", target, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
    return res;
  }

  // Всё остальное (404 / 500)
  return NextResponse.next();
}

export const config = {
  // Пропускаем _next/* и статические ассеты (картинки/шрифты/скрипты),
  // но НЕ пропускаем .xml/.json (служебные эндпоинты)
  matcher: [
    "/((?!_next/static|_next/image|.*\\.(?:png|jpe?g|gif|webp|avif|svg|ico|woff2?|ttf|eot|css|js|map)$).*)",
    // HTML-файлы верификации НЕ должны проходить через middleware
    "/((?!yandex_).*\\.html$)",
  ],
};
