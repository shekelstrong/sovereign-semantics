import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@/components/Analytics";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://sovereign-semantics.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Архитектура суверенных смыслов — Аналитика. IT. ИИ.",
    template: "%s · Архитектура суверенных смыслов",
  },
  description:
    "Аналитический блог о технологическом суверенитете, IT-решениях, искусственном интеллекте, экономике и трезвом мышлении. Лонгриды, стратегии, практика.",
  keywords: [
    "технологический суверенитет",
    "IT аналитика",
    "искусственный интеллект",
    "архитектура смыслов",
    "Россия IT",
    "макроэкономика",
    "трезвое мышление",
    "когнитивная эффективность",
    "здоровый образ жизни",
    "ЗОЖ",
  ],
  authors: [{ name: "Архитектура суверенных смыслов", url: SITE_URL }],
  creator: "Архитектура суверенных смыслов",
  publisher: "Архитектура суверенных смыслов",
  alternates: {
    canonical: "/",
    languages: {
      "ru-RU": "/",
    },
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: SITE_URL,
    siteName: "Архитектура суверенных смыслов",
    title: "Архитектура суверенных смыслов",
    description:
      "Аналитика. Технологии. Суверенитет. Трезвый ум как стратегическое преимущество.",
    images: [
      {
        url: "/og/default.png",
        width: 1200,
        height: 630,
        alt: "Архитектура суверенных смыслов",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Архитектура суверенных смыслов",
    description:
      "Аналитика. Технологии. Суверенитет. Трезвый ум как стратегическое преимущество.",
    images: ["/og/default.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: "#050608",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // JSON-LD: Organization + WebSite (для Knowledge Graph поисковиков и LLM)
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "Архитектура суверенных смыслов",
        url: SITE_URL,
        logo: `${SITE_URL}/logo.png`,
        sameAs: [
          "https://t.me/sovereign_semantics",
          "https://vk.com/sovereign_semantics",
        ],
        description:
          "Аналитический блог о технологическом суверенитете, IT, ИИ и трезвом мышлении.",
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "Архитектура суверенных смыслов",
        inLanguage: "ru-RU",
        publisher: { "@id": `${SITE_URL}/#organization` },
        potentialAction: {
          "@type": "SearchAction",
          target: `${SITE_URL}/blog?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return (
    <html
      lang="ru"
      className={`${inter.variable} ${jetbrainsMono.variable} dark`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
