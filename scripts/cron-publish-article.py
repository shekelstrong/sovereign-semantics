#!/usr/bin/env python3
"""
Sovereign Semantics — no-agent cron: GLM-5.1 пишет статью напрямую, без LLM в loop.

Запускается планировщиком каждые 15 минут. Делает:
  1. Берёт следующую тему из Obsidian vault (ротация по тегу)
  2. Генерирует RU-статью через GLM-5.1 (Ollama Cloud)
  3. Генерирует EN-перевод той же статьи
  4. Сохраняет в content/articles/{ru,en}/<slug>.md
  5. npm run build
  6. git add + commit + push
  7. IndexNow ping
  8. Telegram-уведомление

Ключевое отличие от старого cron: статью пишет НЕ LLM-агент, а вызов GLM-5.1 напрямую.
Это детерминированно, без reasoning-budget issues, без AI-признаков в тексте.

Env:
  OLLAMA_API_KEY в /root/.hermes/.env
  TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID для уведомлений (опционально)

Стек:
  $ cronjob create --no-agent --script /root/Projects/sovereign-semantics/scripts/cron-publish-article.py
"""
import os, json, re, time, subprocess, sys, urllib.request, urllib.error, hashlib
from pathlib import Path
from datetime import datetime, timezone

# Progress → stderr, summary → stdout (cron captures stdout for Telegram)
def log(msg):
    log(msg, file=sys.stderr, flush=True)

# === Paths ===
REPO = Path("/root/Projects/sovereign-semantics")
ART_DIR = REPO / "content" / "articles"
TOPICS_FILE = Path("/tmp/nemo-team-docs/Sovereign-Semantics/Topics.md")
STATE_FILE = Path("/tmp/.sov-sem-cron-state.json")

# === env ===
def load_env():
    env = {}
    p = Path("/root/.hermes/.env")
    if p.exists():
        for line in p.read_text().splitlines():
            line = line.strip()
            if not line or line.startswith('#'): continue
            if '=' in line:
                k, v = line.split('=', 1)
                env[k.strip()] = v.strip().strip('"').strip("'")
    return env

ENV = load_env()
OLLAMA_KEY = ENV.get('OLLAMA_API_KEY')
assert OLLAMA_KEY, "OLLAMA_API_KEY not in /root/.hermes/.env"

