import Link from "next/link";
import { Mail, Send, Code2, MessageCircle, MapPin } from "lucide-react";
import { LogoMark } from "@/components/Logo";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)] mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 flex items-center justify-center">
                <LogoMark size={32} />
              </div>
              <span className="font-mono text-sm font-semibold">АСС</span>
            </div>
            <p className="text-sm text-[var(--color-foreground-muted)] leading-relaxed">
              Трезвый ум · Ясный код · Технологический суверенитет
            </p>
          </div>

          {/* Sections */}
          <div>
            <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-foreground-muted)] mb-3">
              Разделы
            </h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-[var(--color-accent)] transition-colors">Главная</Link></li>
              <li><Link href="/blog" className="hover:text-[var(--color-accent)] transition-colors">Блог</Link></li>
              <li><Link href="/manifesto" className="hover:text-[var(--color-accent)] transition-colors">Манифест</Link></li>
              <li><Link href="/contact" className="hover:text-[var(--color-accent)] transition-colors">Контакты</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-foreground-muted)] mb-3">
              Контакты
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://t.me/suveren_media"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-[var(--color-accent)] transition-colors"
                >
                  <Send className="w-3.5 h-3.5" /> Telegram
                </a>
              </li>
              <li>
                <a
                  href="mailto:vasileneopekin@yandex.ru"
                  className="flex items-center gap-2 hover:text-[var(--color-accent)] transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" /> Email
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/shekelstrong"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-[var(--color-accent)] transition-colors"
                >
                  <Code2 className="w-3.5 h-3.5" /> GitHub
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-foreground-muted)] mb-3">
              Подписаться
            </h3>
            <p className="text-sm text-[var(--color-foreground-muted)] mb-3">
              Аналитика · IT · ИИ. Без воды.
            </p>
            <a
              href="https://t.me/suveren_media"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-[var(--color-accent)] text-[var(--color-accent-foreground)] font-mono text-xs uppercase tracking-wider hover:shadow-[0_0_20px_var(--color-accent-glow)] transition-shadow"
            >
              <MessageCircle className="w-3.5 h-3.5" /> @suveren_media
            </a>
          </div>
        </div>

        <div className="pt-6 border-t border-[var(--color-border)] flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-[var(--color-foreground-subtle)]">
          <p>© {year} Архитектура суверенных смыслов. Все права защищены.</p>
          <p className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] animate-pulse" />
            v1.0 · Москва
          </p>
        </div>
      </div>
    </footer>
  );
}
