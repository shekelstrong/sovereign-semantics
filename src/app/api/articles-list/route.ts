import { NextResponse } from "next/server";
import { getAllArticles } from "@/lib/articles";

/**
 * GET /api/articles-list
 * Список всех статей (включая draft) — для админки.
 * Авторизация: Bearer CMS_API_TOKEN
 */
export async function GET(req: Request) {
  const token = process.env.CMS_API_TOKEN;
  if (token) {
    const auth = req.headers.get("authorization") || "";
    if (auth !== `Bearer ${token}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const articles = await getAllArticles({ includeDrafts: true });
  return NextResponse.json({
    count: articles.length,
    articles: articles.map((a) => ({
      slug: a.slug,
      title: a.title,
      description: a.description,
      date: a.date,
      tags: a.tags,
      draft: a.draft,
      readingTime: a.readingTime,
    })),
  });
}
