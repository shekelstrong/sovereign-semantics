import type { Metadata } from "next";
import { Mail, Send, Code2 } from "lucide-react";
import { isValidLocale } from "@/lib/dict";
import { routes } from "@/lib/routes";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://sovereign-semantics.vercel.app";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isValidLocale(lang)) return { title: "Not found" };
  const isEn = lang === "en";
  return {
    title: isEn ? "About" : "О проекте",
    description: isEn
      ? "About Architecture of Sovereign Meaning: methodology, editorial principles, contacts. E-E-A-T compliant."
      : "Об Архитектуре суверенных смыслов: методология, принципы редакции, контакты. Соответствует E-E-A-T.",
    alternates: {
      canonical: isEn ? `${SITE_URL}/en/about` : `${SITE_URL}/about`,
      languages: {
        ru: `${SITE_URL}/about`,
        en: `${SITE_URL}/en/about`,
      },
    },
  };
}

const dict = {
  ru: {
    label: "↓ О ПРОЕКТЕ",
    title: "Архитектура суверенных смыслов",
    subtitle: "Кто мы, зачем и как пишем.",
    methodologyTitle: "Методология",
    methodology: [
      {
        h: "Системный взгляд",
        p: "Любая тема — это система. Технология, политика, экономика, когнитивная эффективность — единая карта связей, а не отдельные топики.",
      },
      {
        h: "Фактчек и ссылки",
        p: "Каждая цифра — с источником и датой. Никаких «эксперты считают» без конкретной фамилии.",
      },
      {
        h: "Анти-хайп",
        p: "Без «революций», без «как никогда актуально», без «эксперты шокированы». Трезвый ум — фундамент.",
      },
      {
        h: "Архитектурный подход",
        p: "Разбираем до уровня компонентов и связей. Не «что случилось», а «почему устроено именно так».",
      },
    ],
    editorialTitle: "Редакция",
    editorial: {
      name: "Редакция АСС",
      role: "Автор и редактор",
      bio: "Василий Недопёкин — автор блога, разработчик, исследователь технологического суверенитета. Делает IT-инфраструктуру, Telegram-ботов, AI-агентов. Ведёт канал @suveren_media. Профиль GitHub: shekelstrong.",
    },
    contactTitle: "Контакты",
    contactText: "Связаться с редакцией, предложить тему или стать гостем:",
  },
  en: {
    label: "↓ ABOUT",
    title: "Architecture of Sovereign Meaning",
    subtitle: "Who we are, why we write, and how we work.",
    methodologyTitle: "Methodology",
    methodology: [
      { h: "Systemic view", p: "Every topic is a system. Technology, politics, economy, cognitive performance — a single map of connections, not separate boxes." },
      { h: "Fact-check & sources", p: "Every number has a source and a date. No 'experts say' without a name." },
      { h: "Anti-hype", p: "No 'revolutions', no 'more relevant than ever', no 'experts shocked'. Sober mind is the foundation." },
      { h: "Architectural approach", p: "We break things down to components and connections. Not 'what happened' but 'why it's built this way'." },
    ],
    editorialTitle: "Editorial",
    editorial: {
      name: "Sovereign Semantics Editorial",
      role: "Author & Editor",
      bio: "Vasily Nedopekin — blog author, developer, researcher of technological sovereignty. Builds IT infrastructure, Telegram bots, AI agents. Runs the @suveren_media channel. GitHub: shekelstrong.",
    },
    contactTitle: "Contacts",
    contactText: "Reach out, pitch a story, or be a guest:",
  },
};

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isValidLocale(lang)) return null;
  const isEn = lang === "en";
  const t = dict[isEn ? "en" : "ru"];
  const url = isEn ? `${SITE_URL}/en/about` : `${SITE_URL}/about`;

  // JSON-LD: AboutPage + Organization + Person (E-E-A-T)
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        "@id": `${url}#about`,
        url,
        name: t.title,
        description: t.subtitle,
        inLanguage: isEn ? "en-US" : "ru-RU",
        isPartOf: { "@id": `${SITE_URL}/#website` },
      },
      {
        "@type": "Person",
        "@id": `${SITE_URL}/about#author`,
        name: t.editorial.name,
        jobTitle: t.editorial.role,
        description: t.editorial.bio,
        url: `${SITE_URL}/about`,
        sameAs: [
          "https://github.com/shekelstrong",
          "https://t.me/suveren_media",
        ],
        email: "mailto:vasileneopekin@yandex.ru",
        worksFor: { "@id": `${SITE_URL}/#organization` },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="py-12 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-accent)] mb-4">
            {t.label}
          </p>
          <h1 className="font-mono text-4xl sm:text-5xl font-bold tracking-tight leading-[1.1] mb-4 text-balance">
            {t.title}
          </h1>
          <p className="text-lg text-[var(--color-foreground-muted)] leading-relaxed mb-12 text-pretty">
            {t.subtitle}
          </p>

          {/* Methodology */}
          <section className="mb-16">
            <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-foreground-muted)] mb-6">
              ↓ {t.methodologyTitle}
            </h2>
            <div className="space-y-6">
              {t.methodology.map((m, i) => (
                <div key={i} className="border-l-2 border-[var(--color-accent)]/40 pl-5">
                  <h3 className="font-mono text-lg font-semibold mb-2">{m.h}</h3>
                  <p className="text-[var(--color-foreground-muted)] leading-relaxed">{m.p}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Editorial */}
          <section className="mb-16">
            <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-foreground-muted)] mb-6">
              ↓ {t.editorialTitle}
            </h2>
            <div className="p-6 border border-[var(--color-border)] bg-[var(--color-surface)]">
              <h3 className="font-mono text-xl font-semibold mb-1">
                {t.editorial.name}
              </h3>
              <p className="text-xs text-[var(--color-accent)] uppercase tracking-wider font-mono mb-4">
                {t.editorial.role}
              </p>
              <p className="text-[var(--color-foreground-muted)] leading-relaxed">
                {t.editorial.bio}
              </p>
            </div>
          </section>

          {/* Contacts */}
          <section>
            <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-foreground-muted)] mb-6">
              ↓ {t.contactTitle}
            </h2>
            <p className="text-[var(--color-foreground-muted)] leading-relaxed mb-6">
              {t.contactText}
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://t.me/suveren_media"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 border border-[var(--color-accent)]/40 hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)]/10 font-mono text-sm transition-colors"
              >
                <Send className="w-4 h-4" />
                @suveren_media
              </a>
              <a
                href="mailto:vasileneopekin@yandex.ru"
                className="inline-flex items-center gap-2 px-4 py-2 border border-[var(--color-accent)]/40 hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)]/10 font-mono text-sm transition-colors"
              >
                <Mail className="w-4 h-4" />
                vasileneopekin@yandex.ru
              </a>
              <a
                href="https://github.com/shekelstrong"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 border border-[var(--color-accent)]/40 hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)]/10 font-mono text-sm transition-colors"
              >
                <Code2 className="w-4 h-4" />
                github.com/shekelstrong
              </a>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
