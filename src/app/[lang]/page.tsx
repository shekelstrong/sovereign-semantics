import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Code2, Brain, Network } from "lucide-react";
import { getLatestArticles, type Locale } from "@/lib/articles";
import { ArticleCard } from "@/components/ArticleCard";
import { HeroAnimation } from "@/components/HeroAnimation";
import { FadeIn } from "@/components/FadeIn";
import { HeroGrid } from "@/components/HeroGrid";
import { getDict, isValidLocale } from "@/lib/dict";
import { routes } from "@/lib/routes";
import { notFound } from "next/navigation";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://sovereign-semantics.vercel.app";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const isEn = lang === "en";
  const home = isEn ? "/en" : "/";
  return {
    alternates: {
      canonical: isEn ? `${SITE_URL}/en` : `${SITE_URL}/`,
      languages: {
        ru: `${SITE_URL}/`,
        en: `${SITE_URL}/en`,
      },
    },
    openGraph: {
      url: isEn ? `${SITE_URL}/en` : `${SITE_URL}/`,
    },
  };
}

export async function generateStaticParams() {
  return [{ lang: "ru" }, { lang: "en" }];
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isValidLocale(lang)) notFound();
  const locale = lang as Locale;
  const dict = getDict(locale);
  const latest = await getLatestArticles(3, locale);

  const principleIcons = [Brain, Network, Code2];

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-[var(--color-border)]">
        <HeroGrid />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 sm:pt-20 sm:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <FadeIn>
                <p className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--color-accent)] mb-4 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-[var(--color-accent)] animate-pulse" />
                  {dict.hero.tagline}
                </p>
              </FadeIn>

              <FadeIn delay={0.1}>
                <h1 className="font-mono text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight mb-6">
                  {dict.hero.title[0]}
                  <br />
                  <span className="text-[var(--color-accent)]">{dict.hero.title[1]}</span>
                  <br />
                  {dict.hero.title[2]}
                </h1>
              </FadeIn>

              <FadeIn delay={0.2}>
                <p className="text-lg text-[var(--color-foreground-muted)] leading-relaxed mb-8 max-w-xl">
                  {dict.hero.subtitle}
                </p>
              </FadeIn>

              <FadeIn delay={0.3}>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href={routes.blog(locale)}
                    className="group inline-flex items-center gap-2 px-5 py-3 bg-[var(--color-accent)] text-[var(--color-accent-foreground)] font-mono text-sm uppercase tracking-wider hover:shadow-[0_0_30px_var(--color-accent-glow)] transition-shadow"
                  >
                    {dict.hero.ctaRead}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    href={routes.manifesto(locale)}
                    className="inline-flex items-center gap-2 px-5 py-3 border border-[var(--color-border)] hover:border-[var(--color-accent)] font-mono text-sm uppercase tracking-wider transition-colors"
                  >
                    {dict.hero.ctaManifesto}
                  </Link>
                </div>
              </FadeIn>

              <FadeIn delay={0.4}>
                <dl className="mt-12 grid grid-cols-3 gap-4 max-w-md">
                  {dict.hero.stats.map((s) => (
                    <div key={s.k} className="border-l border-[var(--color-border)] pl-3">
                      <dt className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-foreground-subtle)]">
                        {s.k}
                      </dt>
                      <dd className="font-mono text-2xl font-bold text-[var(--color-accent)]">
                        {s.v}
                      </dd>
                    </div>
                  ))}
                </dl>
              </FadeIn>
            </div>

            <FadeIn delay={0.3} className="hidden lg:block">
              <HeroAnimation />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* MANIFESTO BLOCK */}
      <section className="py-16 sm:py-24 border-b border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-accent)] mb-3">
              {dict.manifesto.label}
            </p>
            <h2 className="font-mono text-3xl sm:text-4xl font-bold mb-6 max-w-3xl">
              {dict.manifesto.title}
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {dict.manifesto.principles.map((p, i) => {
              const Icon = principleIcons[i] || Brain;
              return (
                <FadeIn key={p.title} delay={i * 0.1}>
                  <div className="group h-full p-6 border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-accent)] transition-colors">
                    <div className="w-10 h-10 border border-[var(--color-accent)] flex items-center justify-center mb-4 group-hover:bg-[var(--color-accent)] transition-colors">
                      <Icon className="w-5 h-5 text-[var(--color-accent)] group-hover:text-[var(--color-accent-foreground)] transition-colors" />
                    </div>
                    <h3 className="font-mono text-lg font-semibold mb-2">{p.title}</h3>
                    <p className="text-sm text-[var(--color-foreground-muted)] leading-relaxed">
                      {p.text}
                    </p>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* LATEST ARTICLES */}
      {latest.length > 0 && (
        <section className="py-16 sm:py-24 border-b border-[var(--color-border)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10 flex-wrap gap-3">
              <FadeIn>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-accent)] mb-2">
                  {dict.latest.label}
                </p>
                <h2 className="font-mono text-3xl sm:text-4xl font-bold">
                  {dict.latest.title}
                </h2>
              </FadeIn>
              <Link
                href={routes.blog(locale)}
                className="font-mono text-sm uppercase tracking-wider text-[var(--color-foreground-muted)] hover:text-[var(--color-accent)] transition-colors inline-flex items-center gap-1"
              >
                {dict.latest.all} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latest.map((article, i) => (
                <FadeIn key={article.slug} delay={i * 0.1}>
                  <ArticleCard article={article} locale={locale} />
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PROJECTS SHOWCASE */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-accent)] mb-2">
              {dict.projects.label}
            </p>
            <h2 className="font-mono text-3xl sm:text-4xl font-bold mb-3">
              {dict.projects.title}
            </h2>
            <p className="text-[var(--color-foreground-muted)] mb-10 max-w-2xl">
              {dict.projects.subtitle}
            </p>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {dict.projects.items.map((p, i) => {
              const Icon = [Code2, Network, Brain, Network][i] || Code2;
              return (
                <FadeIn key={p.title} delay={i * 0.1}>
                  <div className="group block p-6 border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-accent)] transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 border border-[var(--color-accent)] flex items-center justify-center group-hover:bg-[var(--color-accent)] transition-colors">
                        <Icon className="w-5 h-5 text-[var(--color-accent)] group-hover:text-[var(--color-accent-foreground)] transition-colors" />
                      </div>
                      <ArrowRight className="w-4 h-4 text-[var(--color-foreground-subtle)] group-hover:text-[var(--color-accent)] group-hover:translate-x-1 transition-all" />
                    </div>
                    <h3 className="font-mono text-lg font-semibold mb-2">{p.title}</h3>
                    <p className="text-sm text-[var(--color-foreground-muted)] leading-relaxed">
                      {p.text}
                    </p>
                    <div className="mt-4 flex gap-2 flex-wrap">
                      {p.tags.map((t) => (
                        <span
                          key={t}
                          className="font-mono text-[10px] uppercase tracking-wider px-1.5 py-0.5 border border-[var(--color-border)] text-[var(--color-foreground-muted)]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
