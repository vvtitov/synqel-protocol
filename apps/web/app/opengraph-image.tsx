import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          background: "#09090b",
          padding: "72px 80px",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* top-right glow blob */}
        <div
          style={{
            position: "absolute",
            top: "-80px",
            right: "-80px",
            width: "480px",
            height: "480px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(167,139,250,0.22) 0%, transparent 65%)",
          }}
        />
        {/* bottom-left glow blob */}
        <div
          style={{
            position: "absolute",
            bottom: "-60px",
            left: "-60px",
            width: "360px",
            height: "360px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 65%)",
          }}
        />

        {/* badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            border: "1px solid #27272a",
            borderRadius: "100px",
            padding: "8px 20px",
            marginBottom: "36px",
            background: "rgba(24,24,27,0.8)",
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "#4ade80",
            }}
          />
          <span
            style={{
              color: "#a1a1aa",
              fontSize: 16,
              fontWeight: 600,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
            }}
          >
            ARIA for AI agents · Open standard
          </span>
        </div>

        {/* title */}
        <div
          style={{
            display: "flex",
            fontSize: 80,
            fontWeight: 800,
            lineHeight: 1.0,
            letterSpacing: "-0.035em",
            marginBottom: "24px",
          }}
        >
          <span style={{ color: "#fafafa" }}>Synqel</span>
          <span style={{ color: "#a78bfa" }}>Protocol</span>
        </div>

        {/* description */}
        <div
          style={{
            fontSize: 28,
            color: "#a1a1aa",
            maxWidth: "720px",
            lineHeight: 1.45,
            marginBottom: "52px",
            fontWeight: 400,
          }}
        >
          The open standard for AI-navigable web applications.
        </div>

        {/* pills */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {["MIT license", "Zero deps (Zod only)", "@synqel/sdk on npm"].map(
            (label) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "10px 18px",
                  background: "#18181b",
                  borderRadius: "12px",
                  border: "1px solid #27272a",
                  color: "#71717a",
                  fontSize: 15,
                  fontWeight: 500,
                }}
              >
                {label}
              </div>
            ),
          )}
        </div>
      </div>
    ),
    { ...size },
  );
}
