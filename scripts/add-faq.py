#!/usr/bin/env python3
"""Add FAQ to articles missing it. Fast GLM-5.1 calls (≤2000 tokens each)."""
import sys, json, re, time, urllib.request
from pathlib import Path

REPO = Path("/root/Projects/sovereign-semantics")
ART = REPO / "content" / "articles"

env = {}
for line in open('/root/.hermes/.env'):
    line = line.strip()
    if not line or line.startswith('#'): continue
    if '=' in line:
        k, v = line.split('=', 1)
        env[k.strip()] = v.strip().strip('"').strip("'")
KEY = env.get('OLLAMA_API_KEY')

def call_glm(prompt, max_tokens=800):
    req = urllib.request.Request(
        "https://ollama.com/v1/chat/completions",
        data=json.dumps({
            "model": "glm-5.1", "messages": [
                {"role": "system", "content": "Ты — редактор. Кратко, конкретно, без воды."},
                {"role": "user", "content": prompt}
            ],
            "max_tokens": max_tokens, "temperature": 0.7
        }).encode("utf-8"),
        headers={"Content-Type": "application/json", "Authorization": f"Bearer {KEY}"},
    )
    with urllib.request.urlopen(req, timeout=180) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    return data["choices"][0]["message"]["content"]

TARGETS = [
    ("ru", "ai-economy-1000-agents.md"),
    ("ru", "avtonomnye-llm-lokalnyj-inference-2026.md"),
    ("ru", "redkozemelnye-metally-skrytaya-os-geoeconomiki-ai-2026.md"),
    ("ru", "sober-budget-strategic-resource.md"),
    ("ru", "vpn-crypto-2026.md"),
    ("en", "ai-economy-1000-agents.md"),
    ("en", "local-llm-consumer-hardware-2026.md"),
    ("en", "sober-budget-strategic-resource.md"),
    ("en", "vpn-crypto-2026.md"),
]

for loc, name in TARGETS:
    f = ART / loc / name
    print(f"\n{'='*50}\n🚀 {loc}/{name}\n{'='*50}", flush=True)
    text = f.read_text(encoding='utf-8')
    
    # Check if has frontmatter
    m = re.match(r'^(---\s*\n.*?\n---\s*\n)(.*)$', text, re.DOTALL)
    if not m:
        print("  ❌ no frontmatter — skip (need full rewrite)")
        continue
    
    frontmatter, body = m.group(1), m.group(2)
    
    # Extract title
    title_match = re.search(r'^title:\s*"(.+)"', frontmatter, re.MULTILINE)
    title = title_match.group(1) if title_match else "Article"
    
    # Extract description
    desc_match = re.search(r'^description:\s*"(.+)"', frontmatter, re.MULTILINE)
    desc = desc_match.group(1) if desc_match else ""
    
    # Find CTA position
    cta_match = re.search(r'\n\*\*\[→ .+?t\.me/suveren_media.*?\]\n', body)
    if not cta_match:
        cta_match = re.search(r'\n\[→ .+?t\.me/suveren_media.*?\n', body)
    
    # Generate FAQ
    is_ru = loc == 'ru'
    if is_ru:
        prompt = f"""Статья: "{title}"
Контекст: {desc[:200]}

Напиши 4 частых вопроса по этой теме и краткие ответы (2-3 предложения каждый). Формат:

### Q: <вопрос>

<ответ>

Без вступлений, без заключений. Только 4 блока Q+ответ."""
    else:
        prompt = f"""Article: "{title}"
Context: {desc[:200]}

Write 4 typical reader questions and short answers (2-3 sentences each). Format:

### Q: <question>

<answer>

No intro, no outro. Just 4 Q+answer blocks."""
    
    try:
        faq_text = call_glm(prompt, max_tokens=2000)
        print(f"  FAQ generated: {len(faq_text)} chars", flush=True)
    except Exception as e:
        print(f"  ❌ GLM error: {e}")
        continue
    
    # Validate FAQ has 3+ Q blocks
    q_count = len(re.findall(r'^###\s*Q[:\?]', faq_text, re.MULTILINE))
    if q_count < 3:
        print(f"  ⚠️ only {q_count} Q blocks — retry...")
        try:
            faq_text = call_glm(prompt + "\n\nIMPORTANT: generate EXACTLY 4 questions.", max_tokens=2000)
            q_count = len(re.findall(r'^###\s*Q[:\?]', faq_text, re.MULTILINE))
        except Exception as e:
            print(f"  ❌ retry failed: {e}")
            continue
    
    # Insert FAQ before CTA or at end
    if cta_match:
        body_before = body[:cta_match.start()]
        body_cta = body[cta_match.start():]
        new_body = body_before.rstrip() + "\n\n" + faq_text.strip() + "\n\n" + body_cta.lstrip()
    else:
        new_body = body.rstrip() + "\n\n" + faq_text.strip() + "\n"
    
    # Update frontmatter faq:
    # Remove existing faq block and add new one
    fm_no_faq = re.sub(r'\nfaq:\n(?:\s+- q:.*?\n(?:\s+a:.*?\n)*)+', '', frontmatter)
    faq_yaml_lines = []
    for q_block in re.finditer(r'^###\s*Q[:\.](.*?)\n\n(.*?)(?=\n###\s*Q[:\.]|\Z)', faq_text, re.MULTILINE | re.DOTALL):
        q = q_block.group(1).strip().strip('?').strip()
        a = q_block.group(2).strip().replace('"', '\\"')
        faq_yaml_lines.append(f'  - q: "{q}"')
        faq_yaml_lines.append(f'    a: "{a}"')
    
    if faq_yaml_lines:
        faq_yaml = '\n' + '\n'.join(faq_yaml_lines) + '\n'
        # Insert faq before the last ---
        fm_parts = fm_no_faq.rsplit('---', 1)
        if len(fm_parts) == 2:
            new_fm = fm_parts[0] + 'faq:\n' + '\n'.join(faq_yaml_lines) + '\n---\n'
        else:
            new_fm = fm_no_faq.rstrip() + 'faq:\n' + '\n'.join(faq_yaml_lines) + '\n'
    else:
        new_fm = frontmatter
    
    new_text = new_fm + new_body
    
    # Save
    backup = f.with_suffix('.md.bak2')
    backup.write_text(text, encoding='utf-8')
    f.write_text(new_text, encoding='utf-8')
    
    # Validate
    new_q_count = len(re.findall(r'^###\s*Q[:\?]', new_text, re.MULTILINE))
    print(f"  ✅ saved ({new_q_count} Q blocks in body, {len(faq_yaml_lines)//2} in frontmatter)", flush=True)

print("\n📊 DONE")
