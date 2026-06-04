"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { Article, ArticleTag } from "@/lib/articles-types";
import { getTagLabel } from "@/lib/articles-types";
import { ArticleCard } from "./ArticleCard";

interface BlogExplorerProps {
  articles: Article[];
  tags: ArticleTag[];
}

type Filter = "all" | ArticleTag;

export function BlogExplorer({ articles, tags }: BlogExplorerProps) {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return articles.filter((a) => {
      const matchesTag = filter === "all" || a.tags.includes(filter);
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        a.title.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q);
      return matchesTag && matchesQuery;
    });
  }, [articles, filter, query]);

  return (
    <>
      {/* Search + Filters */}
      <div className="mb-10 space-y-5">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-foreground-subtle)]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск по заголовку и описанию..."
            className="w-full pl-11 pr-4 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] focus:border-[var(--color-accent)] focus:outline-none font-mono text-sm placeholder:text-[var(--color-foreground-subtle)] transition-colors"
            aria-label="Поиск по статьям"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <FilterButton
            active={filter === "all"}
            onClick={() => setFilter("all")}
          >
            Все темы · {articles.length}
          </FilterButton>
          {tags.map((tag) => {
            const count = articles.filter((a) => a.tags.includes(tag)).length;
            if (count === 0) return null;
            return (
              <FilterButton
                key={tag}
                active={filter === tag}
                onClick={() => setFilter(tag)}
              >
                {getTagLabel(tag)} · {count}
              </FilterButton>
            );
          })}
        </div>
      </div>

      {/* Results */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border border-dashed border-[var(--color-border)]">
          <p className="font-mono text-sm uppercase tracking-wider text-[var(--color-foreground-muted)] mb-2">
            Нет результатов
          </p>
          <p className="text-sm text-[var(--color-foreground-subtle)]">
            Попробуйте изменить фильтр или запрос
          </p>
        </div>
      )}
    </>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "px-3 py-1.5 font-mono text-xs uppercase tracking-wider border transition-colors",
        active
          ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-accent-foreground)]"
          : "border-[var(--color-border)] text-[var(--color-foreground-muted)] hover:border-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)]",
      ].join(" ")}
      aria-pressed={active}
    >
      {children}
    </button>
  );
}
