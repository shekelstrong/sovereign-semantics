import { NextResponse } from "next/server";

/**
 * POST /api/contact
 *
 * Приём сообщений с формы обратной связи.
 * В проде: складывает в Telegram-бот через webhook или отправляет на email.
 * В dev: логирует.
 */

interface ContactPayload {
  name: string;
  email: string;
  topic: string;
  message: string;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: Request) {
  let body: ContactPayload;
  try {
    body = (await req.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.name || body.name.length < 2) {
    return NextResponse.json(
      { error: "name: минимум 2 символа" },
      { status: 400 },
    );
  }
  if (!isValidEmail(body.email)) {
    return NextResponse.json(
      { error: "email: некорректный адрес" },
      { status: 400 },
    );
  }
  if (!body.message || body.message.length < 10) {
    return NextResponse.json(
      { error: "message: минимум 10 символов" },
      { status: 400 },
    );
  }

  const topicLabels: Record<string, string> = {
    collab: "Сотрудничество",
    author: "Хочу стать автором",
    press: "Запрос пресс-службы",
    bug: "Сообщить об ошибке",
    other: "Другое",
  };

  // Канал доставки: 1) Telegram-бот, 2) Email (Resend/SendGrid), 3) Console (dev)

  // === Telegram ===
  if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
    const text =
      `📩 *Новое сообщение с сайта*\n\n` +
      `*Тема:* ${topicLabels[body.topic] || body.topic}\n` +
      `*Имя:* ${body.name}\n` +
      `*Email:* ${body.email}\n\n` +
      `${body.message}`;

    try {
      const r = await fetch(
        `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: process.env.TELEGRAM_CHAT_ID,
            text,
            parse_mode: "Markdown",
          }),
        },
      );
      if (!r.ok) throw new Error(`Telegram ${r.status}`);
    } catch (err) {
      console.error("[contact] Telegram send failed:", err);
    }
  }

  // === Resend (email) ===
  if (process.env.RESEND_API_KEY) {
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "sovereign-semantics <noreply@sovereign-semantics.ru>",
          to: ["hello@sovereign-semantics.ru"],
          subject: `[${topicLabels[body.topic]}] ${body.name}`,
          text: `От: ${body.name} <${body.email}>\n\n${body.message}`,
        }),
      });
    } catch (err) {
      console.error("[contact] Resend failed:", err);
    }
  }

  // === Dev fallback ===
  if (
    !process.env.TELEGRAM_BOT_TOKEN &&
    !process.env.RESEND_API_KEY
  ) {
    console.log("[contact] dev message:", body);
  }

  return NextResponse.json({ ok: true });
}
