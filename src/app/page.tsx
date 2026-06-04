import Link from "next/link";
import { ArrowRight, FileText, Code2, Brain, Network } from "lucide-react";
import { getLatestArticles } from "@/lib/articles";
import { ArticleCard } from "@/components/ArticleCard";
import { HeroGrid } from "@/components/HeroGrid";
import { FadeIn } from "@/components/FadeIn";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const latest = await getLatestArticles(3);

  const projects = [
    {
      icon: Code2,
      title: "Telegram-боты",
      description:
        "Автоматизация модерации, платежей, поддержки. Production-grade Python.",
      tag: "Production",
    },
    {
      icon: Brain,
      title: "AI-агенты",
      description:
        "Автономные агенты, пишущие код, ведущие блоги, оптимизирующие процессы.",
      tag: "R&D",
    },
    {
      icon: Network,
      title: "VPN-инфраструктура",
      description:
        "Собственный стек: Marzban + кастомные протоколы. Суверенный интернет.",
      tag: "Infrastructure",
    },
    {
      icon: FileText,
      title: "Аналитические системы",
      description:
        "RAG-поиск по юридическим базам, медицине, государственным реестрам.",
      tag: "Production",
    },
  ];

  return (
    <>
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden border-b border-[var(--color-border)]">
        <div className="absolute inset-0 bg-grid-animated opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--color-background)]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <HeroGrid />

          <div className="max-w-4xl">
            <FadeIn delay={0.1}>
              <div className="inline-flex items-center gap-2 mb-6 px-3 py-1 border border-[var(--color-accent)]/30 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] animate-pulse" />
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-accent)]">
                  v1.0 · Запуск
                </span>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <h1 className="font-mono text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-balance mb-6 leading-[1.05]">
                Архитектура
                <br />
                <span className="text-[var(--color-accent)]">суверенных</span>{" "}
                смыслов
              </h1>
            </FadeIn>

            <FadeIn delay={0.3}>
              <p className="text-lg sm:text-xl text-[var(--color-foreground-muted)] max-w-2xl text-pretty leading-relaxed mb-10">
                Аналитика. Технологии. Суверенитет. Лонгриды о технологическом
                суверенитете, искусственном интеллекте и трезвом мышлении как
                стратегическом преимуществе нации.
              </p>
            </FadeIn>

            <FadeIn delay={0.4}>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/blog"
                  className="group inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--color-accent)] text-[var(--color-accent-foreground)] font-mono text-sm uppercase tracking-wider hover:shadow-[0_0_30px_var(--color-accent-glow)] transition-shadow"
                >
                  Читать блог
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/manifesto"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-[var(--color-border)] hover:border-[var(--color-foreground-muted)] font-mono text-sm uppercase tracking-wider transition-colors"
                >
                  Манифест
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ============ LATEST ARTICLES ============ */}
      <section className="py-20 sm:py-24 border-b border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-accent)] mb-2">
                  ↓ Свежие публикации
                </p>
                <h2 className="font-mono text-3xl sm:text-4xl font-bold tracking-tight">
                  Лента аналитики
                </h2>
              </div>
              <Link
                href="/blog"
                className="hidden sm:inline-flex items-center gap-1 font-mono text-sm uppercase tracking-wider text-[var(--color-foreground-muted)] hover:text-[var(--color-accent)] transition-colors"
              >
                Все статьи →
              </Link>
            </div>
          </FadeIn>

          {latest.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latest.map((article, i) => (
                <FadeIn key={article.slug} delay={0.1 + i * 0.1}>
                  <ArticleCard article={article} />
                </FadeIn>
              ))}
            </div>
          ) : (
            <p className="text-[var(--color-foreground-muted)] font-mono text-sm">
              Статьи появятся в ближайшее время.
            </p>
          )}
        </div>
      </section>

      {/* ============ PROJECTS SHOWCASE ============ */}
      <section className="py-20 sm:py-24 bg-[var(--color-surface)] border-b border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="mb-12">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-blue)] mb-2">
                ↓ Engineering
              </p>
              <h2 className="font-mono text-3xl sm:text-4xl font-bold tracking-tight mb-3">
                Наши проекты
              </h2>
              <p className="text-[var(--color-foreground-muted)] max-w-2xl text-pretty">
                Витрина IT-решений, построенных на принципах технологического
                суверенитета. Каждый проект — production, не proof-of-concept.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((project, i) => (
              <FadeIn key={project.title} delay={0.1 + i * 0.1}>
                <div className="group relative p-6 border border-[var(--color-border)] bg-[var(--color-background)] hover:border-[var(--color-accent)]/40 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <project.icon className="w-8 h-8 text-[var(--color-accent)]" />
                    <span className="font-mono text-xs uppercase tracking-wider text-[var(--color-foreground-subtle)] border border-[var(--color-border)] px-2 py-0.5">
                      {project.tag}
                    </span>
                  </div>
                  <h3 className="font-mono text-lg font-semibold mb-2">
                    {project.title}
                  </h3>
                  <p className="text-sm text-[var(--color-foreground-muted)] leading-relaxed">
                    {project.description}
                  </p>
                  <div className="mt-4 flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-[var(--color-foreground-subtle)] group-hover:text-[var(--color-accent)] transition-colors">
                    В разработке
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="py-20 sm:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-accent)] mb-4">
              ↓ Присоединиться
            </p>
            <h2 className="font-mono text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-balance">
              Трезвый ум · Ясный код · Суверенитет
            </h2>
            <p className="text-[var(--color-foreground-muted)] mb-8 text-pretty">
              Подпишитесь на Telegram-канал — там публикуются расширенные
              материалы, закрытая аналитика и оперативные разборы событий.
            </p>
            <a
              href="https://t.me/sovereign_semantics"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 border border-[var(--color-accent)] text-[var(--color-accent)] font-mono text-sm uppercase tracking-wider hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-foreground)] transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] animate-pulse" />
              Telegram-канал
            </a>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
