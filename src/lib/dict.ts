import type { Locale } from "./articles-types";

/**
 * Статические переводы для страниц (главная, manifesto, contact).
 * Содержат только тексты, которые не меняются пользователем.
 * Для UI (Header, Footer, ThemeSwitcher) используется useT() в client.
 */

export interface PageDict {
  meta: {
    title: string;
    description: string;
  };
  hero: {
    tagline: string;
    title: string[];
    subtitle: string;
    ctaRead: string;
    ctaManifesto: string;
    stats: { k: string; v: string }[];
  };
  manifesto: {
    label: string;
    title: string;
    principles: { title: string; text: string }[];
  };
  manifesto_page: {
    subtitle: string;
  };
  latest: {
    label: string;
    title: string;
    all: string;
  };
  projects: {
    label: string;
    title: string;
    subtitle: string;
    items: { title: string; text: string; tags: string[] }[];
  };
}

const ru: PageDict = {
  meta: {
    title: "Архитектура суверенных смыслов — аналитика, IT, ИИ",
    description:
      "Аналитический блог о технологическом суверенитете России, IT, искусственном интеллекте, экономике и трезвом мышлении. Лонгриды без воды и клише.",
  },
  hero: {
    tagline: "Трезвый ум · Ясный код · Суверенитет",
    title: ["АРХИТЕКТУРА", "СУВЕРЕННЫХ", "СМЫСЛОВ"],
    subtitle:
      "Аналитика без истерики. Технологический суверенитет России, IT и ИИ как инструменты влияния, спорт и ясность мышления как фундамент личной эффективности.",
    ctaRead: "Читать лонгриды",
    ctaManifesto: "Манифест",
    stats: [
      { k: "Лонгридов", v: "12+" },
      { k: "Тем", v: "5" },
      { k: "Без воды", v: "100%" },
    ],
  },
  manifesto: {
    label: "↓ МАНИФЕСТ",
    title: "Аналитика как инструмент, а не развлечение",
    principles: [
      {
        title: "Трезвый ум",
        text: "Системный взгляд вместо эмоций. Логика, факты, макроэкономические циклы. Никаких клише и «как никогда актуально».",
      },
      {
        title: "Архитектура смыслов",
        text: "Технологии, политика, экономика — не отдельные топики, а единая карта. Связи важнее событий.",
      },
      {
        title: "Суверенитет",
        text: "Свобода для бизнеса и технологий. Деньги — инструмент влияния, а не самоцель. Россия — страна возможностей для ясного ума.",
      },
    ],
  },
  manifesto_page: {
    subtitle:
      "Проект о технологическом суверенитете, искусственном интеллекте и трезвом мышлении. Без истерики, без маргинальной конспирологии, без личных фото — только аналитика, факты и архитектура.",
  },
  latest: {
    label: "↓ ЛОНГРИДЫ",
    title: "Свежие материалы",
    all: "Все статьи",
  },
  projects: {
    label: "↓ ВИТРИНА",
    title: "Наши проекты",
    subtitle: "IT-решения, которые мы делаем руками. Каждый — рабочий, не презентация.",
    items: [
      {
        title: "Sovereign Semantics",
        text: "Этот сайт. Headless CMS на Git, AI-агент API, авто-деплой на Vercel. Демонстрация архитектуры.",
        tags: ["Next.js", "CMS", "AI"],
      },
      {
        title: "Telegram-бот инфраструктура",
        text: "Модерация, аналитика контента, автоматизация. Боты в проде на нескольких серверах.",
        tags: ["aiogram", "production"],
      },
      {
        title: "AI-аналитика для бизнеса",
        text: "Готовые пайплайны на базе LLM: от сбора данных до структурированных отчётов. OpenRouter, кастомные промпты.",
        tags: ["LLM", "automation"],
      },
      {
        title: "Obsidian Knowledge Base",
        text: "Граф-связанная база знаний для исследований, стратегий и продуктового анализа.",
        tags: ["obsidian", "wiki"],
      },
    ],
  },
};

const en: PageDict = {
  meta: {
    title: "Architecture of Sovereign Meaning — analytics, IT, AI",
    description:
      "An analytical blog on Russia's technological sovereignty, IT, artificial intelligence, economy, and sober thinking. Longreads without fluff or clichés.",
  },
  hero: {
    tagline: "Sober mind · Clear code · Sovereignty",
    title: ["ARCHITECTURE", "OF SOVEREIGN", "MEANING"],
    subtitle:
      "Analytics without hysteria. Russia's technological sovereignty, IT and AI as tools of influence, sport and clarity of thought as the foundation of personal effectiveness.",
    ctaRead: "Read longreads",
    ctaManifesto: "Manifesto",
    stats: [
      { k: "Longreads", v: "12+" },
      { k: "Topics", v: "5" },
      { k: "No fluff", v: "100%" },
    ],
  },
  manifesto: {
    label: "↓ MANIFESTO",
    title: "Analytics as a tool, not entertainment",
    principles: [
      {
        title: "Sober mind",
        text: "A systemic view over emotions. Logic, facts, macroeconomic cycles. No clichés or empty phrases.",
      },
      {
        title: "Architecture of meaning",
        text: "Technology, politics, economy are not separate topics but a single map. Connections matter more than events.",
      },
      {
        title: "Sovereignty",
        text: "Freedom for business and technology. Money is a tool of influence, not an end in itself. Russia is a country of opportunity for clear minds.",
      },
    ],
  },
  manifesto_page: {
    subtitle:
      "A project on technological sovereignty, artificial intelligence, and sober thinking. No hysteria, no marginal conspiracy, no personal photos — only analytics, facts, and architecture.",
  },
  latest: {
    label: "↓ LONGREADS",
    title: "Latest materials",
    all: "All articles",
  },
  projects: {
    label: "↓ SHOWCASE",
    title: "Our projects",
    subtitle: "IT solutions we build with our hands. Each one is live, not a pitch deck.",
    items: [
      {
        title: "Sovereign Semantics",
        text: "This site. Headless CMS on Git, AI-agent API, auto-deploy on Vercel. A live architecture demo.",
        tags: ["Next.js", "CMS", "AI"],
      },
      {
        title: "Telegram bot infrastructure",
        text: "Moderation, content analytics, automation. Bots in production on multiple servers.",
        tags: ["aiogram", "production"],
      },
      {
        title: "AI analytics for business",
        text: "Ready-made LLM pipelines: from data collection to structured reports. OpenRouter, custom prompts.",
        tags: ["LLM", "automation"],
      },
      {
        title: "Obsidian Knowledge Base",
        text: "Graph-linked knowledge base for research, strategy, and product analysis.",
        tags: ["obsidian", "wiki"],
      },
    ],
  },
};

const dicts: Record<Locale, PageDict> = { ru, en };

export function getDict(lang: Locale): PageDict {
  return dicts[lang] || dicts.ru;
}

export function isValidLocale(s: string): s is Locale {
  return s === "ru" || s === "en";
}
