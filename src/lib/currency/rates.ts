import { BASE_CURRENCY, CURRENCY_CODES, type CurrencyCode } from "./config";

/**
 * Exchange-rate retrieval, abstracted behind a provider.
 *
 * Rates are never hard-coded. When every provider fails the site degrades to
 * GBP only rather than showing a stale or invented conversion.
 */

export type RateTable = {
  base: typeof BASE_CURRENCY;
  /** Units of the target currency per 1 GBP. Always contains GBP: 1. */
  rates: Partial<Record<CurrencyCode, number>>;
  /** ISO date the upstream published these rates, or null when unknown. */
  asOf: string | null;
  /** True when no live rate could be retrieved and only GBP is available. */
  degraded: boolean;
};

export type RatesProvider = {
  name: string;
  fetchRates(): Promise<Omit<RateTable, "degraded"> | null>;
};

const TWELVE_HOURS_SECONDS = 43_200;

function sanitise(
  raw: Record<string, unknown> | undefined,
  asOf: string | null,
): Omit<RateTable, "degraded"> | null {
  if (!raw) return null;
  const rates: Partial<Record<CurrencyCode, number>> = { GBP: 1 };
  for (const code of CURRENCY_CODES) {
    if (code === BASE_CURRENCY) continue;
    const value = raw[code];
    // Reject anything non-finite or absurd rather than rendering a bad price.
    if (typeof value === "number" && Number.isFinite(value) && value > 0 && value < 100_000) {
      rates[code] = value;
    }
  }
  return Object.keys(rates).length > 1 ? { base: BASE_CURRENCY, rates, asOf } : null;
}

/** Keyless default. Open Exchange Rates API community endpoint, covers AED and INR. */
const openErApiProvider: RatesProvider = {
  name: "open.er-api.com",
  async fetchRates() {
    const res = await fetch(`https://open.er-api.com/v6/latest/${BASE_CURRENCY}`, {
      next: { revalidate: TWELVE_HOURS_SECONDS },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as {
      result?: string;
      rates?: Record<string, unknown>;
      time_last_update_utc?: string;
    };
    if (json.result !== "success") return null;
    const asOf = json.time_last_update_utc
      ? new Date(json.time_last_update_utc).toISOString().slice(0, 10)
      : null;
    return sanitise(json.rates, asOf);
  },
};

/**
 * Used when EXCHANGE_RATE_API_KEY is set. The key is read server-side only and
 * is never sent to the browser.
 */
const keyedExchangeRateProvider: RatesProvider = {
  name: "v6.exchangerate-api.com",
  async fetchRates() {
    const key = process.env.EXCHANGE_RATE_API_KEY;
    if (!key) return null;
    const res = await fetch(
      `https://v6.exchangerate-api.com/v6/${key}/latest/${BASE_CURRENCY}`,
      { next: { revalidate: TWELVE_HOURS_SECONDS } },
    );
    if (!res.ok) return null;
    const json = (await res.json()) as {
      result?: string;
      conversion_rates?: Record<string, unknown>;
      time_last_update_utc?: string;
    };
    if (json.result !== "success") return null;
    const asOf = json.time_last_update_utc
      ? new Date(json.time_last_update_utc).toISOString().slice(0, 10)
      : null;
    return sanitise(json.conversion_rates, asOf);
  },
};

export const GBP_ONLY: RateTable = {
  base: BASE_CURRENCY,
  rates: { GBP: 1 },
  asOf: null,
  degraded: true,
};

function getProviders(): RatesProvider[] {
  return process.env.EXCHANGE_RATE_API_KEY
    ? [keyedExchangeRateProvider, openErApiProvider]
    : [openErApiProvider];
}

/**
 * Second-layer in-process cache. Next's fetch cache already dedupes upstream
 * calls; this exists so a transient upstream failure serves the last good
 * table instead of collapsing the whole pricing section to GBP.
 */
let lastGood: { table: RateTable; expiresAt: number } | null = null;
const MEMO_TTL_MS = TWELVE_HOURS_SECONDS * 1000;

export async function getRates(): Promise<RateTable> {
  if (lastGood && lastGood.expiresAt > Date.now()) return lastGood.table;

  for (const provider of getProviders()) {
    try {
      const fresh = await provider.fetchRates();
      if (fresh) {
        const table: RateTable = { ...fresh, degraded: false };
        lastGood = { table, expiresAt: Date.now() + MEMO_TTL_MS };
        return table;
      }
    } catch {
      // Try the next provider; a failed lookup must never break the page.
    }
  }

  // Serve the last known-good table rather than dropping to GBP mid-session.
  if (lastGood) return lastGood.table;
  return GBP_ONLY;
}
