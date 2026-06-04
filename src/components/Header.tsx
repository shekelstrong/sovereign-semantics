"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { href: "/", label: "Главная" },
  { href: "/blog", label: "Блог" },
  { href: "/manifesto", label: "Манифест" },
  { href: "/contact", label: "Контакты" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
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
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "backdrop-blur-xl bg-[var(--color-background)]/80 border-b border-[var(--color-border)]"
          : "bg-transparent",
      ].join(" ")}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group"
            aria-label="На главную"
          >
            <div className="relative w-8 h-8 flex items-center justify-center">
              <div className="absolute inset-0 border border-[var(--color-accent)] rounded-sm rotate-45 group-hover:rotate-90 transition-transform duration-700" />
              <div className="absolute inset-1 border border-[var(--color-blue)]/40 rounded-sm" />
              <span className="relative font-mono text-sm font-bold text-[var(--color-accent)]">
                А
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-foreground-muted)] leading-none">
                Архитектура
              </span>
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-foreground)] leading-none mt-0.5">
                Суверенных Смыслов
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav
            className="hidden md:flex items-center gap-1"
            aria-label="Главная навигация"
          >
            {navItems.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    "relative px-4 py-2 font-mono text-sm uppercase tracking-wider transition-colors",
                    active
                      ? "text-[var(--color-accent)]"
                      : "text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)]",
                  ].join(" ")}
                >
                  {item.label}
                  {active && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute left-2 right-2 -bottom-0.5 h-px bg-[var(--color-accent)]"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Telegram pill */}
          <div className="hidden md:flex items-center gap-2">
            <a
              href="https://t.me/sovereign_semantics"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs uppercase tracking-wider px-3 py-1.5 border border-[var(--color-accent)]/30 text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-foreground)] transition-colors"
            >
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] mr-2 animate-pulse" />
              Telegram
            </a>
          </div>

          {/* Mobile burger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 -mr-2"
            aria-label={open ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={open}
          >
            <div className="w-5 h-4 flex flex-col justify-between">
              <span
                className={[
                  "block h-px bg-[var(--color-foreground)] transition-transform origin-center",
                  open ? "rotate-45 translate-y-[7px]" : "",
                ].join(" ")}
              />
              <span
                className={[
                  "block h-px bg-[var(--color-foreground)] transition-opacity",
                  open ? "opacity-0" : "",
                ].join(" ")}
              />
              <span
                className={[
                  "block h-px bg-[var(--color-foreground)] transition-transform origin-center",
                  open ? "-rotate-45 -translate-y-[7px]" : "",
                ].join(" ")}
              />
            </div>
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {open && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="md:hidden overflow-hidden border-t border-[var(--color-border)]"
              aria-label="Мобильная навигация"
            >
              <div className="py-4 flex flex-col gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="font-mono text-sm uppercase tracking-wider px-2 py-2.5 text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-surface)] transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
                <a
                  href="https://t.me/sovereign_semantics"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 font-mono text-xs uppercase tracking-wider px-3 py-2 border border-[var(--color-accent)]/30 text-[var(--color-accent)] text-center"
                >
                  Telegram →
                </a>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
