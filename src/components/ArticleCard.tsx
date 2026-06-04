import Link from "next/link";
import type { Article } from "@/lib/articles-types";
import { getTagLabel } from "@/lib/articles-types";

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const date = new Date(article.date).toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Link
      href={`/blog/${article.slug}`}
      className="group flex flex-col h-full border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-accent)]/40 transition-all duration-300 hover:-translate-y-1"
    >
      <div className="relative aspect-[16/9] overflow-hidden border-b border-[var(--color-border)] bg-[var(--color-background)]">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 70% 30%, var(--color-accent-glow), transparent 50%)`,
          }}
        />
        {article.cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.cover}
            alt={article.title}
            className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-foreground-subtle)]">
              A · С · С
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 p-5 flex flex-col">
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[var(--color-foreground-subtle)] mb-2">
          {article.tags?.[0] && (
            <span className="text-[var(--color-accent)]">
              {getTagLabel(article.tags[0])}
            </span>
          )}
          <span>·</span>
          <time dateTime={article.date}>{date}</time>
          {article.readingTime && (
            <>
              <span>·</span>
              <span>{article.readingTime} мин</span>
            </>
          )}
        </div>

        <h3 className="font-mono text-lg font-semibold leading-snug mb-2 group-hover:text-[var(--color-accent)] transition-colors line-clamp-2">
          {article.title}
        </h3>
        <p className="text-sm text-[var(--color-foreground-muted)] leading-relaxed line-clamp-2 flex-1">
          {article.description}
        </p>
      </div>
    </Link>
  );
}
