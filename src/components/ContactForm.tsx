"use client";

import { useState } from "react";
import { Send, Check, AlertCircle } from "lucide-react";

type Status = "idle" | "sending" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

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
        <h3 className="font-mono text-xl font-semibold mb-2">
          Сообщение отправлено
        </h3>
        <p className="text-sm text-[var(--color-foreground-muted)] mb-6">
          Ответим в течение 24 часов на указанный email.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="font-mono text-xs uppercase tracking-wider text-[var(--color-foreground-muted)] hover:text-[var(--color-accent)] transition-colors"
        >
          Отправить ещё →
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Имя" name="name" required />
        <Field
          label="Email"
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
          Тема
        </label>
        <select
          id="topic"
          name="topic"
          required
          defaultValue="collab"
          className="w-full px-4 py-3 bg-[var(--color-background)] border border-[var(--color-border)] focus:border-[var(--color-accent)] focus:outline-none font-mono text-sm transition-colors"
        >
          <option value="collab">Сотрудничество</option>
          <option value="author">Хочу стать автором</option>
          <option value="press">Запрос пресс-службы</option>
          <option value="bug">Сообщить об ошибке</option>
          <option value="other">Другое</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="message"
          className="block font-mono text-xs uppercase tracking-wider text-[var(--color-foreground-muted)] mb-2"
        >
          Сообщение
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          minLength={10}
          placeholder="Расскажите, что у вас на уме…"
          className="w-full px-4 py-3 bg-[var(--color-background)] border border-[var(--color-border)] focus:border-[var(--color-accent)] focus:outline-none text-sm leading-relaxed resize-y transition-colors"
        />
      </div>

      {status === "error" && (
        <div className="flex items-start gap-2 p-3 border border-[var(--color-danger)]/40 bg-[var(--color-danger)]/5 text-sm text-[var(--color-danger)]">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>
            Ошибка отправки: {error}. Попробуйте позже или напишите в Telegram.
          </span>
        </div>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--color-accent)] text-[var(--color-accent-foreground)] font-mono text-sm uppercase tracking-wider hover:shadow-[0_0_30px_var(--color-accent-glow)] transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "sending" ? (
          <>Отправка…</>
        ) : (
          <>
            <Send className="w-4 h-4" />
            Отправить
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
