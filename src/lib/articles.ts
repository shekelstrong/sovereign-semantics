import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import slugify from "slugify";
import type { Article, ArticleTag } from "./articles-types";

export type { Article, ArticleTag } from "./articles-types";
export { getTagLabel, getAllTags } from "./articles-types";

const ARTICLES_DIR = path.join(process.cwd(), "content", "articles");

function readingTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

function ensureArticlesDir(): void {
  if (!fs.existsSync(ARTICLES_DIR)) {
    fs.mkdirSync(ARTICLES_DIR, { recursive: true });
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

export function slugifyTitle(title: string): string {
  return slugify(title, { lower: true, strict: true, locale: "ru" });
}

export async function getAllArticles(opts: {
  includeDrafts?: boolean;
} = {}): Promise<Article[]> {
  ensureArticlesDir();

  const files = fs
    .readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"));

  const articles: Article[] = files
    .map((file) => parseArticleFile(file))
    .filter((a): a is Article => a !== null)
    .filter((a) => opts.includeDrafts || !a.draft)
    .sort((a, b) => (a.date > b.date ? -1 : 1));

  return articles;
}

export async function getArticleBySlug(
  slug: string,
): Promise<Article | null> {
  ensureArticlesDir();
  const filePath = path.join(ARTICLES_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  return parseArticleFile(`${slug}.md`);
}

function parseArticleFile(filename: string): Article | null {
  const filePath = path.join(ARTICLES_DIR, filename);
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(raw);
    validateFrontmatter(data);

    const slug = filename.replace(/\.mdx?$/, "");
    const html = marked.parse(content, { async: false }) as string;

    return {
      slug,
      title: data.title as string,
      description: data.description as string,
      date: new Date(data.date as string).toISOString(),
      updated: data.updated
        ? new Date(data.updated as string).toISOString()
        : undefined,
      tags: (data.tags as ArticleTag[]) || [],
      cover: data.cover as string | undefined,
      coverPrompt: data.coverPrompt as string | undefined,
      readingTime: readingTime(content),
      content,
      html,
      draft: (data.draft as boolean) || false,
      author: (data.author as string) || "Редакция",
      cta: data.cta as Article["cta"],
      related: data.related as string[] | undefined,
    };
  } catch (err) {
    console.error(`[articles] Failed to parse ${filename}:`, err);
    return null;
  }
}

export async function getArticlesByTag(
  tag: ArticleTag,
): Promise<Article[]> {
  const all = await getAllArticles();
  return all.filter((a) => a.tags.includes(tag));
}

export async function getLatestArticles(n: number): Promise<Article[]> {
  const all = await getAllArticles();
  return all.slice(0, n);
}

export function articlePath(slug: string): string {
  return path.join(ARTICLES_DIR, `${slug}.md`);
}

export function writeArticle(
  slug: string,
  frontmatter: Record<string, unknown>,
  content: string,
): string {
  ensureArticlesDir();
  const filePath = articlePath(slug);
  const data = { ...frontmatter, date: frontmatter.date || new Date().toISOString() };
  const file = matter.stringify(content, data);
  fs.writeFileSync(filePath, file, "utf8");
  return filePath;
}

export function deleteArticle(slug: string): boolean {
  const filePath = articlePath(slug);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    return true;
  }
  return false;
}

export function articleExists(slug: string): boolean {
  return fs.existsSync(articlePath(slug));
}
