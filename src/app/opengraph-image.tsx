import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Архитектура суверенных смыслов";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          background:
            "linear-gradient(135deg, #050608 0%, #0a0d12 50%, #050608 100%)",
          color: "#e6edf3",
          padding: 60,
          fontFamily: "monospace",
          position: "relative",
        }}
      >
        {/* Grid pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(16, 185, 129, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.08) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            display: "flex",
          }}
        />

        {/* Glow */}
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "20%",
            width: 600,
            height: 600,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 60%)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "10%",
            right: "10%",
            width: 500,
            height: 500,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, transparent 60%)",
            display: "flex",
          }}
        />

        {/* Top bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 14,
            color: "#5a6473",
            textTransform: "uppercase",
            letterSpacing: 4,
            position: "relative",
            zIndex: 1,
          }}
        >
          <span>v1.0 · 2026</span>
          <span style={{ color: "#10b981" }}>● ONLINE</span>
        </div>

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flex: 1,
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              fontSize: 20,
              color: "#10b981",
              textTransform: "uppercase",
              letterSpacing: 6,
              marginBottom: 24,
              display: "flex",
            }}
          >
            ↓ Аналитика · IT · ИИ
          </div>
          <div
            style={{
              fontSize: 88,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: -2,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>АРХИТЕКТУРА</span>
            <span style={{ color: "#10b981" }}>СУВЕРЕННЫХ</span>
            <span>СМЫСЛОВ</span>
          </div>
          <div
            style={{
              fontSize: 22,
              color: "#8b95a3",
              marginTop: 32,
              maxWidth: 800,
              display: "flex",
            }}
          >
            Трезвый ум · Ясный код · Технологический суверенитет
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 14,
            color: "#5a6473",
            textTransform: "uppercase",
            letterSpacing: 4,
            position: "relative",
            zIndex: 1,
          }}
        >
          <span>sovereign-semantics.ru</span>
          <span>t.me/sovereign_semantics</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
