/**
 * Country detection, abstracted behind a provider so the hosting platform can
 * be swapped without touching any component.
 *
 * PRIVACY: this module reads only the coarse country code that the hosting
 * edge has already resolved. It never reads, derives, logs or stores a raw IP
 * address, and it never calls a third-party IP lookup service.
 */

export type GeoProvider = {
  name: string;
  /** Returns an ISO-3166 alpha-2 country code, or null when unknown. */
  detectCountry(headers: Headers): string | null;
};

const COUNTRY_PATTERN = /^[A-Za-z]{2}$/;

function clean(value: string | null | undefined): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!COUNTRY_PATTERN.test(trimmed) || trimmed.toUpperCase() === "XX") return null;
  return trimmed.toUpperCase();
}

/**
 * Reads the geo headers injected by the major hosting platforms. Works on
 * Vercel, Cloudflare, Netlify and AWS CloudFront without extra configuration.
 */
export const platformHeaderGeoProvider: GeoProvider = {
  name: "platform-headers",
  detectCountry(headers) {
    const direct =
      clean(headers.get("x-vercel-ip-country")) ??
      clean(headers.get("cf-ipcountry")) ??
      clean(headers.get("cloudfront-viewer-country")) ??
      clean(headers.get("x-country-code")) ??
      clean(headers.get("x-geo-country"));

    if (direct) return direct;

    // Netlify ships a base64 or JSON blob rather than a bare code.
    const netlify = headers.get("x-nf-geo");
    if (netlify) {
      try {
        const raw = netlify.trim().startsWith("{")
          ? netlify
          : Buffer.from(netlify, "base64").toString("utf8");
        const parsed = JSON.parse(raw) as { country?: { code?: string } };
        const code = clean(parsed?.country?.code);
        if (code) return code;
      } catch {
        // Malformed header is not an error condition, just unknown geo.
      }
    }

    return null;
  },
};

/** Forces a country in local development so the currency logic can be tested. */
function envOverrideProvider(country: string): GeoProvider {
  return {
    name: "env-override",
    detectCountry: () => clean(country),
  };
}

export function getGeoProvider(): GeoProvider {
  const forced = process.env.GEO_COUNTRY_OVERRIDE;
  if (forced) return envOverrideProvider(forced);
  return platformHeaderGeoProvider;
}
