"use client";

import Script from "next/script";

/**
 * Plausible Analytics — privacy-friendly, без cookies, GDPR-compliant.
 * Можно заменить на Umami/Yandex.Metrika через NEXT_PUBLIC_ANALYTICS env.
 */
export function Analytics() {
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  if (!domain) return null;

  return (
    <Script
      defer
      data-domain={domain}
      src="https://plausible.io/js/script.js"
      strategy="afterInteractive"
    />
  );
}
