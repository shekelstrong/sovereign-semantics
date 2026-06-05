import type { MetadataRoute } from "next";
import { getAllArticles } from "@/lib/articles";
import { routes } from "@/lib/routes";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://sovereign-semantics.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [ruArticles, enArticles] = await Promise.all([
    getAllArticles({ locale: "ru" }),
    getAllArticles({ locale: "en" }),
  ]);

  // Статические страницы для обеих локалей
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}${routes.home("ru")}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
      alternates: {
        languages: {
          ru: `${SITE_URL}/`,
          en: `${SITE_URL}/en`,
        },
      },
    },
    {
      url: `${SITE_URL}${routes.home("en")}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
      alternates: {
        languages: {
          ru: `${SITE_URL}/`,
          en: `${SITE_URL}/en`,
        },
      },
    },
    {
      url: `${SITE_URL}${routes.blog("ru")}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
      alternates: {
        languages: {
          ru: `${SITE_URL}/blog`,
          en: `${SITE_URL}/en/blog`,
        },
      },
    },
    {
      url: `${SITE_URL}${routes.blog("en")}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
      alternates: {
        languages: {
          ru: `${SITE_URL}/blog`,
          en: `${SITE_URL}/en/blog`,
        },
      },
    },
    {
      url: `${SITE_URL}${routes.manifesto("ru")}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: {
        languages: {
          ru: `${SITE_URL}/manifesto`,
          en: `${SITE_URL}/en/manifesto`,
        },
      },
    },
    {
      url: `${SITE_URL}${routes.manifesto("en")}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: {
        languages: {
          ru: `${SITE_URL}/manifesto`,
          en: `${SITE_URL}/en/manifesto`,
        },
      },
    },
    {
      url: `${SITE_URL}${routes.contact("ru")}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
      alternates: {
        languages: {
          ru: `${SITE_URL}/contact`,
          en: `${SITE_URL}/en/contact`,
        },
      },
    },
    {
      url: `${SITE_URL}${routes.contact("en")}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
      alternates: {
        languages: {
          ru: `${SITE_URL}/contact`,
          en: `${SITE_URL}/en/contact`,
        },
      },
    },
  ];

  // Статьи обеих локалей + hreflang
  const articlePages: MetadataRoute.Sitemap = [];
  for (const article of ruArticles) {
    const enVersion = enArticles.find(
      (e) => e.slug === article.slug || e.slug.startsWith(article.slug),
    );
    articlePages.push({
      url: `${SITE_URL}${routes.blogPost(article.slug, "ru")}`,
      lastModified: new Date(article.updated || article.date),
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: {
        languages: {
          ru: `${SITE_URL}/blog/${article.slug}`,
          en: `${SITE_URL}/en/blog/${enVersion?.slug || article.slug}`,
        },
      },
    });
  }
  for (const article of enArticles) {
    if (ruArticles.some((r) => r.slug === article.slug)) continue; // already added
    articlePages.push({
      url: `${SITE_URL}${routes.blogPost(article.slug, "en")}`,
      lastModified: new Date(article.updated || article.date),
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: {
        languages: {
          ru: `${SITE_URL}/blog/${article.slug}`,
          en: `${SITE_URL}/en/blog/${article.slug}`,
        },
      },
    });
  }

  return [...staticPages, ...articlePages];
}
