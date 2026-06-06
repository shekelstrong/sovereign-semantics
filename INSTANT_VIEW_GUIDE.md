# Instant View Template: suveren-landing.vercel.app

**Telegram Instant View** — это когда при отправке ссылки в Telegram появляется кнопка «Instant View» и статья открывается прямо в Telegram, без перехода на сайт, мгновенно.

**Link preview (OG-превью)** — это когда при отправке ссылки в Telegram / Slack / iMessage появляется карточка с заголовком, описанием и обложкой. У нас это **уже работает** (через `og:image`, `og:title`, `og:description`).

## Что нужно сделать

### 1. Link Preview — ГОТОВО ✅

Уже работает. Telegram/Facebook/VK/LinkedIn берут мета-теги с нашей страницы и рендерят красивое превью.

Дополнительно: я создал отдельные `ogCover` 1200×630 (1.91:1) для каждой статьи:
- `inference-time-compute-2026-og.jpg` (103 KB)
- `arbitrazh-vnimaniya-cover.jpg` уже 1200×630, переиспользуем

В `frontmatter` каждой статьи теперь есть поле `ogCover:`, которое используется для `og:image`. Если `ogCover` не указан — fallback на `cover`.

### 2. Instant View Template — ИНСТРУКЦИЯ

**Файл шаблона**: `INSTANT_VIEW_TEMPLATE.iv` в корне репо (4 KB, ~60 строк).

**Шаги**:

1. Открой https://instantview.telegram.org/ (нужен логин через Telegram)
2. **My Templates** → введи `https://suveren-landing.vercel.app/blog/inference-time-compute-2026` → нажми Enter
3. Откроется **IV Editor**:
   - Слева: source HTML нашей страницы
   - В центре: окно для правил
   - Справа: preview IV
4. Скопируй содержимое `INSTANT_VIEW_TEMPLATE.iv` в центральное окно
5. Если справа preview выглядит **правильно** (заголовок, обложка, текст, FAQ, CTA) — нажми **Save** (Ctrl+S)
6. Затем — **Submit for Review** (кнопка внизу справа)
7. Telegram бот @ivbot проверит шаблон и одобрит/отклонит в течение 1-7 дней
8. После одобрения — IV работает автоматически для всех URL вида `https://suveren-landing.vercel.app/blog/<slug>`

### 3. Альтернативный путь (быстрее)

Если у тебя есть **свой Telegram-канал** с 1000+ подписчиков:
1. Залей template
2. Используй специальный URL: `https://t.me/iv?url=...&rhash=...`
3. Telegram **не будет ждать** одобрения — IV работает сразу

### 4. Чеклист перед отправкой на review

Перед Submit for Review убедись, что в preview справа:
- [x] Заголовок — `Inference-Time Compute: как «думать дольше» переписывает экономику ИИ`
- [x] Обложка — `inference-time-compute-2026-og.jpg` (1920×1080 или 1200×630)
- [x] Автор/дата — корректные
- [x] H2 заголовки рендерятся
- [x] Параграфы читаемы
- [x] Таблица рендерится
- [x] Wiki-link'и как обычные ссылки (на RU-версию arbitrazh)
- [x] FAQ блок (если есть) рендерится
- [x] CTA (ссылка на t.me/suveren_media) видна
- [x] Нет breadcrumb / tags / JSON-LD
- [x] Footer/header сайта НЕ попадают в IV

### 5. После одобрения

Telegram автоматически будет показывать кнопку «Просмотреть» рядом с любой ссылкой на `suveren-landing.vercel.app/blog/*` в чатах, группах, каналах.

## Возможные проблемы

- **Template не проходит review** — частая причина: на странице есть элементы, которые IV не может отрендерить (например, JS-only контент). Решение: проверь, что в preview справа нет пустых блоков, и в debug-консоли (внизу) нет ошибок.
- **Wiki-link'и не подгружаются** — это нормально, IV не выполняет JS, wiki-link'и должны быть обычными `<a href="...">`.
- **Cover image не показывается** — проверь, что `og:image` URL возвращает HTTP 200 и реально 1200×630.

## Файлы

```
suveren-landing-metrika/
├── INSTANT_VIEW_TEMPLATE.iv       ← Шаблон для заливки (3.3 KB)
├── content/articles/ru/...md      ← ogCover: добавлено
├── content/articles/en/...md      ← ogCover: добавлено
├── public/blog/
│   ├── arbitrazh-vnimaniya-cover.jpg    (1200×630, 203 KB)
│   ├── inference-time-compute-2026-cover.jpg (1280×720, 189 KB)
│   └── inference-time-compute-2026-og.jpg    (1200×630, 103 KB) ← НОВЫЙ
└── src/lib/articles-types.ts      ← + поле `ogCover`
└── src/lib/articles.ts            ← парсер frontmatter
└── src/app/[lang]/blog/[slug]/page.tsx ← metadata использует ogCover
```
