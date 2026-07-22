import { ImageResponse } from "next/og";

import { site } from "@/lib/site";

export const alt = `${site.name} ${site.descriptor}. ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/*
  Social card. Rendered with the built-in system font stack rather than a
  fetched webfont so the route has no network dependency and cannot fail at
  request time. Colours mirror the site tokens.
*/
const headlineStyle = {
  color: "#f6f4ef",
  fontSize: 68,
  fontWeight: 600,
  lineHeight: 1.1,
  letterSpacing: -2.2,
} as const;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0b0d09",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <svg width="52" height="52" viewBox="0 0 32 32">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              fill="#beea3b"
              d="M9 2.5H23A7 7 0 0 1 30 9.5V19A7 7 0 0 1 23 26H16.4L10.5 30.6C9.9 31.1 9 30.7 9 29.9V26A7 7 0 0 1 2 19V9.5A7 7 0 0 1 9 2.5ZM16 5C16 14 17.5 15.5 23 15.5C17.5 15.5 16 17 16 22.5C16 17 14.5 15.5 9 15.5C14.5 15.5 16 14 16 5Z"
            />
          </svg>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ color: "#f6f4ef", fontSize: 34, fontWeight: 600, letterSpacing: -0.8 }}>
              {site.name}
            </span>
            <span style={{ color: "#939189", fontSize: 17, letterSpacing: 2.4 }}>
              REPUTATION GROWTH
            </span>
          </div>
        </div>

        {/*
          Satori does not reflow nested inline spans the way a browser does, so
          the headline is laid out as explicit lines rather than one wrapping
          string. Keep it that way, and re-check the rendered PNG after any
          copy change.
        */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", flexDirection: "column", ...headlineStyle }}>
            <span>Turn more happy customers</span>
            <span style={{ display: "flex" }}>
              <span>into&nbsp;</span>
              <span style={{ color: "#beea3b" }}>Google reviews.</span>
            </span>
          </div>
          <span style={{ color: "#bcbab3", fontSize: 27, marginTop: 26 }}>{site.tagline}</span>
        </div>

        <div style={{ display: "flex", gap: 34 }}>
          {["Real customers only", "No fake reviews", "Cancel anytime"].map((item) => (
            <span key={item} style={{ color: "#939189", fontSize: 21 }}>
              {item}
            </span>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
