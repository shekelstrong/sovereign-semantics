#!/usr/bin/env python3
"""
Sovereign Semantics — статья-rewriter на GLM-5.1 (Ollama Cloud).

Использование:
  python3 scripts/rewrite-article-glm.py ru <existing_slug>
  python3 scripts/rewrite-article-glm.py en <existing_ru_slug>  # генерит EN на основе RU

Что делает:
  1. Загружает OLLAMA_API_KEY из /root/.hermes/.env
  2. Читает существующую статью (или RU-оригинал для EN-варианта)
  3. Собирает system prompt со ВСЕМИ критериями SovSem editorial style
  4. Вызывает GLM-5.1 на Ollama Cloud (max_tokens=8000 — нужно для reasoning+content)
  5. Сохраняет ответ в content/articles/{ru,en}/<slug>.md

НЕ редактирует output — текст GLM-5.1 идёт в файл как есть (только frontmatter валидируется).
"""
import os, sys, json, re, time, urllib.request, urllib.error
from pathlib import Path

REPO = Path("/root/Projects/sovereign-semantics")
ART_DIR = REPO / "content" / "articles"

# === env ===
env = {}
for line in open('/root/.hermes/.env'):
    line = line.strip()
    if not line or line.startswith('#'):
        continue
    if '=' in line:
        k, v = line.split('=', 1)
        env[k.strip()] = v.strip().strip('"').strip("'")
KEY = env.get('OLLAMA_API_KEY')
assert KEY, "OLLAMA_API_KEY not in /root/.hermes/.env"

