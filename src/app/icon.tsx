import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Архитектура суверенных смыслов";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

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
          color: "#10b981",
          fontFamily: "monospace",
          fontSize: 20,
          fontWeight: 700,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 4,
            border: "2px solid #10b981",
            transform: "rotate(45deg)",
            display: "flex",
          }}
        />
        <span style={{ position: "relative" }}>А</span>
      </div>
    ),
    { ...size },
  );
}
