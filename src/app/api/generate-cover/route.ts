import { NextRequest, NextResponse } from "next/server";

const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_BASE = "https://openrouter.ai/api/v1";

// Модели с фоллбеком
const IMAGE_MODELS = [
  "sourceful/riverflow-v2.5-pro:free",
  "google/gemini-3.1-flash-image-preview",
];

function _headers() {
  if (!OPENROUTER_KEY) throw new Error("OPENROUTER_API_KEY not set");
  return {
    "Authorization": `Bearer ${OPENROUTER_KEY}`,
    "Content-Type": "application/json",
    "HTTP-Referer": "https://sovereign-semantics.vercel.app",
    "X-Title": "Sovereign Semantics",
  };
}

/**
 * Генерирует промпт для обложки на основе содержания статьи
 */
function generateCoverPrompt(articleContent: string): string {
  // Extract key themes
  const themes = articleContent
    .toLowerCase()
    .match(/\b(агент|трафик|арбитраж|внимани|смысл|архитектур|ii|инфраструктур|монетизац|прокси|клоак|экономик|политик|финанс|образован|здраво|социальн|граф|платформ|контент|курс|криптовалют|vpn|суверен|метод|технолог|сигнал|шум|цифров|информац|статист|исследован|регуляц|прозрачн)\b/g)
    ?.slice(0, 8) || ["abstract", "futuristic"];

  const uniqueThemes = [...new Set(themes)].slice(0, 5);
  const themeStr = uniqueThemes.join(", ");

  return `Dark futuristic editorial cover image for article about ${themeStr}. Brutalist concrete architecture with neon emerald green and cold blue glowing data streams, volumetric fog, cinematic lighting, hyperrealistic tech-noir aesthetic, no text, no people, dark background with subtle grid lines, professional magazine cover quality, 8K, architectural visualization`;
}

async function _tryGenerateImage(model: string, prompt: string): Promise<string | null> {
  const url = `${OPENROUTER_BASE}/chat/completions`;

  const payload = {
    model,
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: prompt },
        ],
      },
    ],
    modalities: ["image"],
    size: "1792x1024",
  };

  const resp = await fetch(url, {
    method: "POST",
    headers: _headers(),
    body: JSON.stringify(payload),
  });

  if (!resp.ok) {
    const err = await resp.text();
    console.warn(`[OpenRouter Image] ${model} failed HTTP ${resp.status}: ${err.slice(0, 200)}`);
    return null;
  }

  const data = await resp.json();
  const msg = data.choices?.[0]?.message;

  if (!msg) return null;

  // Формат: images[] массив
  if (msg.images?.[0]) {
    const imgUrl = msg.images[0].image_url?.url;
    if (imgUrl?.startsWith("http")) return imgUrl;
    if (msg.images[0].content) return msg.images[0].content; // base64
  }

  // Старый формат: markdown URL в content
  const content = msg.content || "";
  const match = content.match(/!\[.*?\]\((https?:\/\/[^\)]+)\)/);
  if (match) return match[1];
  if (content.trim().startsWith("http")) return content.trim();
  if (content.trim().startsWith("data:image")) return content.trim();

  return null;
}

/**
 * Фоллбек-цепочка: пытаемся модели по порядку
 */
async function generateImageWithFallback(prompt: string): Promise<string> {
  let lastError = "All models failed";

  for (const model of IMAGE_MODELS) {
    try {
      const result = await _tryGenerateImage(model, prompt);
      if (result) {
        console.log(`[OpenRouter Image] Success with ${model}`);
        return result;
      }
    } catch (e) {
      lastError = (e as Error).message;
      console.warn(`[OpenRouter Image] ${model} exception: ${lastError}`);
    }
  }

  throw new Error(lastError);
}

export async function POST(req: NextRequest) {
  try {
    if (!OPENROUTER_KEY) {
      return NextResponse.json(
        { error: "OPENROUTER_API_KEY not configured in environment" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { articleContent, customPrompt } = body;

    const prompt = customPrompt || generateCoverPrompt(articleContent || "futuristic architecture");

    console.log("[API /api/generate-cover] Generating cover...");
    const imageData = await generateImageWithFallback(prompt);

    // Если URL — возвращаем как есть. Если base64 — тоже возвращаем.
    return NextResponse.json({
      success: true,
      imageUrl: imageData,
      prompt,
      model: imageData.startsWith("http") ? IMAGE_MODELS[0] : IMAGE_MODELS[1],
    });

  } catch (e) {
    console.error("[API /api/generate-cover] Error:", e);
    return NextResponse.json(
      { error: (e as Error).message || "Generation failed" },
      { status: 500 }
    );
  }
}