# === System prompt: все критерии из sovereign-semantics-blog skill + humanizer v2.5.1 ===
SYSTEM_PROMPT = """Ты — редактор Sovereign Semantics (sovereign-semantics.vercel.app), цинично-аналитический ИТ-журнал на русском и английском. Твоя задача — переписать существующую статью так, чтобы она была оригинальной, плотной и свободной от AI-признаков.

# ГОЛОС И ТОН
- Цинично-аналитический, не мотивационный. Эксперт для экспертов.
- Без «я/мы/вы» — третье лицо, без обращений к читателю.
- Без хеджирования: «можно предположить, что…» → пиши прямо.
- Конкретное над абстрактным: число, имя, дата, протокол, доллар в каждом абзаце.
- Ритм: чередуй короткие рубленые фразы с длинными. Не монотонно.
- Русский язык: живые глаголы, без «является», «представляет собой», «осуществляется».

# ЗАПРЕЩЁННЫЕ СЛОВА И КОНСТРУКЦИИ
Полный бан (anti-humanizer v2.5.1):
— delve, leverage, harness, unleash, robust, seamless, pivotal, showcase, underscore, intricate, vibrant, testament, evolving landscape, broader trends, marking a shift, navigate the complexities, in today's world, the realm of, the world of, in the era of, a myriad of, a plethora of, a tapestry of, game-changer, paradigm shift, revolutionize
— давайте разберёмся, стоит отметить, прежде всего, таким образом, в заключение, подводя итог, безусловно, как известно, не стоит забывать, в современных реалиях, на сегодняшний день, является одним из, представляет собой
— общие позитивные концовки («будущее выглядит светлым», «интересные времена впереди», «время покажет»)

# ЗАПРЕЩЁННЫЕ КОНСТРУКЦИИ
— **Стоп, важно:** / **Стоп, не забывайте:** / **Stop — important:** — вставляй в прозу
— Тире «—» в prose: максимум 1-2 за статью (допустимо в coverPrompt и таблицах)
— Inline-header вертикальные списки с boldface (`## Уровень 1`, `## Threat #1`, `## Layer 1`)
— Списки из 3+ прилагательных подряд
— Паттерн «не просто X, а Y»
— Эмодзи в заголовках (в тексте — не более 1-2 эмодзи на всю статью)
— Конструкции «от X до Y» как открывающие предложения разделов

# СТРУКТУРА СТАТЬИ (шаблон)
1. **Hook** (2-3 предложения) — конкретный сценарий, число или факт, который цепляет
2. **Контекст** (1-2 абзаца) — почему это важно сейчас (2026), что изменилось
3. **Основное тело** (3-5 H2 разделов) — каждый H2 = существительная фраза или вопрос
4. **Практический блок** (1 раздел) — «Что делать» / «How to apply» — списки ТОЛЬКО здесь, если реально параллельные опции
5. **Что это значит** (НЕ «Заключение») — `## Что это значит` / `## What it actually means` — конкретный takeaway или сценарий 12-24 месяца
6. **Q&A без заголовка** — 5 вопросов из frontmatter FAQ, формат `### Q` блоков
7. **CTA-блок** — 1 абзац + 1 кнопка

# ПРАВИЛА H2
— НЕТ `## Заключение` / `## Conclusion` / `## Введение` / `## Introduction`
— НЕТ `## FAQ` (FAQ уже в frontmatter)
— Sentence case, НЕ Title Case
— H2 = существительная фраза или вопрос, никогда generic («Key takeaways» → «Что это значит»)

# FRONTMATTER (строго YAML, кавычки для строк с двоеточием/тире)
---
title: "Точный конкретный заголовок (без кликбейта)"
description: "1 предложение, 120-160 символов, прямой вывод"
date: 2026-06-04
tags: ["it-ai"]  # ОДИН из: geopolitics | it-ai | economy | lifestyle | methodology
cover: "/og/articles/<slug>.png"
coverPrompt: "Dark cinematic visualization of <тема>, [конкретные детали], no text, no letters, no watermark, 8k render"
author: "Редакция АСС"
readingTime: <N>  # целое число минут, считай ~150 слов/мин
cta:
  label: "..."
  href: "https://t.me/suveren_media"
related: ["slug-1", "slug-2"]
faq:
  - q: "Конкретный вопрос читателя"
    a: "Короткий прямой ответ (1-2 предложения)"
  # 3-5 Q&A pairs
translations:
  en: "<en-slug>"  # для RU; для EN убрать или инвертировать
---

# WIKI-LINKS (ОБЯЗАТЕЛЬНО минимум 2 в статье)
Доступные slugs: {slugs_list}
Формат: `[[slug-name]]` (рендерится как Obsidian-стиль с коротким display label).

ВАЖНО: НИКОГДА не встраивай wiki-link в сложное предложение. Используй ТОЛЬКО чистый паттерн вводной фразы:

✅ ХОРОШО (делай так):
- "Мы об этом упоминали в этой статье: [[slug-name]]"
- "Подробнее в этой статье: [[slug-name]]"
- "См. также: [[slug-name]]"
- "Связанный материал: [[slug-name]]"

❌ ПЛОХО (не делай так):
- "Подробно про X и его уязвимости — в [[slug-name]]."
- "В материале про X ([[slug-name]]) мы обсуждали..."
- "Как мы уже писали в [[slug-name]], ..."

Правило: короткая вводная фраза + двоеточие + wiki-link ОТДЕЛЬНО. Ссылка сама по себе — это и есть фокус, не часть длинного предложения.

# CTA-блок (в конце, после FAQ)
```
---

В **Суверенных Смыслах** разбираем похожие сюжеты глубже: методика, источники, последствия. Подписка бесплатна.

**[→ УНИКАЛЕН: t.me/suveren_media](https://t.me/suveren_media)**
```

# ОБЪЁМ
- 2000-3500 слов (RU и EN)
- Соотношение 80% прозы / 20% списков и таблиц
- Не раздувай водой — лучше плотный 2500-словесный текст, чем 4000 с водой

# КРИТЕРИИ КАЧЕСТВА ДЛЯ EN-ПЕРЕВОДА
- НЕ дословный перевод: адаптация для англоязычной аудитории
- Идиомы и культурные отсылки переведены по смыслу, не дословно
- Сохрани все числа, имена, протоколы
- Сохрани wiki-links (slug одинаковый для обеих локалей)
- Frontmatter: lang=en, author="Editorial of ASS", description тоже адаптируй

# ФОРМАТ ОТВЕТА
Верни ГОТОВЫЙ markdown-файл: сначала frontmatter (в `---`...`---`), потом тело статьи. Никаких преамбул типа «Вот ваша статья». Никаких пояснений после. Только сам файл.

# ВХОД
Тебе будет дана существующая версия статьи (frontmatter + тело) и указание — это rewrite или translation. Сохрани факты и ссылки, перепиши стиль и структуру по правилам выше.
"""

