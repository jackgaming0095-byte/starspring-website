import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/site";

// Prerender robots.txt at build time rather than per request.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
