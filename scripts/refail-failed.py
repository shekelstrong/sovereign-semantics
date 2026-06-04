#!/usr/bin/env python3
"""
Sovereign Semantics — refail скрипт для 5 failed статей из batch #4.

Стратегии:
  ru/vpn-crypto-2026                            — обычный rewrite, timeout 1800s, max_tokens=22000
  en/local-llm-consumer-hardware-2026            — self-rewrite из EN source (нет RU)
  en/post-quantum-cryptography-2026              — self-rewrite из EN source
  en/rare-earth-metals-hidden-axis-ai-geoeconomics-2026 — self-rewrite (slug differs от filename)
  en/sober-budget-strategic-resource-en          — SKIP (slug не существует ни в ru/ ни в en/)

Запуск:
  python3 scripts/refail-failed.py
"""
import os, sys, json, re, time, urllib.request, urllib.error, subprocess
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

# === System prompt (идентичен rewrite-article-glm.py) ===
SYSTEM_PROMPT = open(Path(__file__).parent / "rewrite-article-glm.py").read().split('SYSTEM_PROMPT = """')[1].split('"""')[0]

# === helpers ===
def call_glm(messages, max_tokens=22000, temperature=0.75, timeout=1800):
    req = urllib.request.Request(
        "https://ollama.com/v1/chat/completions",
        data=json.dumps({
            "model": "glm-5.1",
            "messages": messages,
            "max_tokens": max_tokens,
            "temperature": temperature,
        }).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {KEY}",
        },
    )
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    return data["choices"][0]["message"]["content"], data.get("usage", {})

def read_article(locale, slug):
    p = ART_DIR / locale / f"{slug}.md"
    if not p.exists():
        raise FileNotFoundError(p)
    return p.read_text(encoding="utf-8")

def extract_frontmatter_and_body(text):
    m = re.match(r'^---\s*\n(.*?)\n---\s*\n(.*)$', text, re.DOTALL)
    if not m:
        return {}, text
    fm_str, body = m.group(1), m.group(2)
    fm = {}
    for line in fm_str.split('\n'):
        if ':' in line:
            k, v = line.split(':', 1)
            fm[k.strip()] = v.strip().strip('"').strip("'")
    return fm, body

def list_available_slugs(locale, exclude):
    out = []
    for p in (ART_DIR / locale).glob("*.md"):
        if p.suffix == '.md' and p.stem not in exclude and not p.stem.endswith('.bak'):
            out.append(p.stem)
    return out

def build_rewrite_prompt(source_md, target_locale, target_slug, available_slugs):
    if target_locale == "en":
        lang_instruction = "Write the article in ENGLISH."
    else:
        lang_instruction = "Напиши статью на РУССКОМ."
    return f"""{lang_instruction}

Slug: {target_slug}
Available slugs for wiki-links: {available_slugs[:30]}

SOURCE:
---
{source_md}
---

Перепиши статью полностью. Сохрани frontmatter (title, description, slug, date, tags, cover, coverPrompt, translations), восстанови/обнови coverPrompt под новый текст (если менялся фокус). Сделай:
- уникальный текст (не копию source)
- 2+ внутренние [[wiki-ссылки]] на другие статьи (формат: 'мы об этом упоминали в этой статье: [[slug]]')
- FAQ 3+ вопросов
- CTA в конце: [→ УНИКАЛЕН: t.me/suveren_media](https://t.me/suveren_media)
- обновлённый coverPrompt

Ответ строго в формате:
```md
---
title: ...
description: ...
slug: {target_slug}
date: ...
tags: [...]
cover: ...
coverPrompt: "..."
translations: ...
---

<article body>
```"""

def validate_output(content, locale):
    errors = []
    if not content.startswith('---\n'):
        errors.append("frontmatter: missing start")
        return errors
    m = re.match(r'^---\s*\n(.*?)\n---\s*\n(.*)$', content, re.DOTALL)
    if not m:
        errors.append("frontmatter: malformed (no closing ---)")
        return errors
    frontmatter = m.group(1)
    body = m.group(2)
    # Required frontmatter keys
    for k in ('title:', 'description:', 'cover:', 'coverPrompt:', 'date:'):
        if k not in frontmatter:
            errors.append(f"frontmatter: missing {k[:-1]}")
    # FAQ в YAML (frontmatter)
    faq_count = frontmatter.count('\n  - q:')
    if faq_count < 3:
        errors.append(f"FAQ<3 ({faq_count})")
    # Wiki-links (в body или frontmatter)
    wiki_count = len(re.findall(r'\[\[([\w-]+)\]\]', content))
    if wiki_count < 2:
        errors.append(f"wiki-links: only {wiki_count} (need 2+)")
    # AI-clichés
    if locale == "en":
        if re.search(r'\b(delve|leverage|harness|paradigm shift|robust|seamless|intricate|testament)\b', content, re.IGNORECASE):
            errors.append("AI-vocabulary detected")
    else:
        if re.search(r'давайте разберёмся|стоит отметить|прежде всего|таким образом|подводя итог|безусловно', content, re.IGNORECASE):
            errors.append("Russian AI-cliché detected")
    return errors

