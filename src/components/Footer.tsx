import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)] mt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-8 h-8 flex items-center justify-center">
                <div className="absolute inset-0 border border-[var(--color-accent)] rounded-sm rotate-45" />
                <span className="relative font-mono text-sm font-bold text-[var(--color-accent)]">
                  А
                </span>
              </div>
              <span className="font-mono text-sm uppercase tracking-wider text-[var(--color-foreground)]">
                Архитектура суверенных смыслов
              </span>
            </div>
            <p className="text-sm text-[var(--color-foreground-muted)] leading-relaxed max-w-sm">
              Аналитический блог о технологическом суверенитете, IT, ИИ и
              трезвом мышлении. Лонгриды, стратегии, практика.
            </p>
          </div>

          <div>
            <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-foreground-muted)] mb-4">
              Навигация
            </h3>
            <ul className="space-y-2">
              {[
                { href: "/", label: "Главная" },
                { href: "/blog", label: "Блог" },
                { href: "/manifesto", label: "Манифест" },
                { href: "/contact", label: "Контакты" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-foreground-muted)] mb-4">
              Каналы
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://t.me/sovereign_semantics"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[var(--color-foreground-muted)] hover:text-[var(--color-accent)] transition-colors"
                >
                  Telegram →
                </a>
              </li>
              <li>
                <a
                  href="https://vk.com/sovereign_semantics"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[var(--color-foreground-muted)] hover:text-[var(--color-accent)] transition-colors"
                >
                  VK →
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@sovereign-semantics.ru"
                  className="text-sm text-[var(--color-foreground-muted)] hover:text-[var(--color-accent)] transition-colors"
                >
                  Email →
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-mono text-xs uppercase tracking-wider text-[var(--color-foreground-subtle)]">
            © {year} Архитектура суверенных смыслов
          </p>
          <p className="font-mono text-xs uppercase tracking-wider text-[var(--color-foreground-subtle)]">
            Трезвый ум · Ясный код · Суверенитет
          </p>
        </div>
      </div>
    </footer>
  );
}