# === System prompt (единый для RU и EN — взят из sovereign-semantics-blog skill v1.0.0) ===
SYSTEM_PROMPT = """Ты — редактор Sovereign Semantics (sovereign-semantics.vercel.app), цинично-аналитический ИТ-журнал. Пиши статью строго по правилам.

# ГОЛОС
- Цинично-аналитический, эксперт для экспертов, не мотивационный коуч
- Без «я/мы/вы» — третье лицо
- Без хеджирования, без «можно предположить»
- Конкретное над абстрактным: число, имя, дата, протокол, доллар в каждом абзаце
- Ритм: чередуй короткие рубленые фразы с длинными
- Без «является», «представляет собой», «осуществляется»

# ЗАПРЕЩЕНО
- delve, leverage, harness, unleash, robust, seamless, pivotal, showcase, intricate, vibrant, paradigm shift, game-changer, revolutionize, navigate the complexities, in today's world
- давайте разберёмся, стоит отметить, прежде всего, таким образом, в заключение, подводя итог, безусловно, как известно, на сегодняшний день, является одним из, представляет собой
- "Стоп, важно:" / "Stop — important:" — вставляй в прозу
- Em-dash в prose (макс 1-2 за статью)
- Inline-header vertical lists с boldface
- Эмодзи в заголовках (в тексте макс 1-2)
- Позитивные концовки

# СТРУКТУРА
1. Hook (2-3 предложения) — конкретный сценарий/число/факт
2. Контекст (1-2 абзаца) — почему важно сейчас (2026)
3. Основное тело (3-5 H2) — каждый H2 = существительная фраза или вопрос
4. Практический блок (1 раздел) — "Что делать" / "How to apply"
5. Что это значит (НЕ "Заключение") — `## Что это значит` / `## What it actually means`
6. Q&A без заголовка — 5 вопросов из frontmatter FAQ
7. CTA-блок

# H2 ПРАВИЛА
- НЕТ "Заключение"/"Conclusion"/"Введение"/"Introduction"/"FAQ"
- Sentence case
- H2 = существительная фраза или вопрос

# FRONTMATTER (YAML)
---
title: "Точный конкретный заголовок (без кликбейта)"
description: "1 предложение, 120-160 символов, прямой вывод"
date: 2026-06-04
tags: ["it-ai"]
cover: "/og/articles/<slug>.png"
coverPrompt: "Dark cinematic visualization of <тема>, [детали], no text, no letters, no watermark, 8k render"
author: "Редакция АСС"
readingTime: <N>
cta:
  label: "Telegram-канал: без иллюзий о технологиях"
  href: "https://t.me/suveren_media"
related: ["slug-1", "slug-2"]
faq:
  - q: "Конкретный вопрос"
    a: "Короткий ответ (1-2 предложения)"
  # 3-5 Q&A
translations:
  en: "<en-slug>"
---

# WIKI-LINKS (минимум 2 в статье)
Wiki-link slugs (используй минимум 2): {slugs_list}

ВАЖНО: НИКОГДА не встраивай wiki-link в сложное предложение. Используй ТОЛЬКО чистый паттерн вводной фразы:

✅ ХОРОШО:
- "Мы об этом упоминали в этой статье: [[slug-name]]"
- "Подробнее в этой статье: [[slug-name]]"
- "См. также: [[slug-name]]"
- "Связанный материал: [[slug-name]]"

❌ ПЛОХО:
- "Подробно про X и его уязвимости — в [[slug-name]]."
- "В материале про X ([[slug-name]]) мы обсуждали..."

Правило: короткая вводная фраза + двоеточие + wiki-link ОТДЕЛЬНО.

# CTA
```
---

В **Суверенных Смыслах** разбираем похожие сюжеты глубже: методика, источники, последствия. Подписка бесплатна.

**[→ УНИКАЛЕН: t.me/suveren_media](https://t.me/suveren_media)**
```

# ОБЪЁМ
2000-3500 слов, 80% прозы / 20% списков

# ВЫХОД
Только готовый markdown-файл: frontmatter (в --- ---) + тело. Никаких преамбул, никаких пояснений."""

# === API ===
def call_glm(messages, max_tokens=16000, temperature=0.7):
    body = json.dumps({"model": "glm-5.1", "messages": messages, "max_tokens": max_tokens, "temperature": temperature}).encode()
    req = urllib.request.Request("https://ollama.com/v1/chat/completions",
        data=body, headers={"Authorization": f"Bearer {OLLAMA_KEY}", "Content-Type": "application/json"}, method="POST")
    with urllib.request.urlopen(req, timeout=600) as r:
        resp = json.loads(r.read().decode())
    if "error" in resp:
        raise RuntimeError(f"API error: {json.dumps(resp, ensure_ascii=False)[:300]}")
    return resp["choices"][0]["message"]["content"].strip(), resp.get("usage", {})

# === Topic rotation ===
def load_state():
    if STATE_FILE.exists():
        return json.loads(STATE_FILE.read_text())
    return {"last_topic_idx": -1, "last_slug": None}

def save_state(state):
    STATE_FILE.write_text(json.dumps(state, indent=2))

def list_topics():
    if not TOPICS_FILE.exists():
        return []
    text = TOPICS_FILE.read_text(encoding="utf-8")
    topics = []
    cur = None
    for line in text.splitlines():
        m = re.match(r'^##\s+(.+)$', line)
        if m:
            if cur: topics.append(cur)
            cur = {"title": m.group(1).strip(), "tag": None, "notes": ""}
        elif cur and line.startswith("tag:"):
            cur["tag"] = line.split(":",1)[1].strip()
        elif cur and line.strip():
            cur["notes"] += line.strip() + " "
    if cur: topics.append(cur)
    return topics

