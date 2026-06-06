import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import slugify from "slugify";
import type { Article, ArticleTag, Locale } from "./articles-types";
import { installWikiLinks, registerWikiAliases } from "./marked-extensions";

// Активируем [[wiki-link]] (Obsidian-стиль)
installWikiLinks();

export type { Article, ArticleTag, Locale } from "./articles-types";
export { getTagLabel, getAllTags } from "./articles-types";

const ARTICLES_ROOT = path.join(process.cwd(), "content", "articles");

/** Маппинг «папка → локаль». На случай если когда-то будет одна папка с frontmatter.locale. */
function dirFor(locale: Locale): string {
  return path.join(ARTICLES_ROOT, locale);
}

function readingTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

function ensureDir(dir: string): void {
  // 2026-06-06: в Vercel production runtime `/var/task` read-only, поэтому
  // `mkdirSync('/var/task/content/articles/en')` падает с ENOENT даже при
  // recursive: true (родитель тоже read-only). Не критично — просто считаем,
  // что папка недоступна; `readdirSync` ниже вернёт ENOENT и обработается.
  try {
    fs.mkdirSync(dir, { recursive: true });
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      // Родитель не существует и недоступен для создания (read-only FS).
      // В production list вернётся пустым — это ожидаемо для /api/articles-list.
      return;
    }
    throw err;
  }
}

function validateFrontmatter(data: Record<string, unknown>): void {
  if (!data.title || typeof data.title !== "string") {
    throw new Error("Article frontmatter: 'title' is required");
  }
  if (!data.description || typeof data.description !== "string") {
    throw new Error("Article frontmatter: 'description' is required");
  }
  if (!data.date) {
    throw new Error("Article frontmatter: 'date' is required");
  }
}

export function slugifyTitle(title: string, locale: Locale = "ru"): string {
  return slugify(title, { lower: true, strict: true, locale });
}

export async function getAllArticles(
  opts: { includeDrafts?: boolean; locale?: Locale } = {},
): Promise<Article[]> {
  const locales: Locale[] = opts.locale ? [opts.locale] : ["ru", "en"];
  const all: Article[] = [];

  for (const loc of locales) {
    const dir = dirFor(loc);
    ensureDir(dir);
    let files: string[] = [];
    try {
      files = fs
        .readdirSync(dir)
        .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"));
    } catch (err) {
      // 2026-06-06: в Vercel read-only FS папка локали может быть недоступна —
      // пропускаем локаль, а не валим весь list.
      if ((err as NodeJS.ErrnoException).code === "ENOENT") continue;
      throw err;
    }
    for (const f of files) {
      const article = parseArticleFile(f, loc);
      if (article && (opts.includeDrafts || !article.draft)) {
        all.push(article);
      }
    }
  }

  return all.sort((a, b) => (a.date > b.date ? -1 : 1));
}

export async function getArticleBySlug(
  slug: string,
  locale: Locale = "ru",
): Promise<Article | null> {
  const dir = dirFor(locale);
  ensureDir(dir);
  const filePath = path.join(dir, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  return parseArticleFile(`${slug}.md`, locale);
}

/**
 * Находит перевод статьи на другую локаль (если существует).
 * Использует frontmatter.translations или ищет .md файл с тем же
 * оригинальным slug в другой папке.
 */
export async function getArticleTranslation(
  article: Article,
  target: Locale,
): Promise<Article | null> {
  // Явное указание в frontmatter
  if (article.translations?.[target]) {
    return getArticleBySlug(article.translations[target]!, target);
  }
  // Эвристика: ищем файл с тем же slug в другой локали
  const other = await getArticleBySlug(article.slug, target);
  if (other) return other;
  return null;
}

function parseArticleFile(filename: string, locale: Locale): Article | null {
  const filePath = path.join(dirFor(locale), filename);
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(raw);
    validateFrontmatter(data);

    const slug = filename.replace(/\.mdx?$/, "");
    const html = marked.parse(content, { async: false }) as string;

    // Локальная регистрация алиасов wiki-link: текущая статья по своему slug
    // и связанные статьи становятся автодополняемыми.
    // Display label берём КОРОТКИМ (до первого : или —), иначе в тексте
    // вылазит полный заголовок вида "VPN и криптовалюта в 2026: как собрать
    // стек приватности, а не набор маркетинговых обещаний" — нечитаемо.
    const _fullTitle = (data.title as string) || slug;
    const _shortTitle = (() => {
      const sep = _fullTitle.search(/[:—]/);
      const head = sep > 0 ? _fullTitle.slice(0, sep) : _fullTitle;
      const trimmed = head.trim();
      if (!trimmed) return slug;
      return trimmed.length > 60 ? trimmed.slice(0, 57).trimEnd() + "…" : trimmed;
    })();
    registerWikiAliases({ [slug.toLowerCase()]: _shortTitle });

    return {
      slug,
      locale,
      title: data.title as string,
      description: data.description as string,
      date: new Date(data.date as string).toISOString(),
      updated: data.updated
        ? new Date(data.updated as string).toISOString()
        : undefined,
      tags: (data.tags as ArticleTag[]) || [],
      cover: data.cover as string | undefined,
      ogCover: data.ogCover as string | undefined,
      coverPrompt: data.coverPrompt as string | undefined,
      readingTime: (data.readingTime as number) || readingTime(content),
      content,
      html,
      draft: (data.draft as boolean) || false,
      author: (data.author as string) || (locale === "ru" ? "Редакция" : "Editorial"),
      cta: data.cta as Article["cta"],
      related: data.related as string[] | undefined,
      translations: data.translations as Article["translations"],
      faq: data.faq as Article["faq"],
    };
  } catch (err) {
    console.error(`[articles] Failed to parse ${filename} (${locale}):`, err);
    return null;
  }
}

export async function getArticlesByTag(
  tag: ArticleTag,
  locale?: Locale,
): Promise<Article[]> {
  const all = await getAllArticles({ locale });
  return all.filter((a) => a.tags.includes(tag));
}

export async function getLatestArticles(
  n: number,
  locale?: Locale,
): Promise<Article[]> {
  const all = await getAllArticles({ locale });
  return all.slice(0, n);
}

export function articlePath(slug: string, locale: Locale = "ru"): string {
  return path.join(dirFor(locale), `${slug}.md`);
}

export function writeArticle(
  slug: string,
  frontmatter: Record<string, unknown>,
  content: string,
  locale: Locale = "ru",
): string {
  const dir = dirFor(locale);
  ensureDir(dir);
  const filePath = path.join(dir, `${slug}.md`);
  const data = {
    ...frontmatter,
    date: frontmatter.date || new Date().toISOString(),
  };
  const file = matter.stringify(content, data);
  fs.writeFileSync(filePath, file, "utf8");
  return filePath;
}

export function deleteArticle(slug: string, locale: Locale = "ru"): boolean {
  const filePath = articlePath(slug, locale);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    return true;
  }
  return false;
}

export function articleExists(slug: string, locale: Locale = "ru"): boolean {
  return fs.existsSync(articlePath(slug, locale));
}
