import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock, Calendar } from "lucide-react";
import {
  getAllArticles,
  getArticleBySlug,
  getArticleTranslation,
  getTagLabel,
  type Locale,
} from "@/lib/articles";
import { routes } from "@/lib/routes";
import { isValidLocale } from "@/lib/dict";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://sovereign-semantics.ru";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isValidLocale(lang)) return { title: "Not found" };
  const locale = lang as Locale;

  const article = await getArticleBySlug(slug, locale);
  if (!article) return { title: locale === "en" ? "Article not found" : "Статья не найдена" };

  const translation = await getArticleTranslation(article, locale === "ru" ? "en" : "ru");
  const isEn = locale === "en";
  const canonical = isEn ? `${SITE_URL}/en/blog/${article.slug}` : `${SITE_URL}/blog/${article.slug}`;

  return {
    title: article.title,
    description: article.description,
    keywords: article.tags.map((t) => getTagLabel(t, locale)),
    authors: [{ name: article.author || (isEn ? "Editorial" : "Редакция") }],
    alternates: {
      canonical,
      languages: {
        ru: `${SITE_URL}/blog/${article.slug}`,
        en: `${SITE_URL}/en/blog/${article.slug}`,
      },
    },
    openGraph: {
      type: "article",
      locale: isEn ? "en_US" : "ru_RU",
      alternateLocale: isEn ? "ru_RU" : "en_US",
      url: canonical,
      title: article.title,
      description: article.description,
      siteName: isEn ? "Architecture of Sovereign Meaning" : "Архитектура суверенных смыслов",
      publishedTime: article.date,
      modifiedTime: article.updated || article.date,
      authors: [article.author || (isEn ? "Editorial" : "Редакция")],
      tags: article.tags.map((t) => getTagLabel(t, locale)),
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

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!isValidLocale(lang)) notFound();
  const locale = lang as Locale;
  const isEn = locale === "en";

  const article = await getArticleBySlug(slug, locale);
  if (!article) notFound();

  // Translation: prefer frontmatter.translations, fallback to same-slug in other locale
  const otherLocale: Locale = locale === "ru" ? "en" : "ru";
  const translation = await getArticleTranslation(article, otherLocale);

  // Related
  const all = await getAllArticles({ locale });
  const related = article.related
    ? all.filter((a) => article.related!.includes(a.slug))
    : all.filter((a) => a.slug !== article.slug && a.tags.some((t) => article.tags.includes(t))).slice(0, 2);

  const date = new Date(article.date).toLocaleDateString(
    isEn ? "en-US" : "ru-RU",
    { year: "numeric", month: "long", day: "numeric" },
  );

  return (
    <article className="py-12 sm:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Translation banner */}
        {translation && (
          <div className="mb-6 p-3 border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/5 flex items-center justify-between gap-3 flex-wrap">
            <p className="text-xs text-[var(--color-foreground-muted)]">
              {isEn
                ? "This article is also available in Russian:"
                : "Эта статья также доступна на английском:"}
            </p>
            <Link
              href={routes.blogPost(translation.slug, otherLocale)}
              className="font-mono text-xs uppercase tracking-wider text-[var(--color-accent)] hover:underline"
            >
              {isEn ? "Read in Russian →" : "Read in English →"}
            </Link>
          </div>
        )}

        {/* Breadcrumbs */}
        <nav
          className="font-mono text-xs uppercase tracking-wider text-[var(--color-foreground-subtle)] mb-8"
          aria-label={isEn ? "Breadcrumbs" : "Хлебные крошки"}
        >
          <ol className="flex items-center gap-2 flex-wrap">
            <li>
              <Link href={routes.home(locale)} className="hover:text-[var(--color-accent)] transition-colors">
                {isEn ? "Home" : "Главная"}
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href={routes.blog(locale)} className="hover:text-[var(--color-accent)] transition-colors">
                {isEn ? "Blog" : "Блог"}
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
                {getTagLabel(tag, locale)}
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
                {article.readingTime} {isEn ? "min read" : "мин чтения"}
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
            <div className="absolute inset-0 bg-grid-animated opacity-20" aria-hidden />
            <div className="relative">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-accent)] mb-2">
                ↓ {isEn ? "Next step" : "Следующий шаг"}
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
                {isEn ? "Go" : "Перейти"}
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        )}

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-20 pt-10 border-t border-[var(--color-border)]">
            <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-foreground-muted)] mb-6">
              ↓ {isEn ? "Continue reading" : "Продолжить чтение"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {related.slice(0, 2).map((rel) => (
                <Link
                  key={rel.slug}
                  href={routes.blogPost(rel.slug, locale)}
                  className="group block p-5 border border-[var(--color-border)] hover:border-[var(--color-accent)]/40 transition-colors"
                >
                  <p className="font-mono text-xs uppercase tracking-wider text-[var(--color-accent)] mb-2">
                    {rel.tags[0] ? getTagLabel(rel.tags[0], locale) : ""}
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
            href={routes.blog(locale)}
            className="inline-flex items-center gap-2 font-mono text-sm text-[var(--color-foreground-muted)] hover:text-[var(--color-accent)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {isEn ? "Back to all articles" : "Все статьи"}
          </Link>
        </div>
      </div>
    </article>
  );
}
