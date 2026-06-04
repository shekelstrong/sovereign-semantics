import { NextResponse } from "next/server";

/**
 * /rss.xml — алиас для основного feed.
 * Редиректит на /ru/feed.xml (default locale).
 * LLM/AI/ридеры обычно ищут RSS по /rss.xml.
 */
export const dynamic = "force-static";

export function GET() {
  return NextResponse.redirect(
    new URL("/ru/feed.xml", "https://sovereign-semantics.vercel.app"),
    307,
  );
}
