import type { Article } from "@/lib/articles-types";

interface ArticleJsonLdProps {
  article: Article;
  locale: "ru" | "en";
}

/**
 * Генерирует JSON-LD для статьи по schema.org/Article.
 * Используется Google для Rich Results + LLM-краулерами для RAG.
 *
 * Содержит:
 * - Article (mainEntityOfPage)
 * - Person (author, для E-E-A-T)
 * - Organization (publisher, sovereign-semantics)
 * - FAQPage (если есть faq[] в frontmatter) — отдельным блоком
 */
export function ArticleJsonLd({ article, locale }: ArticleJsonLdProps) {
  const SITE_URL =
    process.env.NEXT_PUBLIC_SITE_URL || "https://sovereign-semantics.vercel.app";
  const isEn = locale === "en";
  const url = isEn
    ? `${SITE_URL}/en/blog/${article.slug}`
    : `${SITE_URL}/blog/${article.slug}`;
  const authorName = article.authorBio?.name || article.author || (isEn ? "Editorial" : "Редакция");

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    url,
    headline: article.title,
    description: article.description,
    inLanguage: isEn ? "en-US" : "ru-RU",
    datePublished: article.date,
    dateModified: article.updated || article.date,
    author: {
      "@type": "Person",
      name: authorName,
      url: article.authorBio?.url || `${SITE_URL}/about`,
      description: article.authorBio?.description,
    },
    publisher: {
      "@type": "Organization",
      name: isEn ? "Architecture of Sovereign Meaning" : "Архитектура суверенных смыслов",
      alternateName: "АСС",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/icon`,
        width: 512,
        height: 512,
      },
    },
    image: article.cover
      ? [article.cover.startsWith("http") ? article.cover : `${SITE_URL}${article.cover}`]
      : [`${SITE_URL}/opengraph-image`],
    keywords: article.tags.join(", "),
    articleSection: article.tags[0] || "Analytics",
    wordCount: article.content?.split(/\s+/).filter(Boolean).length,
    timeRequired: article.readingTime ? `PT${article.readingTime}M` : undefined,
    isAccessibleForFree: true,
  };

  // Удаляем undefined поля
  const cleanArticle = JSON.parse(JSON.stringify(articleLd));

  const blocks: object[] = [cleanArticle];

  if (article.faq && article.faq.length > 0) {
    blocks.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      mainEntity: article.faq.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.a,
        },
      })),
    });
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(blocks) }}
    />
  );
}
