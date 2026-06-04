import type { Metadata } from "next";
import type { ArticleTag } from "@/lib/articles-types";
import { getAllArticles, getAllTags } from "@/lib/articles";
import { BlogExplorer } from "@/components/BlogExplorer";

export const metadata: Metadata = {
  title: "Блог",
  description:
    "Аналитические лонгриды о технологическом суверенитете, IT, искусственном интеллекте, экономике и трезвом образе жизни. Системный взгляд на архитектуру смыслов.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Блог · Архитектура суверенных смыслов",
    description:
      "Аналитические лонгриды о технологическом суверенитете, IT, ИИ и трезвом мышлении.",
    type: "website",
  },
};

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const [articles, tags] = await Promise.all([
    getAllArticles(),
    Promise.resolve(getAllTags()),
  ]);

  return (
    <section className="py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-12 max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-accent)] mb-3">
            ↓ /blog
          </p>
          <h1 className="font-mono text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Лента аналитики
          </h1>
          <p className="text-[var(--color-foreground-muted)] text-pretty">
            Лонгриды объёмом от 2000 слов. Без воды, без клише. Факты, логика,
            системный взгляд. Используйте фильтры по тегам, чтобы найти
            нужный разрез.
          </p>
        </header>

        <BlogExplorer articles={articles} tags={tags} />
      </div>
    </section>
  );
}
