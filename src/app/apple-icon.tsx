import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/**
 * Apple touch icon (180x180): то же лого, но крупнее и с padding под iOS rounded mask.
 */
export default function AppleIcon() {
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
        }}
      >
        <svg
          viewBox="0 0 100 100"
          width="150"
          height="150"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polygon
            points="50,6 90,28 90,72 50,94 10,72 10,28"
            fill="none"
            stroke="#10b981"
            strokeWidth="5"
            strokeLinejoin="round"
          />
          <path
            d="M 30 50 C 30 35, 45 35, 50 50 C 55 65, 70 65, 70 50 C 70 35, 55 35, 50 50 C 45 65, 30 65, 30 50 Z"
            fill="none"
            stroke="#10b981"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
      </div>
    ),
    { ...size },
  );
}