def call_glm(messages, max_tokens=8000, temperature=0.7, max_retries=3):
    body = json.dumps({
        "model": "glm-5.1",
        "messages": messages,
        "max_tokens": max_tokens,
        "temperature": temperature,
    }).encode()
    for attempt in range(max_retries):
        try:
            req = urllib.request.Request(
                "https://ollama.com/v1/chat/completions",
                data=body,
                headers={
                    "Authorization": f"Bearer {KEY}",
                    "Content-Type": "application/json",
                },
                method="POST",
            )
            with urllib.request.urlopen(req, timeout=300) as r:
                resp = json.loads(r.read().decode())
            if "error" in resp:
                raise RuntimeError(f"API error: {json.dumps(resp, ensure_ascii=False)[:300]}")
            msg = resp["choices"][0]["message"]
            content = msg.get("content", "").strip()
            if not content:
                raise RuntimeError(f"empty content (reasoning={len(msg.get('reasoning',''))} chars, finish={resp['choices'][0].get('finish_reason')})")
            return content, resp.get("usage", {})
        except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError) as e:
            if attempt < max_retries - 1:
                wait = 5 * (attempt + 1)
                print(f"  retry {attempt+1}/{max_retries} after {wait}s: {e}")
                time.sleep(wait)
            else:
                raise

def read_article(locale, slug):
    path = ART_DIR / locale / f"{slug}.md"
    if not path.exists():
        raise FileNotFoundError(path)
    return path.read_text(encoding="utf-8")

def list_available_slugs(locale, exclude=None):
    """Returns kebab-case slugs available for wiki-linking."""
    exclude = exclude or set()
    slugs = []
    for p in (ART_DIR / locale).glob("*.md"):
        s = p.stem
        if s not in exclude:
            slugs.append(s)
    return sorted(slugs)

def extract_frontmatter_and_body(text):
    """Returns (fm_dict, body_str) or raises."""
    m = re.match(r'^---\n(.*?)\n---\n(.*)$', text, re.DOTALL)
    if not m:
        return {}, text
    fm_raw = m.group(1)
    body = m.group(2).strip()
    # Simple YAML parse for our schema
    fm = {}
    for line in fm_raw.splitlines():
        if ':' in line and not line.startswith(' '):
            k, _, v = line.partition(':')
            fm[k.strip()] = v.strip().strip('"').strip("'")
    return fm, body

def build_rewrite_prompt(existing_md, target_locale, target_slug, available_slugs):
    fm, body = extract_frontmatter_and_body(existing_md)
    slugs_list = ", ".join(f"`{s}`" for s in available_slugs)
    wiki_rule = (
        f"ОБЯЗАТЕЛЬНО используй минимум 2 wiki-link на другие статьи Sovereign Semantics.\n"
        f"Доступные slugs: {slugs_list}\n"
        f"Формат: `[[slug-name]]` (рендерится как Obsidian-стиль). "
        f"Выбирай ссылки, которые РЕАЛЬНО релевантны теме статьи — не вставляй ссылки ради ссылок."
    )
    if target_locale == "en":
        user_msg = f"""Задача: TRANSLATION (RU → EN).

{wiki_rule}

Существующая RU-статья:
```
{existing_md}
```

Перепиши её на английский по всем правилам из system prompt. Frontmatter адаптируй (lang=en, author="Editorial of ASS", description переформулируй для англоязычной аудитории). Slug остаётся: `{target_slug}`.

Верни ГОТОВЫЙ markdown-файл. Закончи CTA-блоком (см. system prompt)."""
    else:
        user_msg = f"""Задача: REWRITE (RU).

{wiki_rule}

Существующая версия:
```
{existing_md}
```

Перепиши её по всем правилам из system prompt. Сохрани факты, числа, имена, протоколы. Улучши стиль и читаемость. Slug: `{target_slug}`. Frontmatter обнови где нужно (date, readingTime, coverPrompt).

Верни ГОТОВЫЙ markdown-файл. Закончи CTA-блоком (см. system prompt). Никаких преамбул, никаких пояснений — только сам файл."""
    return user_msg

def validate_output(md, target_locale):
    """Quick checks before saving."""
    errors = []
    if not md.startswith("---"):
        errors.append("missing frontmatter delimiter")
    if not re.search(r'^title:\s*["\']', md, re.MULTILINE):
        errors.append("missing title in frontmatter")
    if not re.search(r'^description:\s*["\']', md, re.MULTILINE):
        errors.append("missing description")
    if not re.search(r'^cover:\s*["\']', md, re.MULTILINE):
        errors.append("missing cover")
    if not re.search(r'^coverPrompt:\s*["\']', md, re.MULTILINE):
        errors.append("missing coverPrompt")
    faq_count = md.count("\n  - q:")
    if faq_count < 3:
        errors.append(f"FAQ has {faq_count} pairs (need 3+)")
    wiki_count = len(re.findall(r'\[\[[a-z0-9-]+\]\]', md))
    if wiki_count < 2:
        errors.append(f"only {wiki_count} wiki-links (need 2+)")
    if "Заключение" in md or "Conclusion" in md or "Введение" in md:
        errors.append("forbidden H2: Заключение/Conclusion/Введение")
    if re.search(r'delve|leverage|harness|paradigm shift', md, re.IGNORECASE):
        errors.append("AI-vocabulary detected")
    if re.search(r'давайте разберёмся|стоит отметить|прежде всего|таким образом|подводя итог|безусловно', md, re.IGNORECASE):
        errors.append("Russian AI-cliché detected")
    return errors

