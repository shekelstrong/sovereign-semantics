import Link from "next/link";
import { ArrowRight, FileText, Code2, Brain, Network } from "lucide-react";
import { getLatestArticles } from "@/lib/articles";
import { ArticleCard } from "@/components/ArticleCard";
import { HeroAnimation } from "@/components/HeroAnimation";
import { FadeIn } from "@/components/FadeIn";
import { HeroGrid } from "@/components/HeroGrid";

export default async function HomePage() {
  const latest = await getLatestArticles(3);

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
                  Трезвый ум · Ясный код · Суверенитет
                </p>
              </FadeIn>

              <FadeIn delay={0.1}>
                <h1 className="font-mono text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight mb-6">
                  АРХИТЕКТУРА
                  <br />
                  <span className="text-[var(--color-accent)]">СУВЕРЕННЫХ</span>
                  <br />
                  СМЫСЛОВ
                </h1>
              </FadeIn>

              <FadeIn delay={0.2}>
                <p className="text-lg text-[var(--color-foreground-muted)] leading-relaxed mb-8 max-w-xl">
                  Аналитика без истерики. Технологический суверенитет России,
                  IT и&nbsp;ИИ как инструменты влияния, спорт и&nbsp;ясность мышления
                  как фундамент личной эффективности.
                </p>
              </FadeIn>

              <FadeIn delay={0.3}>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/blog"
                    className="group inline-flex items-center gap-2 px-5 py-3 bg-[var(--color-accent)] text-[var(--color-accent-foreground)] font-mono text-sm uppercase tracking-wider hover:shadow-[0_0_30px_var(--color-accent-glow)] transition-shadow"
                  >
                    Читать лонгриды
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    href="/manifesto"
                    className="inline-flex items-center gap-2 px-5 py-3 border border-[var(--color-border)] hover:border-[var(--color-accent)] font-mono text-sm uppercase tracking-wider transition-colors"
                  >
                    Манифест
                  </Link>
                </div>
              </FadeIn>

              <FadeIn delay={0.4}>
                <dl className="mt-12 grid grid-cols-3 gap-4 max-w-md">
                  {[
                    { k: "Лонгридов", v: "12+" },
                    { k: "Тем", v: "5" },
                    { k: "Без воды", v: "100%" },
                  ].map((s) => (
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

            {/* SVG-анимация справа */}
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
              ↓ МАНИФЕСТ
            </p>
            <h2 className="font-mono text-3xl sm:text-4xl font-bold mb-6 max-w-3xl">
              Аналитика как&nbsp;инструмент, а&nbsp;не&nbsp;развлечение
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Brain,
                title: "Трезвый ум",
                text: "Системный взгляд вместо эмоций. Логика, факты, макроэкономические циклы. Никаких клише и «как никогда актуально».",
              },
              {
                icon: Network,
                title: "Архитектура смыслов",
                text: "Технологии, политика, экономика — не отдельные топики, а единая карта. Связи важнее событий.",
              },
              {
                icon: Code2,
                title: "Суверенитет",
                text: "Свобода для бизнеса и технологий. Деньги — инструмент влияния, а не самоцель. Россия — страна возможностей для ясного ума.",
              },
            ].map((c, i) => {
              const Icon = c.icon;
              return (
                <FadeIn key={c.title} delay={i * 0.1}>
                  <div className="group h-full p-6 border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-accent)] transition-colors">
                    <div className="w-10 h-10 border border-[var(--color-accent)] flex items-center justify-center mb-4 group-hover:bg-[var(--color-accent)] transition-colors">
                      <Icon className="w-5 h-5 text-[var(--color-accent)] group-hover:text-[var(--color-accent-foreground)] transition-colors" />
                    </div>
                    <h3 className="font-mono text-lg font-semibold mb-2">{c.title}</h3>
                    <p className="text-sm text-[var(--color-foreground-muted)] leading-relaxed">
                      {c.text}
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
                  ↓ ЛОНГРИДЫ
                </p>
                <h2 className="font-mono text-3xl sm:text-4xl font-bold">
                  Свежие материалы
                </h2>
              </FadeIn>
              <Link
                href="/blog"
                className="font-mono text-sm uppercase tracking-wider text-[var(--color-foreground-muted)] hover:text-[var(--color-accent)] transition-colors inline-flex items-center gap-1"
              >
                Все статьи <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latest.map((article, i) => (
                <FadeIn key={article.slug} delay={i * 0.1}>
                  <ArticleCard article={article} />
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
              ↓ ВИТРИНА
            </p>
            <h2 className="font-mono text-3xl sm:text-4xl font-bold mb-3">
              Наши проекты
            </h2>
            <p className="text-[var(--color-foreground-muted)] mb-10 max-w-2xl">
              IT-решения, которые мы делаем руками. Каждый — рабочий, не презентация.
            </p>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {projects.map((p, i) => (
              <FadeIn key={p.title} delay={i * 0.1}>
                <a
                  href={p.href}
                  target={p.href.startsWith("http") ? "_blank" : undefined}
                  rel={p.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="group block p-6 border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-accent)] transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 border border-[var(--color-accent)] flex items-center justify-center group-hover:bg-[var(--color-accent)] transition-colors">
                      <p.icon className="w-5 h-5 text-[var(--color-accent)] group-hover:text-[var(--color-accent-foreground)] transition-colors" />
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
                </a>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

const projects = [
  {
    icon: Code2,
    title: "Sovereign Semantics",
    text: "Этот сайт. Headless CMS на Git, AI-агент API, авто-деплой на Vercel. Демонстрация архитектуры.",
    tags: ["Next.js", "CMS", "AI"],
    href: "https://github.com/shekelstrong/sovereign-semantics",
  },
  {
    icon: Network,
    title: "Telegram-бот инфраструктура",
    text: "Модерация, аналитика контента, автоматизация. Боты в проде на нескольких серверах.",
    tags: ["aiogram", "production"],
    href: "https://github.com/shekelstrong",
  },
  {
    icon: Brain,
    title: "AI-аналитика для бизнеса",
    text: "Готовые пайплайны на базе LLM: от сбора данных до структурированных отчётов. OpenRouter, кастомные промпты.",
    tags: ["LLM", "automation"],
    href: "https://github.com/shekelstrong",
  },
  {
    icon: FileText,
    title: "Obsidian Knowledge Base",
    text: "Граф-связанная база знаний для исследований, стратегий и продуктового анализа.",
    tags: ["obsidian", "wiki"],
    href: "https://github.com/shekelstrong/nemo-team-docs",
  },
];
