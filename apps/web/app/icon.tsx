import { ImageResponse } from "next/og";

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
          background: "#a78bfa",
          borderRadius: "8px",
        }}
      >
        <span
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: "#ffffff",
            fontFamily: "sans-serif",
            letterSpacing: "-0.04em",
            lineHeight: 1,
          }}
        >
          S
        </span>
      </div>
    ),
    { ...size },
  );
}
