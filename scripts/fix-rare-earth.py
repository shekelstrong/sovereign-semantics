#!/usr/bin/env python3
"""Quick self-rewrite for EN rare-earth-metals (longest EN, no RU source)."""
import sys, re, time, json, urllib.request
from pathlib import Path

REPO = Path("/root/Projects/sovereign-semantics")
ART = REPO / "content" / "articles"

# env
env = {}
for line in open('/root/.hermes/.env'):
    line = line.strip()
    if not line or line.startswith('#'):
        continue
    if '=' in line:
        k, v = line.split('=', 1)
        env[k.strip()] = v.strip().strip('"').strip("'")
KEY = env.get('OLLAMA_API_KEY')

# SYSTEM_PROMPT
SYS = open(REPO / "scripts" / "rewrite-article-glm.py").read().split('SYSTEM_PROMPT = """')[1].split('"""')[0]

out = ART / "en" / "rare-earth-metals-hidden-axis-geoeconomics-ai-2026.md"
source_md = out.read_text(encoding='utf-8')

slugs = [p.stem for p in (ART / "en").glob("*.md") if p.stem != "rare-earth-metals-hidden-axis-geoeconomics-ai-2026"]

user_msg = f"""Write the article in ENGLISH.
Slug: rare-earth-metals-hidden-axis-geoeconomics-ai-2026
Available slugs for wiki-links: {slugs[:30]}

SOURCE:
---
{source_md}
---

Rewrite completely. Keep frontmatter (title, description, slug, date, tags, cover, coverPrompt, translations). Update coverPrompt. Include:
- unique text
- 2+ [[wiki-links]] to other articles (format: 'we covered this in [[slug]]')
- FAQ 3+ questions
- CTA: [→ UNIQUE: t.me/suveren_media](https://t.me/suveren_media)

Return exactly in format:
```md
---
title: ...
description: ...
slug: rare-earth-metals-hidden-axis-geoeconomics-ai-2026
date: ...
tags: [...]
cover: ...
coverPrompt: "..."
translations: ...
---
<body>
```"""

def call_glm(messages, max_tokens=32000, timeout=1800):
    req = urllib.request.Request(
        "https://ollama.com/v1/chat/completions",
        data=json.dumps({"model": "glm-5.1", "messages": messages, "max_tokens": max_tokens, "temperature": 0.75}).encode("utf-8"),
        headers={"Content-Type": "application/json", "Authorization": f"Bearer {KEY}"},
    )
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    return data["choices"][0]["message"]["content"]

for attempt in range(3):
    print(f"attempt {attempt+1}...", flush=True)
    t0 = time.time()
    try:
        content = call_glm([{"role": "system", "content": SYS}, {"role": "user", "content": user_msg}], max_tokens=32000 + attempt*4000)
    except Exception as e:
        print(f"  failed: {e}")
        time.sleep(5)
        continue
    dt = time.time() - t0
    print(f"  {len(content)} chars in {dt:.1f}s")

    # Strip fences
    fence = re.compile(r'^\s*`{3,}\s*(?:md)?\s*\n|\\n\s*`{3,}\s*$')
    content = fence.sub('', content).strip()

    # Validate
    ok = True
    if not content.startswith('---'):
        print("  no frontmatter")
        ok = False
    if '[→ UNIQUE: t.me/suveren_media]' not in content:
        print("  no CTA")
        ok = False
    wiki = len(re.findall(r'\[\[([\w-]+)\]\]', content))
    if wiki < 2:
        print(f"  wiki={wiki}")
        ok = False
    if '\\n  - q:' not in content[:3000]:
        print("  no FAQ")
        ok = False
    if ok:
        break
    print(f"  retry...")
    time.sleep(3)

if content:
    backup = out.with_suffix('.md.bak')
    backup.write_text(out.read_text(encoding='utf-8'), encoding='utf-8')
    print("backup saved")
    out.write_text(content, encoding='utf-8')
    print(f"💾 saved: {out.relative_to(REPO)} ({len(content)} chars, wiki={wiki})")
else:
    print("💀 all attempts failed")
    sys.exit(1)
