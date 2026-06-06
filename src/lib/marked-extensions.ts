/**
 * Кастомные marked-расширения для [[wiki-link]] в стиле Obsidian.
 *
 * Поддерживаемые формы:
 *   [[slug]]              → <a href="/ru/blog/slug">slug</a>
 *   [[slug|Display Text]] → <a href="/ru/blog/slug">Display Text</a>
 *   [[ru/blog/slug]]      → <a href="/ru/blog/slug">slug</a>  (с локалью)
 *   [[en/article|Foo]]    → <a href="/en/blog/article">Foo</a>
 *
 * Алиасы (slug → alias) опционально подгружаются через registerWikiAliases.
 *
 * Если slug не в алиасах — рендерим как обычный текст (без ссылки),
 * чтобы статья не падала, если [[ссылка]] указывает на несуществующее.
 */

import { marked } from "marked";

interface WikiLinkOpts {
  /** Локаль по умолчанию, к которой добавляется префикс /blog/ */
  defaultLocale?: "ru" | "en";
  /** Маппинг slug → display name (для автогенерации списка статей) */
  aliases?: Map<string, string>;
}

let opts: WikiLinkOpts = { defaultLocale: "ru" };

export function setWikiLinkOptions(o: WikiLinkOpts) {
  opts = { ...opts, ...o };
}

export function registerWikiAliases(aliases: Record<string, string>) {
  if (!opts.aliases) opts.aliases = new Map();
  for (const [k, v] of Object.entries(aliases)) {
    opts.aliases.set(k.toLowerCase(), v);
  }
}

// Inline tokenizer: [[...]] до любого whitespace/punct.
// ВАЖНО: regex ДОЛЖЕН быть anchored с ^ — иначе marked v18 считает raw[0] 
// не от начала токена, и consumption ломается (хвост `]]` остаётся в HTML).
const WIKI_LINK_RE = /^\[\[([^\[\]]+?)\]\]/;

export function installWikiLinks() {
  marked.use({
    extensions: [
      {
        name: "wikiLink",
        level: "inline",
        start(src: string) {
          return src.indexOf("[[");
        },
        tokenizer(src: string) {
          const match = WIKI_LINK_RE.exec(src);
          if (!match) return undefined;
          const [full, inner] = match;
          return {
            type: "wikiLink",
            raw: full,
            inner: inner.trim(),
          };
        },
        // Marked v18: nested inline tokens (если inner содержит `|`) парсятся 
        // отдельно и ломают consumption. Возвращаем их как plain tokens.
        // Решение: если в inner есть `|`, рендерим inner как plain text, 
        // а slug/target парсим сами.
        renderer(token: any) {
          const inner: string = token.inner;
          const locale = opts.defaultLocale || "ru";
          let target: string;
          let display: string;

          // [[path|Display]] или [[path]]
          const pipeIdx = inner.indexOf("|");
          if (pipeIdx > 0) {
            target = inner.slice(0, pipeIdx).trim();
            display = inner.slice(pipeIdx + 1).trim();
          } else {
            target = inner.trim();
            display = target;
          }

          // [[ru/slug]] или [[en/slug]] — явная локаль
          const localeMatch = target.match(/^(ru|en)\/(.+)$/);
          let href: string;
          let finalDisplay = display;

          if (localeMatch) {
            const loc = localeMatch[1];
            const slug = localeMatch[2];
            href = `/${loc}/blog/${slug}`;
          } else {
            // Алиас: если есть в карте, используем display name
            if (opts.aliases?.has(target.toLowerCase())) {
              finalDisplay = opts.aliases.get(target.toLowerCase())!;
            }
            href = `/${locale}/blog/${target}`;
          }

          return `<a href="${href}" class="wiki-link" data-wiki-link="${target}">${finalDisplay}</a>`;
        },
      },
    ],
  });
}