def main():
    if len(sys.argv) != 3:
        print("Usage: rewrite-article-glm.py <ru|en> <slug>", file=sys.stderr)
        sys.exit(1)
    target_locale = sys.argv[1]
    target_slug = sys.argv[2]
    assert target_locale in ("ru", "en")

    # Source: для EN берём RU; для RU берём текущий RU
    if target_locale == "en":
        # Берём RU-аналог: сначала по тому же slug, потом ищем через translations.en
        source_md = None
        try:
            source_md = read_article("ru", target_slug)
        except FileNotFoundError:
            # Ищем любой RU, у которого translations.en == target_slug
            for ru_path in (ART_DIR / "ru").glob("*.md"):
                fm, _ = extract_frontmatter_and_body(ru_path.read_text(encoding="utf-8"))
                if fm.get("translations", "").strip() == target_slug:
                    source_md = ru_path.read_text(encoding="utf-8")
                    break
        if not source_md:
            print(f"❌ no RU source for EN translation of {target_slug}", file=sys.stderr)
            sys.exit(1)
    else:
        source_md = read_article(target_locale, target_slug)

    print(f"📝 {target_locale}/{target_slug} — source {len(source_md)} chars")
    available_slugs = list_available_slugs(target_locale, exclude={target_slug})
    user_msg = build_rewrite_prompt(source_md, target_locale, target_slug, available_slugs)

    # Retry loop: при обрыве/restart, при пропущенных wiki — просим GLM-5.1 переписать заново
    content = None
    # Адаптивный max_tokens: для длинных источников даём больше
    src_chars = len(source_md)
    base_max = max(16000, int(src_chars * 1.4))
    for attempt in range(3):
        t0 = time.time()
        cur_max = base_max + (attempt * 6000)  # 16k → 22k → 28k
        try:
            content, usage = call_glm([
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_msg},
            ], max_tokens=cur_max, temperature=0.7 + attempt * 0.05)
        except Exception as e:
            print(f"  attempt {attempt+1} failed: {e}")
            time.sleep(5)
            continue
        dt = time.time() - t0
        tokens = usage.get("total_tokens", "?") if usage else "?"
        print(f"  attempt {attempt+1} (max={cur_max}): {len(content)} chars in {dt:.1f}s (tokens: {tokens})")

        # Проверяем обрыв и структурные повреждения
        ends_with_cta = "[→ УНИКАЛЕН: t.me/suveren_media](https://t.me/suveren_media)" in content
        errors = validate_output(content, target_locale)
        missing_wiki = any("wiki-links" in e for e in errors)
        broken_structure = any("frontmatter" in e or "FAQ" in e or "title" in e or "description" in e or "cover" in e for e in errors)
        truncated = not ends_with_cta

        if not truncated and not missing_wiki and not broken_structure:
            break  # OK
        if attempt < 2:
            reasons = []
            if truncated: reasons.append("truncated")
            if missing_wiki: reasons.append("no wiki")
            if broken_structure: reasons.append("broken structure")
            print(f"  ⚠️  retry ({', '.join(reasons)}) → перепишу заново с большим max_tokens")
            # НЕ continue — он ломает структуру. Переписываем заново.
            user_msg = build_rewrite_prompt(source_md, target_locale, target_slug, available_slugs)
            time.sleep(3)
    if content is None:
        print("❌ all attempts failed", file=sys.stderr)
        sys.exit(1)

    errors = validate_output(content, target_locale)
    if errors:
        print(f"⚠️  final validation issues (сохранено всё равно — БЭКАП в .bak):")
        for e in errors:
            print(f"   - {e}")

    out = ART_DIR / target_locale / f"{target_slug}.md"
    backup = out.with_suffix(".md.bak")
    if out.exists():
        backup.write_text(out.read_text(encoding="utf-8"), encoding="utf-8")
        print(f"   backup: {backup.name}")
    out.write_text(content, encoding="utf-8")
    print(f"💾 saved: {out.relative_to(REPO)}")

if __name__ == "__main__":
    main()
