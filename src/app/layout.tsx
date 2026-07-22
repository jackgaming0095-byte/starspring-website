import type { Metadata, Viewport } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { headers } from "next/headers";

import { JsonLd } from "@/components/seo/json-ld";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { currencyForCountry } from "@/lib/currency/config";
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

/*
  Pre-paint currency override. The server has already stamped the geo currency
  onto <html data-currency> (below), so this only runs to honour a SAVED MANUAL
  choice, before the browser paints, so switching persists with no flicker. If
  there is no saved choice it leaves the server's geo value untouched. No IP is
  read anywhere; the manual choice is a currency code, not location data.
*/
const CURRENCY_BOOTSTRAP = `(function(){try{var el=document.documentElement,valid={GBP:1,INR:1,AED:1},c=null;
try{c=localStorage.getItem('starspring:currency');}catch(e){}
if(!c){var m=document.cookie.match('(?:^|; )ss_currency=([^;]+)');if(m)c=decodeURIComponent(m[1]);}
if(c&&valid[c])el.setAttribute('data-currency',c);}catch(e){}})();`;

/**
 * Root layout. Resolves the visitor's currency ON THE SERVER from Cloudflare's
 * `cf-ipcountry` header (OpenNext forwards it to the Next server), so the first
 * painted price is already correct — no flicker, no client fetch. Every
 * currency's price is in the HTML; CSS shows the one matching <html
 * data-currency>. `suppressHydrationWarning` is required because the bootstrap
 * script may change that attribute (manual choice) before React hydrates.
 *
 * Reading a request header opts the tree into dynamic rendering, which is the
 * intended trade for per-visitor pricing on a server runtime.
 */
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const country = (await headers()).get("cf-ipcountry");
  const currency = currencyForCountry(country);

  return (
    <html
      lang="en-GB"
      data-currency={currency}
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body className="min-h-dvh antialiased">
        <script dangerouslySetInnerHTML={{ __html: CURRENCY_BOOTSTRAP }} />
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
