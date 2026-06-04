import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Locale } from "@/lib/articles-types";
import { getAllArticles, getAllTags } from "@/lib/articles";
import { BlogExplorer } from "@/components/BlogExplorer";
import { isValidLocale } from "@/lib/dict";

export async function generateStaticParams() {
  return [{ lang: "ru" }, { lang: "en" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const isEn = lang === "en";
  const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://sovereign-semantics.ru";
  return {
    title: isEn ? "Blog" : "Блог",
    description: isEn
      ? "Analytical longreads on technological sovereignty, IT, AI and sober thinking. No fluff, no clichés."
      : "Аналитические лонгриды о технологическом суверенитете, IT, искусственном интеллекте, экономике и трезвом образе жизни.",
    alternates: {
      canonical: isEn ? `${SITE}/en/blog` : `${SITE}/blog`,
      languages: {
        ru: `${SITE}/blog`,
        en: `${SITE}/en/blog`,
      },
    },
    openGraph: {
      title: isEn ? "Blog · Architecture of Sovereign Meaning" : "Блог · Архитектура суверенных смыслов",
      description: isEn
        ? "Analytical longreads on sovereignty, IT, AI."
        : "Аналитические лонгриды о суверенитете, IT, ИИ.",
      type: "website",
      url: isEn ? `${SITE}/en/blog` : `${SITE}/blog`,
      locale: isEn ? "en_US" : "ru_RU",
    },
  };
}

export const dynamic = "force-dynamic";

export default async function BlogPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isValidLocale(lang)) notFound();
  const locale = lang as Locale;

  const [articles, tags] = await Promise.all([
    getAllArticles({ locale }),
    Promise.resolve(getAllTags()),
  ]);

  const isEn = locale === "en";
  return (
    <section className="py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-12 max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-accent)] mb-3">
            ↓ /{isEn ? "en/blog" : "blog"}
          </p>
          <h1 className="font-mono text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            {isEn ? "Analytics feed" : "Лента аналитики"}
          </h1>
          <p className="text-[var(--color-foreground-muted)] text-pretty">
            {isEn
              ? "Longreads of 2000+ words. No fluff, no clichés. Facts, logic, systemic view. Use tag filters to find the right cut."
              : "Лонгриды объёмом от 2000 слов. Без воды, без клише. Факты, логика, системный взгляд. Используйте фильтры по тегам, чтобы найти нужный разрез."}
          </p>
        </header>

        <BlogExplorer articles={articles} tags={tags} locale={locale} />
      </div>
    </section>
  );
}
