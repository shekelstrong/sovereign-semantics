import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Brain, Network, Shield, Eye, Zap, BookOpen } from "lucide-react";
import { isValidLocale } from "@/lib/dict";
import { routes } from "@/lib/routes";
import type { Locale as L } from "@/lib/articles-types";
import { getDict } from "@/lib/dict";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://sovereign-semantics.ru";

export async function generateStaticParams() {
  return [{ lang: "ru" }, { lang: "en" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const isEn = lang === "en";
  return {
    title: isEn ? "Manifesto" : "Манифест",
    description: isEn
      ? "Project philosophy: sober thinking, technological sovereignty, constructive patriotism, personal discipline."
      : "Философия проекта «Архитектура суверенных смыслов»: трезвое мышление, технологический суверенитет, конструктивный патриотизм, личная дисциплина.",
    alternates: {
      canonical: isEn ? `${SITE_URL}/en/manifesto` : `${SITE_URL}/manifesto`,
      languages: {
        ru: `${SITE_URL}/manifesto`,
        en: `${SITE_URL}/en/manifesto`,
      },
    },
    openGraph: {
      title: isEn ? "Manifesto · Architecture of Sovereign Meaning" : "Манифест · Архитектура суверенных смыслов",
      description: isEn ? "Sober thinking. Technological sovereignty. Personal responsibility." : "Трезвое мышление. Технологический суверенитет. Личная ответственность.",
      type: "website",
      url: isEn ? `${SITE_URL}/en/manifesto` : `${SITE_URL}/manifesto`,
      locale: isEn ? "en_US" : "ru_RU",
    },
  };
}

const PRINCIPLES_RU = [
  { icon: Brain, title: "Трезвый ум", text: "Ясность мышления — базовый ресурс. Без неё все остальные ресурсы конвертируются в шум. Алкоголь, деградация, прокрастинация — это не выбор, это симптомы поражения на уровне личной архитектуры." },
  { icon: Network, title: "Технологический суверенитет", text: "Страна, зависящая от чужого кода, проигрывает стране, зависящей от своего. IT-инфраструктура, модели ИИ, данные — это критические активы, которые должны быть под национальным контролем." },
  { icon: Shield, title: "Конструктивный патриотизм", text: "Поддержка суверенного курса России. Аргументированная, не слепая. Критика неэффективной бюрократии — это не предательство, а вклад в реальное развитие." },
  { icon: Eye, title: "Системный взгляд", text: "События связаны. Экономика, технологии, геополитика, культура — это единый организм. Анализ без системной перспективы — это мнение, а не знание." },
  { icon: Zap, title: "Личная ответственность", text: "Деньги — не самоцель, а инструмент влияния. Здоровье, дисциплина, навыки — это активы, которые нельзя делегировать. Государство не заменит родителя, тренера, инженера в собственной голове." },
  { icon: BookOpen, title: "Практика, не абстракции", text: "Каждая статья заканчивается «Практическим выводом» — что читатель может применить сегодня. Теория без действия — это развлечение для ума." },
];

const PRINCIPLES_EN = [
  { icon: Brain, title: "Sober mind", text: "Clarity of thought is the foundational resource. Without it, every other resource converts into noise. Alcohol, degradation, procrastination are not choices — they are symptoms of defeat at the level of personal architecture." },
  { icon: Network, title: "Technological sovereignty", text: "A country that depends on foreign code loses to a country that depends on its own. IT infrastructure, AI models, data are critical assets that must be under national control." },
  { icon: Shield, title: "Constructive patriotism", text: "Support for Russia's sovereign course — argued, not blind. Criticism of inefficient bureaucracy is not betrayal; it is a contribution to real development." },
  { icon: Eye, title: "Systemic view", text: "Events are connected. Economy, technology, geopolitics, culture are a single organism. Analysis without a systemic perspective is opinion, not knowledge." },
  { icon: Zap, title: "Personal responsibility", text: "Money is not the goal but a tool of influence. Health, discipline, skills are assets you cannot delegate. The state will not replace the parent, the coach, or the engineer inside your own head." },
  { icon: BookOpen, title: "Practice, not abstractions", text: "Every article ends with a 'Practical takeaway' — what the reader can apply today. Theory without action is entertainment for the mind." },
];

export default async function ManifestoPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isValidLocale(lang)) notFound();
  const locale = lang as L;
  const isEn = locale === "en";
  const principles = isEn ? PRINCIPLES_EN : PRINCIPLES_RU;
  const dict = getDict(locale);

  return (
    <>
      <section className="relative overflow-hidden border-b border-[var(--color-border)]">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(circle at 50% 0%, var(--color-accent-glow), transparent 50%)" }}
        />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-accent)] mb-4">
            ↓ /{isEn ? "en/manifesto" : "manifesto"}
          </p>
          <h1 className="font-mono text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-balance leading-[1.05]">
            {isEn ? "Architecture of" : "Архитектура"}
            <br />
            <span className="text-[var(--color-accent)]">
              {isEn ? "Sovereign Meaning" : "суверенных смыслов"}
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-[var(--color-foreground-muted)] max-w-2xl text-pretty leading-relaxed">
            {dict.manifesto_page.subtitle}
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose-article">
            <p className="text-xl text-[var(--color-foreground-muted)] leading-relaxed">
              <strong className="text-[var(--color-foreground)]">
                {isEn ? "«Architecture of Sovereign Meaning»" : "«Архитектура суверенных смыслов»"}
              </strong>{" "}
              {isEn
                ? "— is not a blog 'about everything'. It is an analytical platform with a clear position: sober mind is the foundation, technology is the tool, sovereignty is the goal."
                : "— это не блог «обо всём». Это аналитическая платформа с чёткой позицией: трезвый ум — фундамент, технологии — инструмент, суверенитет — цель."}
            </p>

            <h2>{isEn ? "Why «architecture» specifically" : "Почему именно «архитектура»"}</h2>
            <p>
              {isEn
                ? "The word «architecture» is not accidental here. In the IT industry, architecture is the structure of a system on which everything else depends: performance, security, capacity for change. The same is true for thinking and society."
                : "Слово «архитектура» здесь не случайно. В IT-индустрии архитектура — это структура системы, от которой зависит всё остальное: производительность, безопасность, способность к изменениям. То же самое — с мышлением и обществом."}
            </p>
            <p>
              {isEn
                ? "A nation has an architecture of meanings. If it is built on dependence on foreign code, foreign narratives, degrading habits — the system works against its own citizens. If it is built on clarity, discipline, technological literacy — the system amplifies those who live in it."
                : "У нации есть архитектура смыслов. Если она построена на зависимости от чужого кода, чужих нарративов, деградирующих привычек — система работает против своих же граждан. Если она построена на ясности, дисциплине, технологической грамотности — система усиливает тех, кто в ней живёт."}
            </p>

            <h2>{isEn ? "What we do" : "Что мы делаем"}</h2>
            <ul>
              <li>
                <strong>{isEn ? "Write longreads" : "Пишем лонгриды"}</strong>{" "}
                {isEn
                  ? "— analytical pieces of 2000+ words on topics: technological sovereignty, IT and AI, economy, health and cognitive performance."
                  : "— аналитические материалы от 2000 слов по темам: технологический суверенитет, IT и ИИ, экономика, ЗОЖ и когнитивная эффективность."}
              </li>
              <li>
                <strong>{isEn ? "Build IT solutions" : "Строим IT-решения"}</strong>{" "}
                {isEn
                  ? "— Telegram bots, AI agents, VPN infrastructure, analytical systems. Production-grade, not proof-of-concept."
                  : "— Telegram-боты, AI-агенты, VPN-инфраструктура, аналитические системы. Production-grade, не proof-of-concept."}
              </li>
              <li>
                <strong>{isEn ? "Share a systemic view" : "Делимся системным взглядом"}</strong>{" "}
                {isEn
                  ? "— how events are connected, what trends dominate, what to do at the level of business, career, personal strategy."
                  : "— как события связаны между собой, какие тренды доминируют, что делать на уровне бизнеса, карьеры, личной стратегии."}
              </li>
            </ul>

            <h2>{isEn ? "What we do not do" : "Чего мы не делаем"}</h2>
            <ul>
              <li>
                <strong>{isEn ? "No empty promises" : "Не даём пустых обещаний"}</strong>{" "}
                {isEn
                  ? "— «earn a million in a week», «secret techniques», «more relevant than ever» — not us."
                  : "— «заработай миллион за неделю», «секретные техники», «как никогда актуально» — это не про нас."}
              </li>
              <li>
                <strong>{isEn ? "No conspiracy theories" : "Не уходим в конспирологию"}</strong>{" "}
                {isEn
                  ? "— only professional terms: systemic management, architecture of meaning, macroeconomic cycles, technological sovereignty."
                  : "— только профессиональные термины: «системное управление», «архитектура смыслов», «макроэкономические циклы», «технологический суверенитет»."}
              </li>
              <li>
                <strong>{isEn ? "No stock photos of smiling people" : "Не используем стоковые фото улыбающихся людей"}</strong>{" "}
                {isEn
                  ? "— only abstract graphics, diagrams, neural-network imagery. Seriousness in visuals, as in content."
                  : "— только абстрактная графика, схемы, нейросетевые изображения. Серьёзность в визуале, как и в содержании."}
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[var(--color-surface)] border-y border-[var(--color-border)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-blue)] mb-2">
              ↓ {isEn ? "Principles" : "Принципы"}
            </p>
            <h2 className="font-mono text-3xl sm:text-4xl font-bold tracking-tight">
              {isEn ? "Six pillars of the architecture" : "Шесть опор архитектуры"}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {principles.map((p, i) => (
              <div
                key={p.title}
                className="p-6 border border-[var(--color-border)] bg-[var(--color-background)] hover:border-[var(--color-accent)]/30 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-10 h-10 border border-[var(--color-accent)]/40 flex items-center justify-center text-[var(--color-accent)] font-mono text-sm">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <p.icon className="w-4 h-4 text-[var(--color-accent)]" />
                      <h3 className="font-mono text-lg font-semibold">{p.title}</h3>
                    </div>
                    <p className="text-sm text-[var(--color-foreground-muted)] leading-relaxed">
                      {p.text}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-mono text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            {isEn ? "Sober mind · Clear code · Sovereignty" : "Трезвый ум · Ясный код · Суверенитет"}
          </h2>
          <p className="text-[var(--color-foreground-muted)] mb-8">
            {isEn
              ? "This is not a slogan. It is the operating system on which we build the project."
              : "Это не лозунг. Это операционная система, на которой мы строим проект."}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={routes.blog(locale)}
              className="px-6 py-3 bg-[var(--color-accent)] text-[var(--color-accent-foreground)] font-mono text-sm uppercase tracking-wider hover:shadow-[0_0_30px_var(--color-accent-glow)] transition-shadow"
            >
              {isEn ? "Read longreads" : "Читать лонгриды"}
            </Link>
            <Link
              href={routes.contact(locale)}
              className="px-6 py-3 border border-[var(--color-border)] hover:border-[var(--color-foreground-muted)] font-mono text-sm uppercase tracking-wider transition-colors"
            >
              {isEn ? "Contact" : "Связаться"}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