def pick_next_topic():
    state = load_state()
    topics = list_topics()
    if not topics:
        raise RuntimeError(f"no topics in {TOPICS_FILE}")
    idx = (state["last_topic_idx"] + 1) % len(topics)
    state["last_topic_idx"] = idx
    save_state(state)
    return topics[idx]

# === Article generation ===
def list_available_slugs(locale, exclude=None):
    exclude = exclude or set()
    return sorted([p.stem for p in (ART_DIR / locale).glob("*.md") if p.stem not in exclude])

def generate_article(topic, locale, slug, is_translation=False, source_md=None):
    available = list_available_slugs(locale, exclude={slug})
    slugs_list = ", ".join(f"`{s}`" for s in available)
    if is_translation:
        user_msg = f"""TRANSLATION (RU → EN).

Topic: {topic['title']}
Tag: {topic['tag']}
Notes: {topic['notes'][:300]}

Wiki-link slugs (используй минимум 2): {slugs_list}

Source RU:
```
{source_md}
```

Переведи на EN по всем правилам. Lang=en, author="Editorial of ASS". Slug: `{slug}`.

Верни ГОТОВЫЙ markdown."""
    else:
        user_msg = f"""REWRITE (RU).

Topic: {topic['title']}
Tag: {topic['tag']}
Notes: {topic['notes'][:500]}

Wiki-link slugs (используй минимум 2): {slugs_list}

Напиши статью. Slug: `{slug}`. Frontmatter обнови (date, readingTime, coverPrompt).

Верни ГОТОВЫЙ markdown."""

    # Retry на truncation / missing wiki
    content = None
    for attempt in range(3):
        try:
            content, usage = call_glm([
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_msg},
            ], max_tokens=16000, temperature=0.7)
        except Exception as e:
            log(f"  attempt {attempt+1} failed: {e}")
            time.sleep(5); continue
        ends_with_cta = "[→ УНИКАЛЕН: t.me/suveren_media](https://t.me/suveren_media)" in content
        wiki_count = len(re.findall(r'\[\[[a-z0-9-]+\]\]', content))
        truncated = not ends_with_cta
        ok_wiki = wiki_count >= 2
        if not truncated and ok_wiki: break
        if attempt < 2:
            if truncated:
                user_msg = f"ПРОДОЛЖИ (не повторяй написанное). Закрой CTA.\n\n```\n{content}\n```"
            else:
                user_msg = f"Добавь 2+ wiki-link (slugs: {slugs_list[:200]}).\n\n```\n{content}\n```"
            time.sleep(3)
    if not content:
        raise RuntimeError("all attempts failed")
    return content

# === Build + deploy ===
def run(cmd, cwd=None, check=True):
    r = subprocess.run(cmd, cwd=cwd or REPO, capture_output=True, text=True)
    if check and r.returncode != 0:
        raise RuntimeError(f"cmd failed: {cmd}\nSTDOUT: {r.stdout[-500:]}\nSTDERR: {r.stderr[-500:]}")
    return r

def build():
    log("🔨 npm run build ...")
    run(["npm", "run", "build"], cwd=REPO)
    log("✅ build OK")

def git_commit_push(slug):
    run(["git", "add", "-A"], cwd=REPO)
    # Allow empty commit
    r = run(["git", "diff", "--cached", "--name-only"], cwd=REPO, check=False)
    if not r.stdout.strip():
        log("nothing to commit"); return
    msg = f"feat(blog): {slug} (cron, GLM-5.1)"
    run(["git", "commit", "-m", msg], cwd=REPO)
    run(["git", "push", "origin", "main"], cwd=REPO)
    log(f"✅ pushed: {msg}")

