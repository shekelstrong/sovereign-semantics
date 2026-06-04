import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

/**
 * GET /api/system-prompt
 *
 * Возвращает полную инструкцию для AI-агента, генерирующего статьи
 * в формате проекта. Используется:
 * - в админке (кнопка «Скопировать System Prompt»)
 * - внешними скриптами / n8n / Make / ChatGPT / Claude / GigaChat
 *
 * Хранится в `content/SYSTEM_PROMPT.md` — редактируется обычным
 * git-коммитом, никаких внешних БД не нужно.
 */

let cached: { mtime: number; prompt: string } | null = null;

function loadSystemPrompt(): string {
  const filePath = path.join(process.cwd(), "content", "SYSTEM_PROMPT.md");
  try {
    const stat = fs.statSync(filePath);
    if (cached && cached.mtime === stat.mtimeMs) return cached.prompt;

    const text = fs.readFileSync(filePath, "utf8");
    cached = { mtime: stat.mtimeMs, prompt: text };
    return text;
  } catch {
    return "[SYSTEM_PROMPT.md not found in content/]";
  }
}

export async function GET() {
  const prompt = loadSystemPrompt();
  return NextResponse.json(
    { prompt, length: prompt.length },
    {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    },
  );
}
