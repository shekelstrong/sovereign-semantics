"use client";

import { useState, useEffect, useRef } from "react";
import {
  Lock,
  Key,
  Copy,
  Check,
  Plus,
  Trash2,
  Save,
  ImageIcon,
  FileText,
  X,
  RefreshCw,
  Search,
  Send,
  Eye,
  Edit3,
} from "lucide-react";

const TOKEN_KEY = "cms-api-token";

interface ArticleItem {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  draft: boolean;
  readingTime?: number;
}

interface FormState {
  title: string;
  description: string;
  content: string;
  tags: string[];
  cover: "" | "url" | "ai";
  coverUrl: string;
  author: string;
  draft: boolean;
  ctaLabel: string;
  ctaHref: string;
  related: string;
}

const EMPTY_FORM: FormState = {
  title: "",
  description: "",
  content: "",
  tags: ["it-ai"],
  cover: "",
  coverUrl: "",
  author: "Редакция АСС",
  draft: false,
  ctaLabel: "",
  ctaHref: "",
  related: "",
};

const TAG_OPTIONS = [
  { value: "geopolitics", label: "Геополитика" },
  { value: "it-ai", label: "IT и ИИ" },
  { value: "economy", label: "Экономика" },
  { value: "lifestyle", label: "ЗОЖ" },
  { value: "methodology", label: "Методология" },
];