def process_article(locale, slug, source_locale):
    out = ART_DIR / locale / f"{slug}.md"
    print(f"\n{'='*70}\n🚀 {locale}/{slug}  (source: {source_locale})\n{'='*70}", flush=True)

    # Skip check
    if not out.exists():
        print(f"   ❌ target file does not exist: {out}", file=sys.stderr)
        return False

    # Source: explicit
    try:
        source_md = read_article(source_locale, slug)
    except FileNotFoundError:
        # Try to find by approximate slug match in source locale
        candidates = list((ART_DIR / source_locale).glob("*.md"))
        # exact prefix match
        prefix = slug.split('-')[0]
        for c in candidates:
            if c.stem.startswith(prefix) and c.stem != slug:
                source_md = c.read_text(encoding="utf-8")
                print(f"   ⚠️  using fuzzy source: {c.stem}", flush=True)
                break
        else:
            print(f"   ❌ no source found in {source_locale}/ for {slug}", file=sys.stderr)
            return False

    print(f"📝 {locale}/{slug} — source {len(source_md)} chars", flush=True)
    available_slugs = list_available_slugs(locale, exclude={slug})
    user_msg = build_rewrite_prompt(source_md, locale, slug, available_slugs)

    src_chars = len(source_md)
    base_max = max(18000, int(src_chars * 1.5))
    content = None
    for attempt in range(3):
        t0 = time.time()
        cur_max = base_max + (attempt * 6000)
        try:
            content, usage = call_glm([
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_msg},
            ], max_tokens=cur_max, temperature=0.75 + attempt * 0.05, timeout=1800)
        except Exception as e:
            print(f"  attempt {attempt+1} failed: {e}", flush=True)
            time.sleep(5)
            continue
        dt = time.time() - t0
        tokens = usage.get("total_tokens", "?") if usage else "?"
        print(f"  attempt {attempt+1} (max={cur_max}): {len(content)} chars in {dt:.1f}s (tokens: {tokens})", flush=True)

        ends_with_cta = "[→ УНИКАЛЕН: t.me/suveren_media](https://t.me/suveren_media)" in content
        errors = validate_output(content, locale)
        missing_wiki = any("wiki-links" in e for e in errors)
        broken_structure = any("frontmatter" in e or "FAQ" in e or "title" in e or "description" in e or "cover" in e for e in errors)
        truncated = not ends_with_cta

        if not truncated and not missing_wiki and not broken_structure:
            break
        if attempt < 2:
            reasons = []
            if truncated: reasons.append("truncated")
            if missing_wiki: reasons.append("no wiki")
            if broken_structure: reasons.append("broken structure")
            print(f"  ⚠️  retry ({', '.join(reasons)})", flush=True)
            user_msg = build_rewrite_prompt(source_md, locale, slug, available_slugs)
            time.sleep(3)

    if content is None:
        print(f"💀 {locale}/{slug}: all 3 attempts failed", file=sys.stderr)
        return False

    errors = validate_output(content, locale)
    if errors:
        print(f"⚠️  final validation issues:", flush=True)
        for e in errors:
            print(f"   - {e}", flush=True)

    backup = out.with_suffix(".md.bak")
    backup.write_text(out.read_text(encoding="utf-8"), encoding="utf-8")
    print(f"   backup: {backup.name}", flush=True)
    out.write_text(content, encoding="utf-8")
    print(f"💾 saved: {out.relative_to(REPO)}", flush=True)
    return True

# === jobs ===
JOBS = [
    # (locale, slug, source_locale, strategy_note)
    ("ru", "vpn-crypto-2026", "ru", "long source, timeout 1800"),
    ("en", "local-llm-consumer-hardware-2026", "en", "self-rewrite (no RU)"),
    ("en", "post-quantum-cryptography-2026", "en", "self-rewrite (no RU)"),
    ("en", "rare-earth-metals-hidden-axis-ai-geoeconomics-2026", "en", "self-rewrite (slug differs)"),
    ("en", "sober-budget-strategic-resource", "en", "self-rewrite (legacy file, no CTA)"),
]

if __name__ == "__main__":
    results = {"ok": [], "fail": [], "skip": ["en/sober-budget-strategic-resource-en (slug не существует)"]}
    for locale, slug, src, note in JOBS:
        print(f"\n>>> {locale}/{slug}  [{note}]", flush=True)
        ok = process_article(locale, slug, src)
        if ok:
            results["ok"].append(f"{locale}/{slug}")
        else:
            results["fail"].append(f"{locale}/{slug}")
    print("\n" + "="*70)
    print("📊 REFAIL ИТОГО:")
    print(f"   ✅ OK: {len(results['ok'])}")
    for x in results["ok"]: print(f"      - {x}")
    print(f"   ❌ FAIL: {len(results['fail'])}")
    for x in results["fail"]: print(f"      - {x}")
    print(f"   ⏭️  SKIP: {len(results['skip'])}")
    for x in results["skip"]: print(f"      - {x}")
    print("="*70)
