import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { Send, Lock, Mail, MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Контакты",
  description:
    "Защищённая форма обратной связи, прямые ссылки на Telegram и VK. Связь с редакцией «Архитектура суверенных смыслов».",
  alternates: { canonical: "/contact" },
  robots: { index: false, follow: true },
  openGraph: {
    title: "Контакты · Архитектура суверенных смыслов",
    description: "Защищённая связь с редакцией.",
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <section className="py-16 sm:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-12 max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-accent)] mb-3">
            ↓ /contact
          </p>
          <h1 className="font-mono text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Связь с редакцией
          </h1>
          <p className="text-[var(--color-foreground-muted)] text-pretty">
            Защищённые каналы обратной связи. Форма шифруется на стороне
            клиента, письма идут напрямую редакции. Для оперативных вопросов —
            Telegram.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Form */}
          <div className="lg:col-span-3">
            <div className="p-6 sm:p-8 border border-[var(--color-border)] bg-[var(--color-surface)]">
              <div className="flex items-center gap-2 mb-6 font-mono text-xs uppercase tracking-wider text-[var(--color-foreground-muted)]">
                <Lock className="w-3.5 h-3.5 text-[var(--color-accent)]" />
                End-to-end зашифровано (клиент → сервер)
              </div>
              <ContactForm />
            </div>
          </div>

          {/* Channels */}
          <aside className="lg:col-span-2 space-y-4">
            <ChannelCard
              icon={Send}
              title="Telegram"
              handle="@sovereign_semantics"
              href="https://t.me/sovereign_semantics"
              accent
            />
            <ChannelCard
              icon={MessageCircle}
              title="VK"
              handle="vk.com/sovereign_semantics"
              href="https://vk.com/sovereign_semantics"
            />
            <ChannelCard
              icon={Mail}
              title="Email"
              handle="hello@sovereign-semantics.ru"
              href="mailto:hello@sovereign-semantics.ru"
            />

            <div className="p-5 border border-[var(--color-border)] bg-[var(--color-background)]">
              <p className="font-mono text-xs uppercase tracking-wider text-[var(--color-foreground-muted)] mb-2">
                PGP-ключ
              </p>
              <p className="text-xs text-[var(--color-foreground-subtle)] font-mono break-all leading-relaxed">
                0xA4F1 9B2C 8E3D 7F05
                <br />
                sovereign@protonmail.com
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

function ChannelCard({
  icon: Icon,
  title,
  handle,
  href,
  accent = false,
}: {
  icon: typeof Send;
  title: string;
  handle: string;
  href: string;
  accent?: boolean;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={[
        "flex items-center gap-4 p-4 border transition-colors group",
        accent
          ? "border-[var(--color-accent)]/40 bg-[var(--color-accent)]/5 hover:bg-[var(--color-accent)]/10"
          : "border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-foreground-muted)]",
      ].join(" ")}
    >
      <div
        className={[
          "shrink-0 w-10 h-10 flex items-center justify-center border",
          accent
            ? "border-[var(--color-accent)]/40 text-[var(--color-accent)]"
            : "border-[var(--color-border)] text-[var(--color-foreground-muted)]",
        ].join(" ")}
      >
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-mono text-xs uppercase tracking-wider text-[var(--color-foreground-muted)]">
          {title}
        </p>
        <p className="font-mono text-sm text-[var(--color-foreground)] truncate">
          {handle}
        </p>
      </div>
      <span className="font-mono text-xs uppercase tracking-wider text-[var(--color-foreground-subtle)] group-hover:text-[var(--color-accent)] transition-colors">
        →
      </span>
    </a>
  );
}
