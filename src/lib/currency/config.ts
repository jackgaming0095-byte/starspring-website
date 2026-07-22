/**
 * Currency configuration.
 *
 * GBP is the canonical pricing currency. Every other currency shown on the
 * site is an APPROXIMATE equivalent converted at a recent published rate, and
 * must always be labelled as such. Invoices are issued in GBP.
 */

export const BASE_CURRENCY = "GBP" as const;

export const CURRENCY_COOKIE = "ss_currency";
export const CURRENCY_STORAGE_KEY = "starspring:currency";

export type CurrencyCode = "GBP" | "USD" | "EUR" | "INR" | "AED" | "AUD" | "CAD";

export type CurrencyMeta = {
  code: CurrencyCode;
  label: string;
  symbol: string;
  /** Rounding increment for approximate equivalents, in major units. */
  step: number;
};

export const CURRENCIES: Record<CurrencyCode, CurrencyMeta> = {
  GBP: { code: "GBP", label: "British pound", symbol: "£", step: 1 },
  USD: { code: "USD", label: "US dollar", symbol: "$", step: 5 },
  EUR: { code: "EUR", label: "Euro", symbol: "€", step: 5 },
  INR: { code: "INR", label: "Indian rupee", symbol: "₹", step: 100 },
  AED: { code: "AED", label: "UAE dirham", symbol: "AED ", step: 5 },
  AUD: { code: "AUD", label: "Australian dollar", symbol: "A$", step: 5 },
  CAD: { code: "CAD", label: "Canadian dollar", symbol: "C$", step: 5 },
};

export const CURRENCY_CODES = Object.keys(CURRENCIES) as CurrencyCode[];

export function isCurrencyCode(value: unknown): value is CurrencyCode {
  return typeof value === "string" && value in CURRENCIES;
}

const EUROZONE = [
  "AT", "BE", "HR", "CY", "EE", "FI", "FR", "DE", "GR", "IE", "IT", "LV",
  "LT", "LU", "MT", "NL", "PT", "SK", "SI", "ES",
];

/** ISO-3166 alpha-2 country -> display currency. Anything unmapped stays GBP. */
const COUNTRY_TO_CURRENCY: Record<string, CurrencyCode> = {
  GB: "GBP",
  IM: "GBP",
  JE: "GBP",
  GG: "GBP",
  IN: "INR",
  AE: "AED",
  US: "USD",
  AU: "AUD",
  NZ: "AUD",
  CA: "CAD",
  ...Object.fromEntries(EUROZONE.map((c) => [c, "EUR" as CurrencyCode])),
};

export function currencyForCountry(country: string | null): CurrencyCode | null {
  if (!country) return null;
  return COUNTRY_TO_CURRENCY[country.toUpperCase()] ?? null;
}