export function AdminPanel() {
  const [token, setToken] = useState<string>("");
  const [authed, setAuthed] = useState(false);
  const [tokenInput, setTokenInput] = useState("");
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [systemPrompt, setSystemPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<"list" | "editor" | "prompt">("list");
  const [editing, setEditing] = useState<ArticleItem | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [preview, setPreview] = useState(false);
  const [filter, setFilter] = useState("");
  const [copyOk, setCopyOk] = useState(false);
  const [status, setStatus] = useState<{
    type: "ok" | "err" | "info";
    text: string;
  } | null>(null);

  // Init: load token from localStorage
  useEffect(() => {
    const t = localStorage.getItem(TOKEN_KEY) || "";
    setToken(t);
    if (t) setAuthed(true);
  }, []);

  // Load articles when authed
  useEffect(() => {
    if (authed) {
      loadArticles();
      loadSystemPrompt();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed]);

  async function loadArticles() {
    setLoading(true);
    try {
      const r = await fetch("/api/articles-list", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const j = await r.json();
      setArticles(j.articles);
    } catch (err) {
      setStatus({
        type: "err",
        text: `Не удалось загрузить: ${err instanceof Error ? err.message : String(err)}`,
      });
    } finally {
      setLoading(false);
    }
  }

  async function loadSystemPrompt() {
    try {
      const r = await fetch("/api/system-prompt");
      const j = await r.json();
      setSystemPrompt(j.prompt);
    } catch (err) {
      console.error(err);
    }
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!tokenInput.trim()) return;
    localStorage.setItem(TOKEN_KEY, tokenInput.trim());
    setToken(tokenInput.trim());
    setAuthed(true);
  }

  function handleLogout() {
    localStorage.removeItem(TOKEN_KEY);
    setToken("");
    setAuthed(false);
    setArticles([]);
  }

  function startNew() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setView("editor");
    setStatus(null);
  }

  function startEdit(a: ArticleItem) {
    setEditing(a);
    setForm({
      title: a.title,
      description: a.description,
      content: "",
      tags: a.tags,
      cover: "",
      coverUrl: "",
      author: "Редакция АСС",
      draft: a.draft,
      ctaLabel: "",
      ctaHref: "",
      related: "",
    });
    setView("editor");
    setStatus(null);
  }

  async function handleSubmit(publish: boolean) {
    setStatus({ type: "info", text: "Сохранение…" });
    try {
      const payload = {
        title: form.title,
        description: form.description,
        content: form.content,
        tags: form.tags,
        cover:
          form.cover === "ai" ? true : form.cover === "url" ? form.coverUrl : "",
        author: form.author,
        draft: !publish,
        cta:
          form.ctaLabel && form.ctaHref
            ? { label: form.ctaLabel, href: form.ctaHref }
            : undefined,
        related: form.related
          ? form.related
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : undefined,
      };

      const r = await fetch("/api/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const j = await r.json();
      if (!r.ok) throw new Error(j.error || `HTTP ${r.status}`);

      setStatus({
        type: "ok",
        text: j.message || "Сохранено",
      });
      await loadArticles();
    } catch (err) {
      setStatus({
        type: "err",
        text: `Ошибка: ${err instanceof Error ? err.message : String(err)}`,
      });
    }
  }

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(systemPrompt);
      setCopyOk(true);
      setTimeout(() => setCopyOk(false), 2000);
    } catch {
      setStatus({ type: "err", text: "Не удалось скопировать" });
    }
  }

  // === AUTH SCREEN ===
  if (!authed) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md p-8 border border-[var(--color-border)] bg-[var(--color-surface)]"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 border border-[var(--color-accent)] flex items-center justify-center">
              <Lock className="w-5 h-5 text-[var(--color-accent)]" />
            </div>
            <div>
              <h1 className="font-mono text-lg font-semibold">CMS Access</h1>
              <p className="font-mono text-xs uppercase tracking-wider text-[var(--color-foreground-muted)]">
                Архитектура суверенных смыслов
              </p>
            </div>
          </div>

          <label className="block font-mono text-xs uppercase tracking-wider text-[var(--color-foreground-muted)] mb-2">
            API Token (CMS_API_TOKEN)
          </label>
          <div className="relative mb-6">
            <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-foreground-subtle)]" />
            <input
              type="password"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="Введите токен"
              className="w-full pl-10 pr-4 py-3 bg-[var(--color-background)] border border-[var(--color-border)] focus:border-[var(--color-accent)] focus:outline-none font-mono text-sm"
              autoFocus
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-3 bg-[var(--color-accent)] text-[var(--color-accent-foreground)] font-mono text-sm uppercase tracking-wider hover:shadow-[0_0_20px_var(--color-accent-glow)] transition-shadow"
          >
            Войти
          </button>

          <p className="mt-6 text-xs text-[var(--color-foreground-subtle)] text-center">
            Токен хранится только в localStorage вашего браузера.
          </p>
        </form>
      </div>
    );
  }

  // === MAIN PANEL ===
  const filteredArticles = articles.filter(
    (a) =>
      !filter ||
      a.title.toLowerCase().includes(filter.toLowerCase()) ||
      a.description.toLowerCase().includes(filter.toLowerCase()),
  );

  return (
    <div className="py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-accent)] mb-1">
              ↓ /admin
            </p>
            <h1 className="font-mono text-2xl sm:text-3xl font-bold">
              CMS Panel
            </h1>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <TabButton
              active={view === "list"}
              onClick={() => setView("list")}
            >
              <FileText className="w-3.5 h-3.5 inline mr-1" /> Статьи
            </TabButton>
            <TabButton
              active={view === "editor"}
              onClick={startNew}
            >
              <Plus className="w-3.5 h-3.5 inline mr-1" /> Новая
            </TabButton>
            <TabButton
              active={view === "prompt"}
              onClick={() => setView("prompt")}
            >
              <Key className="w-3.5 h-3.5 inline mr-1" /> System Prompt
            </TabButton>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 font-mono text-xs uppercase tracking-wider border border-[var(--color-border)] hover:border-[var(--color-danger)] hover:text-[var(--color-danger)] transition-colors"
            >
              Выйти
            </button>
          </div>
        </div>

        {status && (
          <div
            className={[
              "mb-6 p-3 text-sm border font-mono",
              status.type === "ok"
                ? "border-[var(--color-accent)]/40 bg-[var(--color-accent)]/5 text-[var(--color-accent)]"
                : status.type === "err"
                  ? "border-[var(--color-danger)]/40 bg-[var(--color-danger)]/5 text-[var(--color-danger)]"
                  : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-foreground-muted)]",
            ].join(" ")}
          >
            {status.text}
          </div>
        )}

        {/* === LIST === */}
        {view === "list" && (
          <div>
            <div className="flex gap-3 mb-6 flex-wrap">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-foreground-subtle)]" />
                <input
                  type="text"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  placeholder="Поиск статей..."
                  className="w-full pl-10 pr-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] focus:border-[var(--color-accent)] focus:outline-none text-sm"
                />
              </div>
              <button
                onClick={loadArticles}
                className="px-3 py-2 border border-[var(--color-border)] hover:border-[var(--color-foreground-muted)] transition-colors"
                aria-label="Обновить"
              >
                <RefreshCw
                  className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                />
              </button>
            </div>

            {loading && articles.length === 0 ? (
              <p className="text-center py-12 text-[var(--color-foreground-muted)] font-mono text-sm">
                Загрузка…
              </p>
            ) : filteredArticles.length === 0 ? (
              <p className="text-center py-12 text-[var(--color-foreground-muted)] font-mono text-sm">
                Нет статей
              </p>
            ) : (
              <div className="space-y-2">
                {filteredArticles.map((a) => (
                  <div
                    key={a.slug}
                    className="flex items-center gap-3 p-4 border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-foreground-subtle)] transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-mono text-sm font-semibold truncate">
                          {a.title}
                        </h3>
                        {a.draft && (
                          <span className="font-mono text-xs uppercase tracking-wider px-1.5 py-0.5 bg-[var(--color-warning)]/20 text-[var(--color-warning)] border border-[var(--color-warning)]/30">
                            Draft
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[var(--color-foreground-muted)] line-clamp-1">
                        {a.description}
                      </p>
                      <div className="flex items-center gap-3 mt-2 font-mono text-xs uppercase tracking-wider text-[var(--color-foreground-subtle)]">
                        <span>/{a.slug}</span>
                        <span>·</span>
                        <span>
                          {new Date(a.date).toLocaleDateString("ru-RU")}
                        </span>
                        {a.readingTime && (
                          <>
                            <span>·</span>
                            <span>{a.readingTime} мин</span>
                          </>
                        )}
                        {a.tags.length > 0 && (
                          <>
                            <span>·</span>
                            <span className="text-[var(--color-accent)]">
                              {a.tags.join(", ")}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <a
                        href={`/blog/${a.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 hover:text-[var(--color-accent)] transition-colors"
                        title="Открыть"
                      >
                        <Eye className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => startEdit(a)}
                        className="p-2 hover:text-[var(--color-accent)] transition-colors"
                        title="Редактировать"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* === EDITOR === */}
        {view === "editor" && (
          <Editor
            form={form}
            setForm={setForm}
            preview={preview}
            setPreview={setPreview}
            editing={editing}
            onSubmit={handleSubmit}
            onCancel={() => {
              setView("list");
              setEditing(null);
            }}
          />
        )}

        {/* === PROMPT === */}
        {view === "prompt" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h2 className="font-mono text-lg font-semibold">
                  System Prompt для AI-агента
                </h2>
                <p className="text-sm text-[var(--color-foreground-muted)] mt-1">
                  Скопируйте и вставьте в ChatGPT, Claude, GigaChat — затем
                  передайте тему для генерации статьи по протоколу.
                </p>
              </div>
              <button
                onClick={copyPrompt}
                className="px-4 py-2 bg-[var(--color-accent)] text-[var(--color-accent-foreground)] font-mono text-xs uppercase tracking-wider hover:shadow-[0_0_20px_var(--color-accent-glow)] transition-shadow"
              >
                {copyOk ? (
                  <>
                    <Check className="w-3.5 h-3.5 inline mr-1" /> Скопировано
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 inline mr-1" /> Скопировать
                  </>
                )}
              </button>
            </div>

            <textarea
              readOnly
              value={systemPrompt}
              rows={20}
              className="w-full px-4 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] focus:border-[var(--color-accent)] focus:outline-none font-mono text-xs leading-relaxed resize-y"
            />
          </div>
        )}
      </div>
    </div>
  );
}

// === Sub-components ===

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "px-3 py-1.5 font-mono text-xs uppercase tracking-wider border transition-colors",
        active
          ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-accent-foreground)]"
          : "border-[var(--color-border)] text-[var(--color-foreground-muted)] hover:border-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)]",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function Editor({
  form,
  setForm,
  preview,
  setPreview,
  editing,
  onSubmit,
  onCancel,
}: {
  form: FormState;
  setForm: (f: FormState) => void;
  preview: boolean;
  setPreview: (p: boolean) => void;
  editing: ArticleItem | null;
  onSubmit: (publish: boolean) => void;
  onCancel: () => void;
}) {
  const taRef = useRef<HTMLTextAreaElement>(null);

  function insertAtCursor(text: string) {
    const ta = taRef.current;
    if (!ta) {
      setForm({ ...form, content: form.content + text });
      return;
    }
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const before = form.content.slice(0, start);
    const after = form.content.slice(end);
    const newContent = before + text + after;
    setForm({ ...form, content: newContent });
    setTimeout(() => {
      ta.focus();
      ta.selectionStart = ta.selectionEnd = start + text.length;
    }, 0);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Form */}
      <div className="space-y-4">
        <div>
          <Label>Заголовок (H1) *</Label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="До 70 символов, главный ключ"
            maxLength={70}
            className="w-full px-3 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] focus:border-[var(--color-accent)] focus:outline-none text-sm"
          />
          <p className="mt-1 font-mono text-xs text-[var(--color-foreground-subtle)]">
            {form.title.length} / 70
          </p>
        </div>

        <div>
          <Label>Description (SEO) *</Label>
          <input
            type="text"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            placeholder="До 160 символов, для сниппета"
            maxLength={160}
            className="w-full px-3 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] focus:border-[var(--color-accent)] focus:outline-none text-sm"
          />
          <p className="mt-1 font-mono text-xs text-[var(--color-foreground-subtle)]">
            {form.description.length} / 160
          </p>
        </div>

        <div>
          <Label>Теги</Label>
          <div className="flex flex-wrap gap-1.5">
            {TAG_OPTIONS.map((opt) => {
              const active = form.tags.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() =>
                    setForm({
                      ...form,
                      tags: active
                        ? form.tags.filter((t) => t !== opt.value)
                        : [...form.tags, opt.value],
                    })
                  }
                  className={[
                    "px-2 py-1 font-mono text-xs uppercase tracking-wider border transition-colors",
                    active
                      ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-accent-foreground)]"
                      : "border-[var(--color-border)] text-[var(--color-foreground-muted)] hover:border-[var(--color-foreground-muted)]",
                  ].join(" ")}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <Label>Обложка</Label>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="cover"
                checked={form.cover === "ai"}
                onChange={() => setForm({ ...form, cover: "ai" })}
                className="accent-[var(--color-accent)]"
              />
              <span className="text-sm">
                <ImageIcon className="w-3.5 h-3.5 inline mr-1 text-[var(--color-accent)]" />
                Сгенерировать через AI (DALL-E)
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="cover"
                checked={form.cover === "url"}
                onChange={() => setForm({ ...form, cover: "url" })}
                className="accent-[var(--color-accent)]"
              />
              <span className="text-sm">Указать URL вручную</span>
            </label>
            {form.cover === "url" && (
              <input
                type="url"
                value={form.coverUrl}
                onChange={(e) =>
                  setForm({ ...form, coverUrl: e.target.value })
                }
                placeholder="https://..."
                className="w-full px-3 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] focus:border-[var(--color-accent)] focus:outline-none text-sm"
              />
            )}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="cover"
                checked={form.cover === ""}
                onChange={() => setForm({ ...form, cover: "" })}
                className="accent-[var(--color-accent)]"
              />
              <span className="text-sm text-[var(--color-foreground-muted)]">
                Без обложки
              </span>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Автор</Label>
            <input
              type="text"
              value={form.author}
              onChange={(e) => setForm({ ...form, author: e.target.value })}
              className="w-full px-3 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] focus:border-[var(--color-accent)] focus:outline-none text-sm"
            />
          </div>
          <div>
            <Label>Связанные (slug)</Label>
            <input
              type="text"
              value={form.related}
              onChange={(e) => setForm({ ...form, related: e.target.value })}
              placeholder="slug-1, slug-2"
              className="w-full px-3 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] focus:border-[var(--color-accent)] focus:outline-none text-sm"
            />
          </div>
        </div>

        <div>
          <Label>CTA (опционально)</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input
              type="text"
              value={form.ctaLabel}
              onChange={(e) =>
                setForm({ ...form, ctaLabel: e.target.value })
              }
              placeholder="Telegram-канал"
              className="px-3 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] focus:border-[var(--color-accent)] focus:outline-none text-sm"
            />
            <input
              type="url"
              value={form.ctaHref}
              onChange={(e) => setForm({ ...form, ctaHref: e.target.value })}
              placeholder="https://t.me/..."
              className="px-3 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] focus:border-[var(--color-accent)] focus:outline-none text-sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 pt-4 border-t border-[var(--color-border)]">
          <button
            onClick={() => onSubmit(false)}
            className="px-4 py-2 border border-[var(--color-border)] hover:border-[var(--color-foreground-muted)] font-mono text-xs uppercase tracking-wider transition-colors"
          >
            <Save className="w-3.5 h-3.5 inline mr-1" /> Сохранить как Draft
          </button>
          <button
            onClick={() => onSubmit(true)}
            className="px-4 py-2 bg-[var(--color-accent)] text-[var(--color-accent-foreground)] font-mono text-xs uppercase tracking-wider hover:shadow-[0_0_20px_var(--color-accent-glow)] transition-shadow"
          >
            <Send className="w-3.5 h-3.5 inline mr-1" /> Опубликовать
          </button>
          <button
            onClick={onCancel}
            className="px-3 py-2 text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] transition-colors"
          >
            <X className="w-3.5 h-3.5 inline mr-1" /> Отмена
          </button>
        </div>
      </div>

      {/* Markdown editor + preview */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label>Markdown-контент *</Label>
          <button
            onClick={() => setPreview(!preview)}
            className="font-mono text-xs uppercase tracking-wider text-[var(--color-foreground-muted)] hover:text-[var(--color-accent)] transition-colors"
          >
            {preview ? "Редактор" : "Превью"}
          </button>
        </div>

        {preview ? (
          <div className="min-h-[500px] p-4 border border-[var(--color-border)] bg-[var(--color-surface)] prose-article text-sm">
            <em>Превью (базовое): перевод Markdown → HTML будет на сервере.</em>
            <pre className="mt-2 text-xs whitespace-pre-wrap">
              {form.content}
            </pre>
          </div>
        ) : (
          <>
            <div className="flex gap-1 mb-2 flex-wrap">
              {[
                { label: "H1", text: "\n# Заголовок\n" },
                { label: "H2", text: "\n## Раздел\n" },
                { label: "H3", text: "\n### Подраздел\n" },
                { label: "B", text: "**жирный**" },
                { label: "I", text: "*курсив*" },
                { label: "List", text: "\n- Пункт 1\n- Пункт 2\n" },
                { label: "Quote", text: "\n> Цитата\n" },
                { label: "Code", text: "`код`" },
                { label: "Link", text: "[текст](https://...)" },
              ].map((b) => (
                <button
                  key={b.label}
                  type="button"
                  onClick={() => insertAtCursor(b.text)}
                  className="px-2 py-1 font-mono text-xs border border-[var(--color-border)] hover:border-[var(--color-foreground-muted)] transition-colors"
                >
                  {b.label}
                </button>
              ))}
            </div>
            <textarea
              ref={taRef}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows={20}
              placeholder="# Заголовок&#10;&#10;Лид-абзац...&#10;&#10;## Раздел 1&#10;Текст..."
              className="w-full px-3 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] focus:border-[var(--color-accent)] focus:outline-none font-mono text-xs leading-relaxed resize-y"
            />
            <p className="mt-1 font-mono text-xs text-[var(--color-foreground-subtle)]">
              {form.content.trim().split(/\s+/).filter(Boolean).length} слов
            </p>
          </>
        )}
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block font-mono text-xs uppercase tracking-wider text-[var(--color-foreground-muted)] mb-2">
      {children}
    </label>
  );
}
