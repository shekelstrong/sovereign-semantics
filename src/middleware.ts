import { NextRequest, NextResponse } from "next/server";

const DEFAULT_LOCALE = "ru" as const;
type Locale = "ru" | "en";

// Locale-aware pathnames: каждый static-path имеет ru-вариант (без префикса)
// и en-вариант (/en/...)
const STATIC_PATHS = ["/", "/blog", "/manifesto", "/contact", "/feed.xml"];

function isLocale(s: string): s is Locale {
  return s === "ru" || s === "en";
}

function detectLocaleFromRequest(req: NextRequest): Locale {
  // 1) Cookie
  const cookieLocale = req.cookies.get("site-locale")?.value ?? "";
  if (isLocale(cookieLocale)) return cookieLocale;
  // 2) Accept-Language
  const acceptLang = req.headers.get("accept-language") || "";
  if (/^en/i.test(acceptLang)) return "en";
  return DEFAULT_LOCALE;
}

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // Не трогаем API, admin, статические ассеты, иконки, og-image
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    pathname === "/favicon.ico" ||
    pathname === "/icon" ||
    pathname === "/opengraph-image" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname.startsWith("/logos/") ||
    pathname.startsWith("/og/")
  ) {
    return NextResponse.next();
  }

  // Уже локализованный путь — ок
  if (pathname.startsWith("/en/") || pathname === "/en" ||
      pathname.startsWith("/ru/") || pathname === "/ru") {
    return NextResponse.next();
  }

  // Не-локализованный путь → редирект на дефолтную локаль
  if (STATIC_PATHS.includes(pathname)) {
    const target = detectLocaleFromRequest(req);
    // Для ru и en ВСЕГДА добавляем префикс локали — иначе / → / = бесконечный цикл
    const newPath = target === "en"
      ? (pathname === "/" ? "/en" : `/en${pathname}`)
      : (pathname === "/" ? "/ru" : `/ru${pathname}`);
    const url = req.nextUrl.clone();
    url.pathname = newPath;
    url.search = search;
    const res = NextResponse.redirect(url, 307);
    // Save detected locale to cookie (so next visit goes direct)
    res.cookies.set("site-locale", target, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
    return res;
  }

  // Всё остальное (404)
  return NextResponse.next();
}

export const config = {
  // Применяем только к HTML-страницам, не к ассетам
  matcher: ["/((?!_next/static|_next/image|.*\\.).*)"],
};
