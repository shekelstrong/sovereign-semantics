import type { Locale } from "@/lib/articles-types";

interface FAQBlockProps {
  faq: { q: string; a: string }[];
  locale: Locale;
}

/**
 * Рендерит FAQ-блок в конце статьи.
 * Семантически использует <details>/<summary> для нативной сворачиваемости.
 * JSON-LD FAQPage генерится отдельным компонентом <ArticleJsonLd />.
 */
export function FAQBlock({ faq, locale }: FAQBlockProps) {
  if (!faq || faq.length === 0) return null;
  const isEn = locale === "en";
  return (
    <section className="mt-16 pt-10 border-t border-[var(--color-border)]">
      <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-foreground-muted)] mb-6">
        ↓ {isEn ? "Frequently Asked Questions" : "Часто задаваемые вопросы"}
      </h2>
      <div className="space-y-3">
        {faq.map((item, idx) => (
          <details
            key={idx}
            className="group border border-[var(--color-border)] hover:border-[var(--color-accent)]/40 transition-colors"
          >
            <summary className="cursor-pointer p-4 font-mono text-sm font-semibold flex items-center justify-between gap-3 list-none">
              <span className="flex-1">{item.q}</span>
              <span className="text-[var(--color-accent)] text-lg leading-none transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <div className="px-4 pb-4 pt-1 text-sm text-[var(--color-foreground-muted)] leading-relaxed prose-article">
              {item.a}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
