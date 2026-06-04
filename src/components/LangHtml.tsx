"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Синхронизирует document.documentElement.lang с текущим URL.
 * /en* → "en", иначе → "ru". Нужен для SEO и парсеров LLM.
 */
export function LangHtml() {
  const pathname = usePathname() || "/";
  useEffect(() => {
    const lang = pathname.startsWith("/en") ? "en" : "ru";
    document.documentElement.lang = lang;
  }, [pathname]);
  return null;
}
