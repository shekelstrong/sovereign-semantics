"use client";

import { useState } from "react";
import { Send, Check, AlertCircle } from "lucide-react";
import type { Locale } from "@/lib/articles-types";

type Status = "idle" | "sending" | "success" | "error";

const T = {
  ru: {
    success: "Сообщение отправлено",
    successHint: "Ответим в течение 24 часов на указанный email.",
    another: "Отправить ещё →",
    name: "Имя",
    email: "Email",
    topic: "Тема",
    topics: {
      collab: "Сотрудничество",
      author: "Хочу стать автором",
      press: "Запрос пресс-службы",
      bug: "Сообщить об ошибке",
      other: "Другое",
    },
    message: "Сообщение",
    messagePlaceholder: "Расскажите, что у вас на уме…",
    errorPrefix: "Ошибка отправки",
    errorHint: "Попробуйте позже или напишите в Telegram.",
    sending: "Отправка…",
    submit: "Отправить",
  },
  en: {
    success: "Message sent",
    successHint: "We will reply within 24 hours to the email you provided.",
    another: "Send another →",
    name: "Name",
    email: "Email",
    topic: "Topic",
    topics: {
      collab: "Collaboration",
      author: "I want to be an author",
      press: "Press request",
      bug: "Report a bug",
      other: "Other",
    },
    message: "Message",
    messagePlaceholder: "Tell us what is on your mind…",
    errorPrefix: "Send error",
    errorHint: "Try again later or write to Telegram.",
    sending: "Sending…",
    submit: "Send",
  },
} as const;

export function ContactForm({ locale = "ru" }: { locale?: Locale }) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const t = T[locale];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      topic: formData.get("topic") as string,
      message: formData.get("message") as string,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || `HTTP ${res.status}`);
      }

      setStatus("success");
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="text-center py-10">
        <div className="inline-flex items-center justify-center w-14 h-14 mb-4 border border-[var(--color-accent)] text-[var(--color-accent)]">
          <Check className="w-6 h-6" />
        </div>
        <h3 className="font-mono text-xl font-semibold mb-2">{t.success}</h3>
        <p className="text-sm text-[var(--color-foreground-muted)] mb-6">
          {t.successHint}
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="font-mono text-xs uppercase tracking-wider text-[var(--color-foreground-muted)] hover:text-[var(--color-accent)] transition-colors"
        >
          {t.another}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label={t.name} name="name" required />
        <Field
          label={t.email}
          name="email"
          type="email"
          required
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label
          htmlFor="topic"
          className="block font-mono text-xs uppercase tracking-wider text-[var(--color-foreground-muted)] mb-2"
        >
          {t.topic}
        </label>
        <select
          id="topic"
          name="topic"
          required
          defaultValue="collab"
          className="w-full px-4 py-3 bg-[var(--color-background)] border border-[var(--color-border)] focus:border-[var(--color-accent)] focus:outline-none font-mono text-sm transition-colors"
        >
          <option value="collab">{t.topics.collab}</option>
          <option value="author">{t.topics.author}</option>
          <option value="press">{t.topics.press}</option>
          <option value="bug">{t.topics.bug}</option>
          <option value="other">{t.topics.other}</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="message"
          className="block font-mono text-xs uppercase tracking-wider text-[var(--color-foreground-muted)] mb-2"
        >
          {t.message}
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          minLength={10}
          placeholder={t.messagePlaceholder}
          className="w-full px-4 py-3 bg-[var(--color-background)] border border-[var(--color-border)] focus:border-[var(--color-accent)] focus:outline-none text-sm leading-relaxed resize-y transition-colors"
        />
      </div>

      {status === "error" && (
        <div className="flex items-start gap-2 p-3 border border-[var(--color-danger)]/40 bg-[var(--color-danger)]/5 text-sm text-[var(--color-danger)]">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>
            {t.errorPrefix}: {error}. {t.errorHint}
          </span>
        </div>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--color-accent)] text-[var(--color-accent-foreground)] font-mono text-sm uppercase tracking-wider hover:shadow-[0_0_30px_var(--color-accent-glow)] transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "sending" ? (
          <>{t.sending}</>
        ) : (
          <>
            <Send className="w-4 h-4" />
            {t.submit}
          </>
        )}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block font-mono text-xs uppercase tracking-wider text-[var(--color-foreground-muted)] mb-2"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-[var(--color-background)] border border-[var(--color-border)] focus:border-[var(--color-accent)] focus:outline-none text-sm transition-colors"
      />
    </div>
  );
}
