# Архитектура суверенных смыслов

> Аналитический блог о технологическом суверенитете, IT, искусственном интеллекте и трезвом мышлении. Production-grade Next.js + headless CMS через GitHub.

**Стек:** Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · Framer Motion · Markdown + gray-matter · GitHub API · Vercel Edge.

---

## ✨ Фичи

- 🎨 **Технократический минимализм** — глубокий графит + emerald/cold-blue неон, JetBrains Mono + Inter
- 📝 **Markdown CMS** — статьи в `content/articles/*.md`, читаются build-time, SSG/ISR-ready
- 🤖 **AI-агент API** — `POST /api/articles` создаёт статьи и коммитит в GitHub → Vercel auto-deploy
- 🎨 **Авто-обложки** — через DALL-E (опционально, настраивается через env)
- 🔍 **SEO из коробки** — sitemap, robots, JSON-LD (Article, Organization, WebSite, Breadcrumb), canonical, OG, Twitter Cards
- 🤖 **LLM-friendly** — `robots.txt` разрешает GPTBot, ClaudeBot, PerplexityBot, Google-Extended
- 📱 **Mobile-first** — адаптивная вёрстка, mobile menu, responsive typography
- 🔐 **Админка** — `/admin` с авторизацией по токену, редактор Markdown, копирование System Prompt

---

## 🚀 Быстрый старт

### Локальная разработка

```bash
npm install
cp .env.example .env.local
# Заполни CMS_API_TOKEN (любая строка, например: openssl rand -hex 32)
npm run dev
```

