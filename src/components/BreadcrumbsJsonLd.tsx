"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";

/**
 * Генерирует JSON-LD BreadcrumbList динамически по текущему URL.
 * Добавляется в <head> через dangerouslySetInnerHTML (допустимо для JSON-LD).
 *
 * Структура:
 *   /                → Главная
 *   /blog            → Главная → Блог
 *   /blog/sovereign  → Главная → Блог → Статья
 *   /manifesto       → Главная → Манифест
 *   /contact         → Главная → Контакты
 */
const LABELS: Record<"ru" | "en", Record<"blog" | "manifesto" | "contact", string>> = {
  ru: {
    blog: "Блог",
    manifesto: "Манифест",
    contact: "Контакты",
  },
  en: {
    blog: "Blog",
    manifesto: "Manifesto",
    contact: "Contacts",
  },
};

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://sovereign-semantics.ru";

function buildBreadcrumbs(pathname: string) {
  // Убираем локальный префикс для парсинга, но сохраняем для ссылок
  const segments = pathname.split("/").filter(Boolean);
  const lang = segments[0] === "en" ? "en" : "ru";
  const isEn = lang === "en";
  const restSegments = segments[0] === "en" || segments[0] === "ru"
    ? segments.slice(1)
    : segments;

  const baseUrl = isEn ? `${SITE_URL}/en` : `${SITE_URL}`;
  const homeLabel = isEn ? "Home" : "Главная";

  // Старт: всегда Главная
  const items: Array<{ "@type": string; position: number; name: string; item: string }> = [
    { "@type": "ListItem", position: 1, name: homeLabel, item: baseUrl },
  ];

  let acc = isEn ? "/en" : "";
  restSegments.forEach((seg, idx) => {
    acc += `/${seg}`;
    const position = idx + 2;
    let name = seg;
    if (seg === "blog") name = LABELS[lang].blog;
    else if (seg === "manifesto") name = LABELS[lang].manifesto;
    else if (seg === "contact") name = LABELS[lang].contact;
    else {
      // slug статьи — заменяем на slug (нормализуем), имя не критично,
      // робот Google по item.position и item.url понимает иерархию
      name = decodeURIComponent(seg);
    }
    items.push({
      "@type": "ListItem",
      position,
      name,
      item: isEn
        ? `${SITE_URL}${acc}`
        : `${SITE_URL}${acc.replace(/^\/ru/, "") || ""}`,
    });
  });

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items,
  };
}

export function BreadcrumbsJsonLd() {
  const pathname = usePathname() || "/";
  const json = useMemo(() => buildBreadcrumbs(pathname), [pathname]);
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
