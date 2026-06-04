import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock, Calendar } from "lucide-react";
import {
  getAllArticles,
  getArticleBySlug,
  getTagLabel,
  type Article,
  type ArticleTag,
} from "@/lib/articles";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://sovereign-semantics.vercel.app";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Статья не найдена" };

  return {
    title: article.title,
    description: article.description,
    keywords: article.tags.map(getTagLabel),
    authors: [{ name: article.author || "Редакция" }],
    alternates: {
      canonical: `/blog/${article.slug}`,
    },
    openGraph: {
      type: "article",
      locale: "ru_RU",
      url: `${SITE_URL}/blog/${article.slug}`,
      title: article.title,
      description: article.description,
      siteName: "Архитектура суверенных смыслов",
      publishedTime: article.date,
      modifiedTime: article.updated || article.date,
      authors: [article.author || "Редакция"],
      tags: article.tags.map(getTagLabel),
      images: article.cover
        ? [
            {
              url: article.cover,
              width: 1200,
              height: 630,
              alt: article.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
      images: article.cover ? [article.cover] : undefined,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const allArticles = await getAllArticles();
  const related = (article.related || [])
    .map((s) => allArticles.find((a) => a.slug === s))
    .filter((a): a is Article => Boolean(a));

  // JSON-LD: Article schema для Google/Yandex/LLM-поисковиков
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${SITE_URL}/blog/${article.slug}#article`,
    headline: article.title,
    description: article.description,
    image: article.cover ? [`${SITE_URL}${article.cover}`] : undefined,
    datePublished: article.date,
    dateModified: article.updated || article.date,
    author: {
      "@type": "Organization",
      name: article.author || "Архитектура суверенных смыслов",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Архитектура суверенных смыслов",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${article.slug}`,
    },
    keywords: article.tags.map(getTagLabel).join(", "),
    inLanguage: "ru-RU",
    wordCount: article.content.trim().split(/\s+/).length,
    timeRequired: `PT${article.readingTime || 1}M`,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Главная",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Блог",
        item: `${SITE_URL}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: article.title,
        item: `${SITE_URL}/blog/${article.slug}`,
      },
    ],
  };

  const date = new Date(article.date).toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <article className="py-12 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav
            className="mb-8 font-mono text-xs uppercase tracking-wider text-[var(--color-foreground-subtle)]"
            aria-label="Хлебные крошки"
          >
            <ol className="flex items-center gap-2 flex-wrap">
              <li>
                <Link
                  href="/"
                  className="hover:text-[var(--color-accent)] transition-colors"
                >
                  Главная
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link
                  href="/blog"
                  className="hover:text-[var(--color-accent)] transition-colors"
                >
                  Блог
                </Link>
              </li>
              <li>/</li>
              <li className="text-[var(--color-foreground-muted)] truncate max-w-[200px] sm:max-w-xs">
                {article.title}
              </li>
            </ol>
          </nav>

          {/* Header */}
          <header className="mb-12">
            <div className="flex flex-wrap gap-2 mb-6">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-xs uppercase tracking-wider px-2 py-1 border border-[var(--color-accent)]/30 text-[var(--color-accent)]"
                >
                  {getTagLabel(tag)}
                </span>
              ))}
            </div>

            <h1 className="font-mono text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1] mb-6 text-balance">
              {article.title}
            </h1>

            <p className="text-lg text-[var(--color-foreground-muted)] leading-relaxed mb-6 text-pretty">
              {article.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 font-mono text-xs uppercase tracking-wider text-[var(--color-foreground-subtle)] pt-6 border-t border-[var(--color-border)]">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {date}
              </span>
              {article.readingTime && (
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {article.readingTime} мин чтения
                </span>
              )}
              <span>{article.author}</span>
            </div>
          </header>

          {/* Cover */}
          {article.cover && (
            <div className="mb-12 aspect-[16/9] overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={article.cover}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Body */}
          <div
            className="prose-article"
            dangerouslySetInnerHTML={{ __html: article.html }}
          />

          {/* CTA */}
          {article.cta && (
            <div className="mt-16 p-6 sm:p-8 border border-[var(--color-accent)]/30 bg-[var(--color-surface)] relative overflow-hidden">
              <div
                className="absolute inset-0 bg-grid-animated opacity-20"
                aria-hidden
              />
              <div className="relative">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-accent)] mb-2">
                  ↓ Следующий шаг
                </p>
                <h3 className="font-mono text-xl font-semibold mb-3">
                  {article.cta.label}
                </h3>
                <a
                  href={article.cta.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--color-accent)] text-[var(--color-accent-foreground)] font-mono text-sm uppercase tracking-wider hover:shadow-[0_0_20px_var(--color-accent-glow)] transition-shadow"
                >
                  Перейти
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}

          {/* Related */}
          {related.length > 0 && (
            <div className="mt-20 pt-10 border-t border-[var(--color-border)]">
              <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-foreground-muted)] mb-6">
                ↓ Продолжить чтение
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {related.slice(0, 2).map((rel) => (
                  <Link
                    key={rel.slug}
                    href={`/blog/${rel.slug}`}
                    className="group block p-5 border border-[var(--color-border)] hover:border-[var(--color-accent)]/40 transition-colors"
                  >
                    <p className="font-mono text-xs uppercase tracking-wider text-[var(--color-accent)] mb-2">
                      {rel.tags[0] ? getTagLabel(rel.tags[0]) : ""}
                    </p>
                    <h3 className="font-mono text-base font-semibold leading-snug mb-2 group-hover:text-[var(--color-accent)] transition-colors line-clamp-2">
                      {rel.title}
                    </h3>
                    <p className="text-xs text-[var(--color-foreground-muted)] line-clamp-2">
                      {rel.description}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Back */}
          <div className="mt-16">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 font-mono text-sm uppercase tracking-wider text-[var(--color-foreground-muted)] hover:text-[var(--color-accent)] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Назад к ленте
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
