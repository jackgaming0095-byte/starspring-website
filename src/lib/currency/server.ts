// Server-only by construction: `next/headers` throws if imported into a
// Client Component, so no extra `server-only` dependency is needed.
import { cookies, headers } from "next/headers";

import {
  BASE_CURRENCY,
  CURRENCY_COOKIE,
  currencyForCountry,
  isCurrencyCode,
  type CurrencyCode,
} from "./config";
import { getGeoProvider } from "./geo";
import { getRates, type RateTable } from "./rates";

export type CurrencySource = "manual" | "geo" | "default";

export type PricingContext = {
  currency: CurrencyCode;
  source: CurrencySource;
  table: RateTable;
};

/**
 * Resolves the currency to render on the server so the first paint is already
 * correct. Precedence: explicit user choice, then coarse geo, then GBP.
 *
 * Resolving this server-side is what keeps the price from flickering during
 * hydration. It also means the page opts out of static generation, which is
 * the intended trade for per-visitor pricing.
 */
export async function getPricingContext(): Promise<PricingContext> {
  const [cookieStore, headerList, table] = await Promise.all([
    cookies(),
    headers(),
    getRates(),
  ]);

  const manual = cookieStore.get(CURRENCY_COOKIE)?.value;
  const requested: { code: CurrencyCode; source: CurrencySource } = (() => {
    if (isCurrencyCode(manual)) return { code: manual, source: "manual" as const };

    const country = getGeoProvider().detectCountry(headerList);
    const detected = currencyForCountry(country);
    if (detected) return { code: detected, source: "geo" as const };

    return { code: BASE_CURRENCY, source: "default" as const };
  })();

  // Only offer a currency we actually hold a rate for.
  const currency = table.rates[requested.code] ? requested.code : BASE_CURRENCY;

  return {
    currency,
    source: currency === requested.code ? requested.source : "default",
    table,
  };
}
