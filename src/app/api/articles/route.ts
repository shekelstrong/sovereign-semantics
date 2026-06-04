import { NextResponse } from "next/server";
import { Octokit } from "@octokit/rest";
import { slugifyTitle } from "@/lib/articles";

/**
 * POST /api/articles
 *
 * Создание новой статьи. Используется AI-агентом или админкой.
 * Коммитит Markdown-файл в GitHub-репозиторий → Vercel auto-deploy.
 *
 * Body: ArticleDraft
 * Auth: Bearer token в Authorization header (CMS_API_TOKEN env)
 *
 * Если AI-агент хочет сгенерировать обложку, передаёт cover: true —
 * в этом случае сервер вызовет IMAGE_PROVIDER (если настроен).
 */

interface ArticleDraft {
  title: string;
  description: string;
  content: string; // Markdown
  tags?: string[];
  cover?: string | boolean; // URL или true = сгенерировать
  date?: string;
  author?: string;
  cta?: { label: string; href: string };
  related?: string[];
  draft?: boolean;
}

function getRepo() {
  const owner = process.env.GITHUB_REPO_OWNER;
  const repo = process.env.GITHUB_REPO_NAME;
  if (!owner || !repo) {
    throw new Error(
      "GITHUB_REPO_OWNER / GITHUB_REPO_NAME env not set. " +
        "Configure in Vercel project settings.",
    );
  }
  return { owner, repo };
}

function checkAuth(req: Request): boolean {
  const token = process.env.CMS_API_TOKEN;
  if (!token) return true; // dev mode — allow if not configured
  const auth = req.headers.get("authorization") || "";
  return auth === `Bearer ${token}`;
}

async function generateCoverIfRequested(
  prompt: string,
  title: string,
): Promise<string | null> {
  const provider = process.env.IMAGE_PROVIDER; // 'openai' | 'replicate' | 'fal' | ''
  if (!provider) return null;

  if (provider === "openai" && process.env.OPENAI_API_KEY) {
    const r = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt,
        size: "1792x1024",
        quality: "hd",
        n: 1,
      }),
    });
    if (!r.ok) {
      console.error("[cover] OpenAI error:", await r.text());
      return null;
    }
    const j = await r.json();
    return j.data?.[0]?.url || null;
  }

  console.warn(`[cover] Provider ${provider} not implemented, skipping`);
  return null;
}

export async function POST(req: Request) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: ArticleDraft;
  try {
    body = (await req.json()) as ArticleDraft;
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  if (!body.title || !body.content || !body.description) {
    return NextResponse.json(
      { error: "title, description, content are required" },
      { status: 400 },
    );
  }

  const slug = slugifyTitle(body.title);
  const date = body.date || new Date().toISOString().slice(0, 10);

  // Optional: generate cover
  let coverUrl: string | null = null;
  if (body.cover === true) {
    const prompt =
      `Cinematic hyperrealistic dark-mode cover for an analytical article titled "${body.title}". ` +
      `Abstract architectural visualization, glowing data structures, emerald and cold blue neon accents, ` +
      `8k, no text, no letters, conceptual tech art.`;
    coverUrl = await generateCoverIfRequested(prompt, body.title);
  } else if (typeof body.cover === "string") {
    coverUrl = body.cover;
  }

  // Build frontmatter
  const frontmatter: Record<string, unknown> = {
    title: body.title,
    description: body.description,
    date,
    tags: body.tags || [],
    author: body.author || "Редакция АСС",
    draft: body.draft ?? false,
  };
  if (coverUrl) frontmatter.cover = coverUrl;
  if (body.cta) frontmatter.cta = body.cta;
  if (body.related) frontmatter.related = body.related;

  // Serialize as Markdown with frontmatter
  const yaml = Object.entries(frontmatter)
    .map(([k, v]) => {
      if (Array.isArray(v)) {
        return `${k}:\n${v.map((x) => `  - ${JSON.stringify(x)}`).join("\n")}`;
      }
      if (typeof v === "object" && v !== null) {
        return `${k}:\n${Object.entries(v as Record<string, string>)
          .map(([kk, vv]) => `  ${kk}: ${JSON.stringify(vv)}`)
          .join("\n")}`;
      }
      return `${k}: ${JSON.stringify(v)}`;
    })
    .join("\n");

  const fileContent = `---\n${yaml}\n---\n\n${body.content}\n`;
  const filePath = `content/articles/${slug}.md`;

  // Commit via GitHub API (if configured)
  if (process.env.GITHUB_TOKEN) {
    try {
      const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
      const { owner, repo } = getRepo();

      let sha: string | undefined;
      try {
        const existing = await octokit.repos.getContent({
          owner,
          repo,
          path: filePath,
        });
        if (!Array.isArray(existing.data)) {
          sha = (existing.data as { sha: string }).sha;
        }
      } catch {
        // File doesn't exist yet — OK
      }

      await octokit.repos.createOrUpdateFileContents({
        owner,
        repo,
        path: filePath,
        message: `article: ${body.title} (AI-published)${sha ? " [update]" : ""}`,
        content: Buffer.from(fileContent, "utf8").toString("base64"),
        sha,
        branch: process.env.GITHUB_BRANCH || "main",
      });

      return NextResponse.json({
        ok: true,
        slug,
        url: `/blog/${slug}`,
        github: `${process.env.GITHUB_REPO_OWNER}/${process.env.GITHUB_REPO_NAME}/blob/main/${filePath}`,
        cover: coverUrl,
        message: "Article committed to GitHub. Vercel will deploy shortly.",
      });
    } catch (err) {
      console.error("[api/articles] GitHub commit error:", err);
      return NextResponse.json(
        {
          error: "GitHub commit failed",
          details: err instanceof Error ? err.message : String(err),
        },
        { status: 500 },
      );
    }
  }

  // Fallback: dev mode — return generated file content for inspection
  return NextResponse.json({
    ok: true,
    slug,
    url: `/blog/${slug}`,
    dev: true,
    fileContent,
    message:
      "DEV MODE: GITHUB_TOKEN not set. File not committed. " +
      "Set GITHUB_TOKEN + GITHUB_REPO_OWNER + GITHUB_REPO_NAME env vars to enable auto-publish.",
  });
}

export async function GET() {
  return NextResponse.json({
    endpoint: "POST /api/articles",
    description: "Create or update an article. AI-agent or admin use.",
    auth: "Bearer $CMS_API_TOKEN",
    schema: {
      title: "string (required, max 60 chars for SEO)",
      description: "string (required, max 160 chars for SEO)",
      content: "string (required, Markdown body)",
      tags: "string[] (geopolitics | it-ai | economy | lifestyle | methodology)",
      cover: "boolean (true = generate via IMAGE_PROVIDER) | string (URL)",
      date: "string (ISO date, default = today)",
      author: "string",
      cta: "{ label: string, href: string }",
      related: "string[] (slugs)",
      draft: "boolean",
    },
  });
}
