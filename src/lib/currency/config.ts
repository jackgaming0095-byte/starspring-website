/**
 * Currency configuration.
 *
 * GBP is the canonical pricing currency: every invoice is issued and charged
 * in GBP. The other currencies shown on the site are FIXED, EDITABLE local
 * equivalents — not live conversions. There is no exchange-rate API call
 * anywhere in the app; a business editor sets the numbers they want to charge
 * in `PRICES` below and they never move until edited again.
 *
 * Country -> currency mapping (per the deployment brief):
 *   United Kingdom       -> GBP
 *   India                -> INR
 *   United Arab Emirates -> AED
 *   Everywhere else      -> GBP  (the safe fallback)
 */

export const BASE_CURRENCY = "GBP" as const;

/** Set by the manual selector; read by the pre-paint script in the layout. */
export const CURRENCY_COOKIE = "ss_currency";
export const CURRENCY_STORAGE_KEY = "starspring:currency";
/** Set by the Cloudflare edge middleware from `cf-ipcountry`. */
export const COUNTRY_COOKIE = "ss_country";

export type CurrencyCode = "GBP" | "INR" | "AED";

export type CurrencyMeta = {
  code: CurrencyCode;
  label: string;
  symbol: string;
};

export const CURRENCIES: Record<CurrencyCode, CurrencyMeta> = {
  GBP: { code: "GBP", label: "British pound", symbol: "£" },
  INR: { code: "INR", label: "Indian rupee", symbol: "₹" },
  AED: { code: "AED", label: "UAE dirham", symbol: "AED " },
};

export const CURRENCY_CODES = Object.keys(CURRENCIES) as CurrencyCode[];

export function isCurrencyCode(value: unknown): value is CurrencyCode {
  return typeof value === "string" && value in CURRENCIES;
}

/** ISO-3166 alpha-2 country -> display currency. Anything unmapped stays GBP. */
const COUNTRY_TO_CURRENCY: Record<string, CurrencyCode> = {
  GB: "GBP",
  IM: "GBP",
  JE: "GBP",
  GG: "GBP",
  IN: "INR",
  AE: "AED",
};

export function currencyForCountry(country: string | null | undefined): CurrencyCode {
  if (!country) return BASE_CURRENCY;
  return COUNTRY_TO_CURRENCY[country.trim().toUpperCase()] ?? BASE_CURRENCY;
}

/**
 * FIXED, EDITABLE regional prices. Keyed by plan id, then currency.
 *
 * These are approximate local equivalents of the canonical GBP amount, rounded
 * to tidy figures. They do NOT track live FX — update them by hand whenever you
 * want the displayed local price to change. GBP is what is actually billed.
 */
export type PlanId = "launch" | "growth";

export const PRICES: Record<PlanId, Record<CurrencyCode, number>> = {
  // Review Launch — £350 one-time
  launch: { GBP: 350, INR: 37000, AED: 1650 },
  // Reputation Growth — £300 per month
  growth: { GBP: 300, INR: 32000, AED: 1400 },
};

const groupFormatter = new Intl.NumberFormat("en-GB", {
  style: "decimal",
  maximumFractionDigits: 0,
  useGrouping: true,
});

/** e.g. "£350", "₹37,000", "AED 1,650". Deterministic under a fixed locale. */
export function formatPrice(amount: number, currency: CurrencyCode): string {
  return `${CURRENCIES[currency].symbol}${groupFormatter.format(amount)}`;
}
