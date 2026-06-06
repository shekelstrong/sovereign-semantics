import fs from "node:fs/promises";
import path from "node:path";

/**
 * Генерация обложки через OpenRouter.
 *
 * Модель берётся из env `OPENROUTER_IMAGE_MODEL` (дефолт:
 * `sourceful/riverflow-v2.5-pro:free`). Зафиксировано по решению
 * владельца проекта, чтобы обложки сайта и любые ad-hoc генерации
 * в чат-боте шли через одну и ту же модель.
 *
 * Возвращает публичный URL (относительный) сохранённой обложки.
 * Если OPENROUTER_API_KEY не задан — бросает ошибку.
 */
const OPENROUTER_ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";
// 2026-06-06: дефолт — sourceful/riverflow-v2.5-pro:free (единственная free image-gen модель
// в OpenRouter на июнь 2026, released 2026-06-04, ~219s latency, ~33% uptime в первые дни).
// Sourceful НЕ принимает `modalities: ["image","text"]` — иначе 404. См. ниже.
// Fallback на `google/gemini-3.1-flash-image-preview` (платный, $0.0000003/img, 6s, стабильный)
// — там modalities обязательны. Переключение делается через env `OPENROUTER_IMAGE_MODEL`.
// История фиксов: [[Secrets-Vault-2026-06-06#Известная-проблема-OPENROUTER_IMAGE_MODEL]].
const IMAGE_MODEL =
  process.env.OPENROUTER_IMAGE_MODEL || "sourceful/riverflow-v2.5-pro:free";
const COVERS_DIR = path.join(process.cwd(), "public", "covers");

interface OpenRouterImageResponse {
  choices: Array<{
    message: {
      images?: Array<{
        type: string;
        image_url: { url: string };
      }>;
      content?: string;
    };
  }>;
}

export interface CoverResult {
  url: string;
  mime: string;
  bytes: number;
  model: string;
}

export async function generateCover(
  prompt: string,
  slug: string,
): Promise<CoverResult> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error(
      "OPENROUTER_API_KEY is not set. Add it in Vercel Environment Variables.",
    );
  }

  // Усиливаем промпт стилистическим якорем проекта
  const enhancedPrompt = `${prompt}

Style: dark mode, emerald green and cold neon blue accents, hyperrealistic, 8k, architectural visualization, conceptual tech art, cinematic lighting, depth of field. Strictly no text, no logos, no watermarks, no letters, no words on the image itself.`;

  // Sourceful (любая модель с id, начинающимся на "sourceful/") не принимает поле
  // `modalities` — отдаёт 404 "No endpoints found that support the requested output
  // modalities". Для всех остальных моделей (Gemini, GPT-Image и т.п.) modalities
  // обязательны. Подробнее: skill `openrouter-image-gen`.
  const isSourceful = IMAGE_MODEL.startsWith("sourceful/");
  const requestBody: Record<string, unknown> = {
    model: IMAGE_MODEL,
    messages: [
      {
        role: "user",
        content: enhancedPrompt,
      },
    ],
  };
  if (!isSourceful) {
    requestBody.modalities = ["image", "text"];
  }

  const response = await fetch(OPENROUTER_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "https://sovereign-semantics.vercel.app",
      "X-Title": "Sovereign Semantics",
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(
      `OpenRouter API error ${response.status}: ${errText.slice(0, 300)}`,
    );
  }

  const data: OpenRouterImageResponse = await response.json();
  const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

  if (!imageUrl) {
    throw new Error(
      "No image in OpenRouter response. The model may have returned text only.",
    );
  }

  // Парсим data URL
  const match = imageUrl.match(/^data:image\/(\w+);base64,(.+)$/);
  if (!match) {
    throw new Error("Unexpected image URL format (expected data: URL)");
  }

  const mime = `image/${match[1]}`;
  const base64 = match[2];
  const buffer = Buffer.from(base64, "base64");

  // Сохраняем в public/covers/{slug}.{ext}
  await fs.mkdir(COVERS_DIR, { recursive: true });
  const ext = match[1] === "jpeg" ? "jpg" : match[1];
  const filename = `${slug}.${ext}`;
  const filepath = path.join(COVERS_DIR, filename);
  await fs.writeFile(filepath, buffer);

  return {
    url: `/covers/${filename}`,
    mime,
    bytes: buffer.length,
    model: IMAGE_MODEL,
  };
}

/**
 * Извлекает IMAGE_PROMPT_FOR_AI из контента статьи (если автор сгенерировал
 * его по нашему System Prompt), иначе строит промпт из title+description.
 */
export function extractOrBuildPrompt(
  content: string,
  title: string,
  description: string,
): string {
  const match = content.match(
    /\[IMAGE_PROMPT_FOR_AI\]([\s\S]*?)\[\/IMAGE_PROMPT_FOR_AI\]/i,
  );
  if (match) {
    return match[1].trim();
  }
  // Fallback: собираем из title
  return `Abstract technological visualization of: ${title}. Context: ${description.slice(0, 200)}.`;
}
