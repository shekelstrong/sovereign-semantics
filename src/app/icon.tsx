import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/**
 * Адаптивный favicon: emerald-ромб с символом "А" в центре.
 * Видно на светлой и тёмной вкладке браузера.
 */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#050608",
          fontFamily: "monospace",
          position: "relative",
        }}
      >
        {/* Ромб-рамка */}
        <div
          style={{
            position: "absolute",
            inset: 2,
            border: "2.5px solid #10b981",
            transform: "rotate(45deg)",
            display: "flex",
          }}
        />
        {/* Буква А по центру */}
        <span
          style={{
            color: "#10b981",
            fontSize: 16,
            fontWeight: 700,
            letterSpacing: -0.5,
            position: "relative",
            zIndex: 1,
          }}
        >
          А
        </span>
        {/* Точка-индикатор */}
        <div
          style={{
            position: "absolute",
            top: 4,
            right: 4,
            width: 4,
            height: 4,
            background: "#10b981",
            borderRadius: 9999,
            display: "flex",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
