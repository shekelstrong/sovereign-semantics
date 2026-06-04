#!/usr/bin/env python3
"""
Strip markdown code fences from article and fix frontmatter.
"""
import sys, re
from pathlib import Path

REPO = Path("/root/Projects/sovereign-semantics")

def strip_fences(text):
    # Remove leading ```md or ```
    text = re.sub(r'^\s*`{3,}\s*(?:md|markdown)?\s*\n', '', text)
    # Remove trailing ```
    text = re.sub(r'\n\s*`{3,}\s*\n*$', '\n', text)
    return text.strip()

def fix_frontmatter(text):
    """Ensure frontmatter starts immediately with ---"""
    text = strip_fences(text)
    if text.startswith('---'):
        return text
    # If no frontmatter at all, add placeholders
    # But usually the issue is just code fences wrapping
    m = re.match(r'^(.*?)\n---\s*\n', text, re.DOTALL)
    if m:
        preamble = m.group(1).strip()
        if preamble:
            # There is text before ---, move it inside
            rest = text[m.end():]
            # Try to find where body starts
            return f"---\n{preamble}\n---\n{rest}"
    return text

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: strip-fences.py <file.md>")
        sys.exit(1)
    f = REPO / sys.argv[1]
    text = f.read_text(encoding='utf-8')
    fixed = strip_fences(text)
    backup = f.with_suffix('.md.bak')
    backup.write_text(text, encoding='utf-8')
    print(f"  backup: {backup.name}")
    f.write_text(fixed, encoding='utf-8')
    print(f"  stripped: {f.relative_to(REPO)}")
    # Validate
    if fixed.startswith('---\n'):
        print("  ✅ frontmatter OK")
    else:
        print("  ⚠️ still no frontmatter")
