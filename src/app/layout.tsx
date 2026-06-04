import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@/components/Analytics";
import { VercelAnalytics } from "@/components/VercelAnalytics";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Providers } from "@/components/Providers";
import { LangHtml } from "@/components/LangHtml";
import { BreadcrumbsJsonLd } from "@/components/BreadcrumbsJsonLd";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-inter",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  variable: "--font-jetbrains-mono",
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://sovereign-semantics.ru";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Архитектура суверенных смыслов — аналитика, IT, ИИ",
    template: "%s · Архитектура суверенных смыслов",
  },
  description:
    "Аналитический блог о технологическом суверенитете России, IT, искусственном интеллекте, экономике и трезвом мышлении. Лонгриды без воды и клише.",
  keywords: [
    "технологический суверенитет",
    "IT Россия",
    "искусственный интеллект",
    "архитектура смыслов",
    "трезвое мышление",
    "ЗОЖ когнитивная эффективность",
    "российская аналитика",
  ],
  authors: [{ name: "Редакция АСС", url: "https://t.me/suveren_media" }],
  creator: "Архитектура суверенных смыслов",
  publisher: "Архитектура суверенных смыслов",
  applicationName: "АСС",
  referrer: "strict-origin-when-cross-origin",
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
  alternates: {
    canonical: "/",
    languages: {
      ru: "/",
      en: "/en",
    },
    types: {
      "application/rss+xml": [
        { url: "/feed.xml", title: "АСС · ru" },
        { url: "/en/feed.xml", title: "АСС · en" },
      ],
    },
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    alternateLocale: "en_US",
    url: SITE_URL,
    siteName: "Архитектура суверенных смыслов",
    title: "Архитектура суверенных смыслов — аналитика, IT, ИИ",
    description:
      "Аналитический блог о технологическом суверенитете, IT, ИИ и трезвом мышлении. Без воды, с фактами.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Архитектура суверенных смыслов",
    description: "Аналитика · IT · ИИ. Трезво и по делу.",
    creator: "@suveren_media",
  },
  icons: {
    icon: "/icon",
    shortcut: "/favicon.ico",
    apple: "/icon",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#050608" },
    { media: "(prefers-color-scheme: light)", color: "#f6f7f9" },
  ],
  colorScheme: "dark light",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

// === JSON-LD: Organization + WebSite ===
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Архитектура суверенных смыслов",
      alternateName: "Architecture of Sovereign Meaning",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/icon`,
      },
      sameAs: [
        "https://t.me/suveren_media",
        "https://github.com/shekelstrong",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "Editorial",
        email: "vasileneopekin@yandex.ru",
        url: "https://t.me/suveren_media",
        availableLanguage: ["Russian", "English"],
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Архитектура суверенных смыслов",
      alternateName: "Architecture of Sovereign Meaning",
      inLanguage: ["ru-RU", "en-US"],
      publisher: { "@id": `${SITE_URL}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: `${SITE_URL}/blog?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ru"
      data-theme="dark"
      className={`${inter.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <BreadcrumbsJsonLd />
        <LangHtml />
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
        <Analytics />
        <VercelAnalytics />
      </body>
    </html>
  );
}
