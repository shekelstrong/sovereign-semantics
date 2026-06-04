"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Globe } from "lucide-react";
import type { Locale } from "@/lib/articles-types";
import { switchLocalePath } from "@/lib/routes";

export function LangSwitcher({
  currentLocale,
  currentPath,
}: {
  currentLocale: Locale;
  currentPath: string;
}) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="w-[78px] h-9" />;

  const options: { value: Locale; label: string }[] = [
    { value: "ru", label: "RU" },
    { value: "en", label: "EN" },
  ];

  function handleSwitch(target: Locale) {
    if (target === currentLocale) return;
    const targetPath = switchLocalePath(currentPath, target);
    try {
      localStorage.setItem("site-locale", target);
    } catch {}
    router.push(targetPath);
  }

  return (
    <div className="flex items-center border border-[var(--color-border)] h-9">
      <Globe className="w-3.5 h-3.5 mx-1.5 text-[var(--color-foreground-muted)]" />
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => handleSwitch(o.value)}
          className={[
            "h-full px-2.5 font-mono text-[11px] uppercase tracking-wider transition-colors",
            currentLocale === o.value
              ? "bg-[var(--color-accent)] text-[var(--color-accent-foreground)]"
              : "text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)]",
          ].join(" ")}
          aria-label={`Switch to ${o.label}`}
          aria-pressed={currentLocale === o.value}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
