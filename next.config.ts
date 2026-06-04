import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Сайт должен индексироваться поисковиками и LLM-краулерами
  poweredByHeader: false,
  reactStrictMode: true,
  compress: true,
  // Production optimizations
  productionBrowserSourceMaps: false,
  // Без output: "standalone" — это для Docker self-host, Vercel сам управляет
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "**.unsplash.com" },
      { protocol: "https", hostname: "**.openai.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  // Markdown через marked — async-safe, не блокирует event loop
  experimental: {
    optimizePackageImports: ["lucide-react", "marked"],
  },
  // Security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      {
        source: "/api/(.*)",
        headers: [
          { key: "Cache-Control", value: "no-store, max-age=0" },
        ],
      },
      {
        source: "/_next/static/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
