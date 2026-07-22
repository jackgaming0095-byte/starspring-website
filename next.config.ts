import type { NextConfig } from "next";
// Wires Cloudflare bindings (env, geo headers) into `next dev` for local parity.
// No-op in production builds. See https://opennext.js.org/cloudflare
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

/**
 * Deployed to Cloudflare Workers via @opennextjs/cloudflare (OpenNext).
 *
 * This is a full Next.js server build — NOT a static export. OpenNext runs the
 * Next server (App Router pages, the /api/audit route handler, server-side
 * currency resolution) on a single Cloudflare Worker. Security headers are sent
 * from here, as normal, because there is a real server at request time.
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // The site ships no raster images (all artwork is inline SVG/CSS), so the
  // image optimiser is unnecessary; disabling it keeps the Worker lean.
  images: { unoptimized: true },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
          },
        ],
      },
    ];
  },
};

initOpenNextCloudflareForDev();

export default nextConfig;
