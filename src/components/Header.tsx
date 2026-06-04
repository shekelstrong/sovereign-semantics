"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useT } from "@/lib/i18n";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { LangSwitcher } from "./LangSwitcher";
import { routes } from "@/lib/routes";
import { LogoMark } from "@/components/Logo";
import type { Locale } from "@/lib/articles-types";

function detectLocale(pathname: string): Locale {
  if (pathname.startsWith("/en")) return "en";
  return "ru";
}

function prefix(path: string, locale: Locale): string {
  if (locale === "en") {
    return path.startsWith("/en") ? path : `/en${path === "/" ? "" : path}`;
  }
  // ru: strip /en prefix if any
  if (path.startsWith("/en/")) return path.slice(3);
  if (path === "/en") return "/";
  return path;
}

export function Header() {
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t } = useT();
  const locale = detectLocale(pathname);

  // nav items with locale-aware href
  const navItems: { href: string; key: string }[] = [
    { href: routes.blog(locale), key: "nav.blog" },
    { href: routes.manifesto(locale), key: "nav.manifesto" },
    { href: routes.contact(locale), key: "nav.contact" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={[
        "sticky top-0 z-50 border-b backdrop-blur-md transition-colors",
        scrolled
          ? "border-[var(--color-border)] bg-[var(--color-background)]/80"
          : "border-transparent bg-[var(--color-background)]/60",
      ].join(" ")}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={routes.home(locale)} className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 flex items-center justify-center group-hover:rotate-[360deg] transition-transform duration-700">
              <LogoMark size={32} />
            </div>
            <div className="hidden sm:block">
              <p className="font-mono text-sm font-semibold leading-none">
                {locale === "en" ? "ARCHITECTURE" : "АРХИТЕКТУРА"}
              </p>
              <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-foreground-muted)] leading-none mt-0.5">
                {locale === "en" ? "OF SOVEREIGN MEANING" : "СУВЕРЕННЫХ СМЫСЛОВ"}
              </p>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((l) => {
              const active = pathname === l.href || pathname.startsWith(l.href + "/");
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={[
                    "px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors",
                    active
                      ? "text-[var(--color-accent)]"
                      : "text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)]",
                  ].join(" ")}
                >
                  {t(l.key)}
                </Link>
              );
            })}
          </nav>

          {/* Controls */}
          <div className="flex items-center gap-1.5">
            <LangSwitcher currentLocale={locale} currentPath={pathname} />
            <ThemeSwitcher />
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden w-9 h-9 flex items-center justify-center border border-[var(--color-border)] hover:border-[var(--color-accent)] transition-colors"
              aria-label="Toggle menu"
              aria-expanded={open}
            >
              {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-[var(--color-border)] bg-[var(--color-background)] overflow-hidden"
          >
            <div className="px-4 py-3 space-y-1">
              {navItems.map((l) => {
                const active = pathname === l.href;
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={[
                      "block px-3 py-2.5 font-mono text-sm uppercase tracking-wider border-l-2 transition-colors",
                      active
                        ? "border-[var(--color-accent)] text-[var(--color-accent)] bg-[var(--color-accent)]/5"
                        : "border-transparent text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-surface)]",
                    ].join(" ")}
                  >
                    {t(l.key)}
                  </Link>
                );
              })}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