Открой [http://localhost:3000](http://localhost:3000).  
Админка: [http://localhost:3000/admin](http://localhost:3000/admin) → введи токен.

### Деплой на Vercel

1. Залей репо на GitHub (см. ниже).
2. Зайди на [vercel.com/new](https://vercel.com/new), импортируй репо.
3. **Root Directory** оставь `.` (Next.js авто-детект).
4. Framework Preset: **Next.js** (автоматически).
5. Build command: `next build` (по умолчанию).
6. Output directory: `.next` (по умолчанию).
7. Добавь env variables (минимум):
   - `NEXT_PUBLIC_SITE_URL` → `https://your-domain.vercel.app`
   - `CMS_API_TOKEN` → `openssl rand -hex 32`
8. Deploy. Vercel выдаст URL типа `https://sovereign-semantics-xxx.vercel.app`.

### Кастомный домен

В Vercel → Settings → Domains → добавь `sovereign-semantics.ru` и следуй инструкциям по DNS.

---

## 📁 Структура

```
sovereign-semantics/
├── content/
│   └── articles/                    # Markdown-статьи
│       ├── sovereign-tech.md
│       ├── sport-cogtech.md
│       └── ai-statecraft-2026.md
├── src/
│   ├── app/
│   │   ├── layout.tsx               # Root layout + JSON-LD
│   │   ├── page.tsx                 # Главная
│   │   ├── blog/
│   │   │   ├── page.tsx             # Лента с фильтрами
│   │   │   └── [slug]/page.tsx      # Страница статьи + Article JSON-LD
│   │   ├── manifesto/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── admin/page.tsx           # CMS панель
│   │   ├── api/
│   │   │   ├── articles/route.ts    # POST: создать статью
│   │   │   ├── articles-list/route.ts  # GET: список для админки
│   │   │   ├── system-prompt/route.ts  # GET: System Prompt для AI
│   │   │   └── contact/route.ts     # POST: форма обратной связи
│   │   ├── sitemap.ts
│   │   ├── robots.ts
│   │   ├── opengraph-image.tsx      # Генерация OG (1200x630)
│   │   └── icon.tsx                 # Favicon
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Analytics.tsx
│   │   ├── ArticleCard.tsx
│   │   ├── BlogExplorer.tsx
│   │   ├── ContactForm.tsx
│   │   ├── FadeIn.tsx
│   │   ├── HeroGrid.tsx
│   │   └── admin/AdminPanel.tsx
│   └── lib/
│       └── articles.ts              # Чтение/запись Markdown + frontmatter
├── .env.example
├── next.config.ts
├── tailwind.config.js (встроен в CSS)
└── package.json
```

---

## 🤖 Использование AI-агентом

### 1. Получи System Prompt

```bash
curl https://sovereign-semantics.vercel.app/api/system-prompt
```

Или нажми кнопку «Скопировать» в `/admin` → System Prompt.

### 2. Сгенерируй статью в ChatGPT / Claude / GigaChat

Скопируй system prompt, передай тему:

```
Тема: "ИИ в госуправлении России: 5 рабочих кейсов 2026"
```

Получишь статью в формате `[SEO_META] ... [IMAGE_PROMPT_FOR_AI] ... H1 ... H2 ... H2 ... H2 ... CTA`.

### 3. Опубликуй через API

```bash
curl -X POST https://sovereign-semantics.vercel.app/api/articles \
  -H "Authorization: Bearer $CMS_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "ИИ в госуправлении России: 5 рабочих кейсов 2026",
    "description": "Системный разбор внедрения ИИ в российских ведомствах: что работает, что буксует, и при чём тут суверенитет.",
    "content": "# ИИ в госуправлении России: 5 рабочих кейсов 2026\n\nЛид-абзац...\n\n## Кейс 1: ...\n\n## Кейс 2: ...\n\n## Практический вывод\n\n...",
    "tags": ["it-ai", "geopolitics"],
    "cover": true,
    "cta": {
      "label": "Telegram-канал",
      "href": "https://t.me/sovereign_semantics"
    }
  }'
```

**Ответ:**
```json
{
  "ok": true,
  "slug": "ii-v-gosudarstvennom-upravlenii-2026",
  "url": "/blog/ii-v-gosudarstvenном-upravlenii-2026",
  "github": "https://github.com/.../blob/main/content/articles/...",
  "message": "Article committed to GitHub. Vercel will deploy shortly."
}
```

Vercel auto-deploy через 30-60 секунд. Статья появляется на сайте.

### 4. Опционально: автогенерация обложки

Если `IMAGE_PROVIDER=openai` и `OPENAI_API_KEY` настроены, передай `"cover": true` — DALL-E 3 сгенерирует обложку по промпту из `[IMAGE_PROMPT_FOR_AI]`.

### 5. Автоматизация через n8n / Make / GitHub Actions

Пример workflow для ежедневной публикации:

```yaml
# .github/workflows/publish.yml
name: Auto-publish article
on:
  schedule:
    - cron: "0 9 * * *"
jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - name: Generate & publish
        run: |
          ARTICLE=$(./scripts/generate-article.sh)
          curl -X POST ${{ secrets.SITE_URL }}/api/articles \
            -H "Authorization: Bearer ${{ secrets.CMS_API_TOKEN }}" \
            -H "Content-Type: application/json" \
            -d "$ARTICLE"
```

---

## ✍️ Ручное добавление статей

Через админку `/admin`:
1. Войди по токену.
2. «Новая» → заполни форму (заголовок, описание, теги, контент).
3. Выбери «Сгенерировать обложку» (AI) или вставь URL.
4. «Опубликовать» → файл коммитится в GitHub → Vercel деплоит.

Через Git напрямую:
```bash
# Создай content/articles/my-article.md
cat > content/articles/my-article.md <<'EOF'
---
title: "Моя статья"
description: "Краткое описание"
date: "2026-06-04"
tags: ["it-ai"]
---

# Моя статья

Текст...
EOF

git add content/articles/my-article.md
git commit -m "feat: add new article"
git push origin main
```

---

## 🎨 Дизайн-система

| Токен | Значение | Использование |
|-------|----------|---------------|
| `--color-background` | `#050608` | Главный фон |
| `--color-surface` | `#0a0d12` | Карточки, формы |
| `--color-border` | `#1c2128` | Границы, разделители |
| `--color-foreground` | `#e6edf3` | Основной текст |
| `--color-foreground-muted` | `#8b95a3` | Вторичный текст |
| `--color-accent` | `#10b981` | Emerald — основной акцент |
| `--color-blue` | `#3b82f6` | Cold blue — вторичный |
| `--font-display` | JetBrains Mono | Заголовки H1-H3 |
| `--font-sans` | Inter | Основной текст |
| `--font-mono` | JetBrains Mono | Код, метаданные |

---

## 🔍 SEO

- ✅ Sitemap: `/sitemap.xml` (динамический, все статьи)
- ✅ Robots: `/robots.txt` (с LLM-краулерами: GPTBot, ClaudeBot, Perplexity, Google-Extended)
- ✅ Canonical URLs (на каждой странице)
- ✅ Open Graph + Twitter Cards (динамические для статей, дефолтный для остальных)
- ✅ JSON-LD: `Organization` + `WebSite` (в layout) + `Article` + `BreadcrumbList` (для каждой статьи)
- ✅ Семантический HTML (header, main, article, nav, footer)
- ✅ Mobile-friendly + Lighthouse 95+
- ✅ HTTPS-only, security headers

**Совет для попадания в LLM-выдачи (Google Gemini, ChatGPT Search, Perplexity, Claude Search):**

1. Структурированный контент (H1 → H2 → H2, списки, **жирный** для ключевых терминов).
2. JSON-LD Article schema с author, datePublished, image.
3. Чёткие определения терминов в первом абзаце.
4. Связанные статьи (`related` в frontmatter) — улучшают Knowledge Graph.

---

## 📜 Лицензия

Контент (статьи) — © Архитектура суверенных смыслов.  
Код — MIT.

---

**Трезвый ум · Ясный код · Суверенитет.**
