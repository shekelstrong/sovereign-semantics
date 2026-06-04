#!/usr/bin/env python3
"""
Оркестратор: переписывает все RU + EN статьи через GLM-5.1.

Запускает scripts/rewrite-article-glm.py для каждой пары (locale, slug).
Параллелизм отключён (GLM-5.1 и так быстрый, последовательно проще дебажить).

Использование:
  python3 scripts/rewrite-all-glm.py
  python3 scripts/rewrite-all-glm.py --only-ru
  python3 scripts/rewrite-all-glm.py --only-en
  python3 scripts/rewrite-all-glm.py --skip ru postkvantovaya-kriptografiya-2026

Логика:
  1. Для RU: переписывает каждый .md в content/articles/ru/
  2. Для EN: берёт RU-источник (по translations.en или по тому же slug) и генерит EN
"""
import os, sys, subprocess, time
from pathlib import Path

REPO = Path("/root/Projects/sovereign-semantics")
ART_DIR = REPO / "content" / "articles"
SCRIPT = REPO / "scripts" / "rewrite-article-glm.py"

def get_ru_slugs():
    return sorted([p.stem for p in (ART_DIR / "ru").glob("*.md")])

def get_en_slugs():
    return sorted([p.stem for p in (ART_DIR / "en").glob("*.md")])

def get_en_for_ru(ru_slug):
    """Возвращает EN-slug для данного RU-slug (по translations.en или 1:1)."""
    text = (ART_DIR / "ru" / f"{ru_slug}.md").read_text(encoding="utf-8")
    import re
    m = re.search(r'translations:\s*\n\s*en:\s*"?([a-z0-9-]+)"?', text)
    if m:
        return m.group(1)
    return ru_slug  # fallback: same slug

def run_one(locale, slug, timeout=600):
    print(f"\n{'='*70}")
    print(f"🚀 {locale}/{slug}")
    print(f"{'='*70}")
    t0 = time.time()
    try:
        r = subprocess.run(
            ["python3", str(SCRIPT), locale, slug],
            cwd=str(REPO),
            capture_output=True,
            text=True,
            timeout=timeout,
        )
        dt = time.time() - t0
        if r.returncode == 0:
            print(r.stdout)
            print(f"⏱️  total: {dt:.1f}s ✅")
            return True
        else:
            print(f"❌ exit {r.returncode} in {dt:.1f}s")
            print("STDOUT:", r.stdout[-500:])
            print("STDERR:", r.stderr[-500:])
            return False
    except subprocess.TimeoutExpired:
        print(f"❌ TIMEOUT after {timeout}s")
        return False

def main():
    args = sys.argv[1:]
    only_ru = "--only-ru" in args
    only_en = "--only-en" in args
    skip = []
    # Поддержка нескольких --skip: --skip ru slug1 --skip ru slug2 --skip en slug3
    i = 0
    while i < len(args):
        if args[i] == "--skip" and i + 2 < len(args):
            skip.append((args[i+1], args[i+2]))
            i += 3
        else:
            i += 1

    ru_slugs = get_ru_slugs()
    en_pairs = [(ru, get_en_for_ru(ru)) for ru in ru_slugs]
    print(f"📋 План:")
    print(f"   RU: {len(ru_slugs)} статей → переписать")
    print(f"   EN: {len(en_pairs)} статей → перевести с RU")
    if skip:
        print(f"   SKIP: {skip}")
    print()

    results = {"ru_ok": 0, "ru_fail": 0, "en_ok": 0, "en_fail": 0}
    failed = []

    if not only_en:
        for s in ru_slugs:
            if ("ru", s) in skip:
                print(f"⏭️  SKIP ru/{s}")
                continue
            if run_one("ru", s):
                results["ru_ok"] += 1
            else:
                results["ru_fail"] += 1
                failed.append(("ru", s))

    if not only_ru:
        for ru_slug, en_slug in en_pairs:
            if ("en", en_slug) in skip:
                print(f"⏭️  SKIP en/{en_slug}")
                continue
            if run_one("en", en_slug):
                results["en_ok"] += 1
            else:
                results["en_fail"] += 1
                failed.append(("en", en_slug))

    print(f"\n{'='*70}")
    print(f"📊 ИТОГО:")
    print(f"   RU: ✅ {results['ru_ok']}  ❌ {results['ru_fail']}")
    print(f"   EN: ✅ {results['en_ok']}  ❌ {results['en_fail']}")
    if failed:
        print(f"\n❌ FAILED:")
        for loc, s in failed:
            print(f"   - {loc}/{s}")

if __name__ == "__main__":
    main()