def indexnow_ping(urls):
    if not urls: return
    key = "a3a1b7c5e9d2f4b6a8c0d2e4f6a8b0c2"
    host = "sovereign-semantics.vercel.app"
    payload = {"host": host, "key": key, "urlList": urls}
    body = json.dumps(payload).encode()
    req = urllib.request.Request("https://api.indexnow.org/indexnow",
        data=body, headers={"Content-Type": "application/json"}, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            log(f"✅ IndexNow: HTTP {r.status}")
    except urllib.error.HTTPError as e:
        log(f"⚠️  IndexNow: HTTP {e.code} {e.reason}")
    except Exception as e:
        log(f"⚠️  IndexNow failed: {e}")

def telegram_notify(text):
    bot = ENV.get('TELEGRAM_BOT_TOKEN')
    chat = ENV.get('TELEGRAM_CHAT_ID')
    if not bot or not chat: return
    try:
        body = json.dumps({"chat_id": chat, "text": text, "parse_mode": "Markdown", "disable_web_page_preview": True}).encode()
        req = urllib.request.Request(f"https://api.telegram.org/bot{bot}/sendMessage",
            data=body, headers={"Content-Type": "application/json"}, method="POST")
        with urllib.request.urlopen(req, timeout=15) as r:
            pass
    except Exception as e:
        log(f"⚠️  telegram notify: {e}")

# === Main flow ===
def slugify(title):
    # Lat/Rus → kebab
    s = re.sub(r'[^a-zа-яё0-9\s-]', '', title.lower())
    s = re.sub(r'[\s_]+', '-', s).strip('-')
    # Transliterate RU → EN for URL safety
    table = {'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ё':'e','ж':'zh','з':'z','и':'i','й':'i','к':'k','л':'l','м':'m','н':'n','о':'o','п':'p','р':'r','с':'s','т':'t','у':'u','ф':'f','х':'h','ц':'c','ч':'ch','ш':'sh','щ':'shch','ъ':'','ы':'y','ь':'','э':'e','ю':'yu','я':'ya'}
    s = ''.join(table.get(c, c) for c in s)
    s = re.sub(r'-+', '-', s).strip('-')
    return s

def main():
    topic = pick_next_topic()
    print(f"📌 Topic: {topic['title']} (tag={topic['tag']})")

    # Determine slugs
    ru_slug = slugify(topic['title']) + "-2026"
    # EN: try translations.en style, else same slug
    en_slug = ru_slug  # для простоты; позже можно умнее

    print(f"✍️  RU: {ru_slug}")
    ru_md = generate_article(topic, "ru", ru_slug, is_translation=False)
    ru_path = ART_DIR / "ru" / f"{ru_slug}.md"
    ru_path.write_text(ru_md, encoding="utf-8")
    print(f"💾 {ru_path.relative_to(REPO)} ({len(ru_md)} chars)")

    print(f"🌍 EN: {en_slug}")
    en_md = generate_article(topic, "en", en_slug, is_translation=True, source_md=ru_md)
    en_path = ART_DIR / "en" / f"{en_slug}.md"
    en_path.write_text(en_md, encoding="utf-8")
    print(f"💾 {en_path.relative_to(REPO)} ({len(en_md)} chars)")

    build()
    git_commit_push(ru_slug)
    indexnow_ping([
        f"https://sovereign-semantics.vercel.app/ru/blog/{ru_slug}",
        f"https://sovereign-semantics.vercel.app/en/blog/{en_slug}",
    ])
    telegram_notify(
        f"✅ Опубликовано: {topic['title']}\n"
        f"RU: https://sovereign-semantics.vercel.app/ru/blog/{ru_slug}\n"
        f"EN: https://sovereign-semantics.vercel.app/en/blog/{en_slug}"
    )
    print(f"🏁 done: {ru_slug}")

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        import traceback
        log(f"❌ FATAL: {e}")
        log(traceback.format_exc())
        # stdout = only the summary that goes to Telegram
        print(f"❌ CRON FAILED: {type(e).__name__}: {e}", flush=True)
        sys.exit(1)
