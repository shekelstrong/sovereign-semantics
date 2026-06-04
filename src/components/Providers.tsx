"use client";

import { ThemeProvider } from "@/lib/theme";
import { LanguageProvider } from "@/lib/i18n";
import type { ReactNode } from "react";

/**
 * Client-side providers wrapper. Подключается в root layout.
 * Server-rendering safe: оба провайдера начинают с дефолтных значений,
 * эффекты для восстановления localStorage срабатывают только после mount.
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <LanguageProvider>{children}</LanguageProvider>
    </ThemeProvider>
  );
}
