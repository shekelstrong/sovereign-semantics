"use client";

import { Analytics as VercelAnalyticsReact } from "@vercel/analytics/next";

/**
 * Vercel Web Analytics — privacy-friendly, server-side ingestion.
 * Не требует consent banner. Показывает page views, real users, top pages.
 *
 * Документация: https://vercel.com/docs/analytics/quickstart
 */
export function VercelAnalytics() {
  return <VercelAnalyticsReact />;
}
