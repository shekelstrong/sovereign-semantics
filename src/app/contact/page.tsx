import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { Send, Lock, Mail, MessageCircle, Code2, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Контакты · Архитектура суверенных смыслов",
  description:
    "Связаться с редакцией АСС: защищённая форма, Telegram, email, GitHub. Партнёрства, предложения, аналитические запросы.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Контакты · Архитектура суверенных смыслов",
    description: "Защищённая связь с редакцией.",
    url: "/contact",
  },
};

const channels = [
  {
    icon: Send,
    label: "Telegram-канал",
    handle: "@suveren_media",
    href: "https://t.me/suveren_media",
    description: "Основной канал. Аналитика, разборы, оперативные публикации.",
  },
  {
    icon: Mail,
    label: "Email",
    handle: "vasileneopekin@yandex.ru",
    href: "mailto:vasileneopekin@yandex.ru",
    description: "Для деловых предложений, партнёрств и редакционных запросов.",
  },
  {
    icon: Code2,
    label: "GitHub",
    handle: "@shekelstrong",
    href: "https://github.com/shekelstrong",
    description: "Open-source проекты, код, технические материалы.",
  },
];

export default function ContactPage() {
  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-accent)] mb-2">
            ↓ /contact
          </p>
          <h1 className="font-mono text-3xl sm:text-5xl font-bold mb-4">
            Связь с редакцией
          </h1>
          <p className="text-[var(--color-foreground-muted)] max-w-2xl">
            Партнёрства, аналитические запросы, предложения по материалам.
            Сообщения через форму шифруются и не уходят во внешние трекеры.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact channels */}
          <div className="space-y-4">
            <h2 className="font-mono text-sm uppercase tracking-[0.2em] text-[var(--color-foreground-muted)] mb-4">
              Прямые каналы
            </h2>
            {channels.map((ch) => {
              const Icon = ch.icon;
              return (
                <a
                  key={ch.label}
                  href={ch.href}
                  target={ch.href.startsWith("http") ? "_blank" : undefined}
                  rel={ch.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="block p-5 border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-accent)] transition-colors group"
                >
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 w-10 h-10 border border-[var(--color-accent)] flex items-center justify-center group-hover:bg-[var(--color-accent)] transition-colors">
                      <Icon className="w-4 h-4 text-[var(--color-accent)] group-hover:text-[var(--color-accent-foreground)] transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-xs uppercase tracking-wider text-[var(--color-foreground-muted)]">
                        {ch.label}
                      </p>
                      <p className="font-mono text-sm font-semibold mt-1 break-all">
                        {ch.handle}
                      </p>
                      <p className="text-xs text-[var(--color-foreground-muted)] mt-1.5 leading-relaxed">
                        {ch.description}
                      </p>
                    </div>
                  </div>
                </a>
              );
            })}

            <div className="p-5 border border-[var(--color-border)] bg-[var(--color-accent)]/5">
              <div className="flex items-start gap-3">
                <Lock className="w-4 h-4 text-[var(--color-accent)] mt-0.5 shrink-0" />
                <div>
                  <p className="font-mono text-xs uppercase tracking-wider text-[var(--color-accent)] mb-1">
                    Приватность
                  </p>
                  <p className="text-sm text-[var(--color-foreground-muted)] leading-relaxed">
                    Форма ниже отправляет данные только на сервер редакции.
                    Никаких внешних аналитик, рекламных пикселей и трекеров.
                    Сообщения хранятся локально.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div>
            <h2 className="font-mono text-sm uppercase tracking-[0.2em] text-[var(--color-foreground-muted)] mb-4">
              Форма обратной связи
            </h2>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
