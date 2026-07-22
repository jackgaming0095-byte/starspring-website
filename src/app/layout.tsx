import type { Metadata, Viewport } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import { JsonLd } from "@/components/seo/json-ld";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { site, siteUrl } from "@/lib/site";
import { professionalServiceSchema } from "@/lib/structured-data";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: site.title,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  alternates: { canonical: "/" },
  keywords: [
    "Google review growth",
    "reputation management for local business",
    "Google Business Profile optimisation",
    "QR review cards",
    "review response management",
    "local visibility",
  ],
  openGraph: {
    type: "website",
    siteName: site.name,
    title: site.title,
    description: site.description,
    url: siteUrl,
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#0b0d09",
  colorScheme: "dark",
};

/**
 * The layout deliberately does NOT resolve currency. Reading request headers
 * here would opt every route, including the four static policy pages, out of
 * static generation. Currency is resolved in the one page that shows prices.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="min-h-dvh antialiased">
        {/* Reveals and drawn strokes must fail open. With scripting disabled,
            motion never runs, so force every animated element to its resolved
            state rather than leaving the page half blank. */}
        <noscript>
          <style>{`
            [data-reveal]{opacity:1!important;transform:none!important}
            [data-draw]{stroke-dasharray:none!important;stroke-dashoffset:0!important}
            [data-grow]{transform:none!important}
            [data-clip]{clip-path:none!important}
          `}</style>
        </noscript>
        <JsonLd data={professionalServiceSchema()} />
        <a
          href="#main"
          className="
            sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4
            focus:z-50 focus:rounded-sm focus:bg-accent focus:px-4 focus:py-2
            focus:text-sm focus:font-medium focus:text-accent-ink
          "
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
