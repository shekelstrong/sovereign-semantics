import type { Metadata } from "next";
import Link from "next/link";
import { Brain, Network, Shield, Eye, Zap, BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "Манифест",
  description:
    "Философия проекта «Архитектура суверенных смыслов»: трезвое мышление, технологический суверенитет, конструктивный патриотизм, личная дисциплина.",
  alternates: { canonical: "/manifesto" },
  openGraph: {
    title: "Манифест · Архитектура суверенных смыслов",
    description: "Трезвое мышление. Технологический суверенитет. Личная ответственность.",
    type: "website",
  },
};

const principles = [
  {
    icon: Brain,
    title: "Трезвый ум",
    text: "Ясность мышления — базовый ресурс. Без неё все остальные ресурсы конвертируются в шум. Алкоголь, деградация, прокрастинация — это не выбор, это симптомы поражения на уровне личной архитектуры.",
  },
  {
    icon: Network,
    title: "Технологический суверенитет",
    text: "Страна, зависящая от чужого кода, проигрывает стране, зависящей от своего. IT-инфраструктура, модели ИИ, данные — это критические активы, которые должны быть под национальным контролем.",
  },
  {
    icon: Shield,
    title: "Конструктивный патриотизм",
    text: "Поддержка суверенного курса России. Аргументированная, не слепая. Критика неэффективной бюрократии — это не предательство, а вклад в реальное развитие.",
  },
  {
    icon: Eye,
    title: "Системный взгляд",
    text: "События связаны. Экономика, технологии, геополитика, культура — это единый организм. Анализ без системной перспективы — это мнение, а не знание.",
  },
  {
    icon: Zap,
    title: "Личная ответственность",
    text: "Деньги — не самоцель, а инструмент влияния. Здоровье, дисциплина, навыки — это активы, которые нельзя делегировать. Государство не заменит родителя, тренера, инженера в собственной голове.",
  },
  {
    icon: BookOpen,
    title: "Практика, не абстракции",
    text: "Каждая статья заканчивается «Практическим выводом» — что читатель может применить сегодня. Теория без действия — это развлечение для ума.",
  },
];

export default function ManifestoPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[var(--color-border)]">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 0%, var(--color-accent-glow), transparent 50%)",
          }}
        />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-accent)] mb-4">
            ↓ /manifesto
          </p>
          <h1 className="font-mono text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-balance leading-[1.05]">
            Архитектура
            <br />
            <span className="text-[var(--color-accent)]">суверенных смыслов</span>
          </h1>
          <p className="text-lg sm:text-xl text-[var(--color-foreground-muted)] max-w-2xl text-pretty leading-relaxed">
            Проект о технологическом суверенитете, искусственном интеллекте и
            трезвом мышлении. Без истерики, без маргинальной конспирологии,
            без личных фото — только аналитика, факты и архитектура.
          </p>
        </div>
      </section>

      {/* Main text */}
      <section className="py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose-article">
            <p className="text-xl text-[var(--color-foreground-muted)] leading-relaxed">
              <strong className="text-[var(--color-foreground)]">
                «Архитектура суверенных смыслов»
              </strong>{" "}
              — это не блог «обо всём». Это аналитическая платформа с чёткой
              позицией: <strong>трезвый ум — фундамент</strong>, технологии —
              инструмент, суверенитет — цель.
            </p>

            <h2>Почему именно «архитектура»</h2>
            <p>
              Слово «архитектура» здесь не случайно. В IT-индустрии
              архитектура — это структура системы, от которой зависит всё
              остальное: производительность, безопасность, способность к
              изменениям. <strong>То же самое — с мышлением и обществом</strong>.
            </p>
            <p>
              У нации есть архитектура смыслов. Если она построена на зависимости
              от чужого кода, чужих нарративов, деградирующих привычек — система
              работает против своих же граждан. Если она построена на
              <strong> ясности, дисциплине, технологической грамотности</strong> —
              система усиливает тех, кто в ней живёт.
            </p>

            <h2>Что мы делаем</h2>
            <ul>
              <li>
                <strong>Пишем лонгриды</strong> — аналитические материалы от 2000
                слов по темам: технологический суверенитет, IT и ИИ, экономика,
                ЗОЖ и когнитивная эффективность.
              </li>
              <li>
                <strong>Строим IT-решения</strong> — Telegram-боты, AI-агенты,
                VPN-инфраструктура, аналитические системы. Production-grade, не
                proof-of-concept.
              </li>
              <li>
                <strong>Делимся системным взглядом</strong> — как события связаны
                между собой, какие тренды доминируют, что делать на уровне
                бизнеса, карьеры, личной стратегии.
              </li>
            </ul>

            <h2>Чего мы не делаем</h2>
            <ul>
              <li>
                <strong>Не даём пустых обещаний</strong> — «заработай миллион за
                неделю», «секретные техники», «как никогда актуально» — это не
                про нас.
              </li>
              <li>
                <strong>Не уходим в конспирологию</strong> — только профессиональные
                термины: «системное управление», «архитектура смыслов»,
                «макроэкономические циклы», «технологический суверенитет».
              </li>
              <li>
                <strong>Не используем стоковые фото улыбающихся людей</strong> —
                только абстрактная графика, схемы, нейросетевые изображения.
                Серьёзность в визуале, как и в содержании.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Principles grid */}
      <section className="py-20 bg-[var(--color-surface)] border-y border-[var(--color-border)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-blue)] mb-2">
              ↓ Принципы
            </p>
            <h2 className="font-mono text-3xl sm:text-4xl font-bold tracking-tight">
              Шесть опор архитектуры
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
                      <h3 className="font-mono text-lg font-semibold">
                        {p.title}
                      </h3>
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

      {/* Final CTA */}
      <section className="py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-mono text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Трезвый ум · Ясный код · Суверенитет
          </h2>
          <p className="text-[var(--color-foreground-muted)] mb-8">
            Это не лозунг. Это операционная система, на которой мы строим проект.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/blog"
              className="px-6 py-3 bg-[var(--color-accent)] text-[var(--color-accent-foreground)] font-mono text-sm uppercase tracking-wider hover:shadow-[0_0_30px_var(--color-accent-glow)] transition-shadow"
            >
              Читать лонгриды
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 border border-[var(--color-border)] hover:border-[var(--color-foreground-muted)] font-mono text-sm uppercase tracking-wider transition-colors"
            >
              Связаться
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
