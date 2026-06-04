"use client";

import { useT, type Locale } from "@/lib/i18n";
import { useEffect, useState } from "react";
import { Globe } from "lucide-react";

export function LangSwitcher() {
  const { locale, setLocale } = useT();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="w-9 h-9" />;

  const options: { value: Locale; label: string }[] = [
    { value: "ru", label: "RU" },
    { value: "en", label: "EN" },
  ];

  return (
    <div className="flex items-center border border-[var(--color-border)] h-9">
      <Globe className="w-3.5 h-3.5 mx-1.5 text-[var(--color-foreground-muted)]" />
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => setLocale(o.value)}
          className={[
            "h-full px-2.5 font-mono text-[11px] uppercase tracking-wider transition-colors",
            locale === o.value
              ? "bg-[var(--color-accent)] text-[var(--color-accent-foreground)]"
              : "text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)]",
          ].join(" ")}
          aria-label={`Switch to ${o.label}`}
          aria-pressed={locale === o.value}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
