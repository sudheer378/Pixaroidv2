import { ImageResponse } from "next/og";
import { toolRegistry } from "@/core/tools/registry";

export const alt = "Pixora — free, privacy-first online tools";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 72,
              height: 72,
              borderRadius: 18,
              background: "#2563eb",
              color: "#ffffff",
              fontSize: 44,
              fontWeight: 900,
            }}
          >
            P
          </div>
          <div style={{ fontSize: 52, fontWeight: 700, color: "#ffffff" }}>Pixora</div>
        </div>

        <div
          style={{
            marginTop: 40,
            fontSize: 64,
            fontWeight: 700,
            color: "#ffffff",
            lineHeight: 1.15,
            maxWidth: 940,
          }}
        >
          Free online tools that respect your privacy.
        </div>

        <div style={{ marginTop: 28, fontSize: 30, color: "#bfdbfe", maxWidth: 900 }}>
          PDF, image, calculator, text and developer tools — everything runs in your
          browser. Nothing is ever uploaded.
        </div>

        <div style={{ marginTop: 44, display: "flex", gap: 14, fontSize: 24, color: "#e2e8f0" }}>
          <span>{toolRegistry.length} tools</span>
          <span style={{ color: "#475569" }}>·</span>
          <span>No sign-up</span>
          <span style={{ color: "#475569" }}>·</span>
          <span>No uploads</span>
        </div>
      </div>
    ),
    size,
  );
}
