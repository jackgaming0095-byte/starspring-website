import { BASE_CURRENCY, CURRENCIES, type CurrencyCode } from "./config";
import type { RateTable } from "./rates";

/**
 * Price formatting.
 *
 * Deliberately uses Intl `style: "decimal"` with an explicit symbol from our
 * own config rather than `style: "currency"`. Currency-style output depends on
 * the runtime's ICU data, which differs between Node and browsers and produces
 * hydration mismatches. Decimal grouping under a fixed locale is stable in
 * both, so the server HTML and the client render are always identical.
 */

const groupFormatter = new Intl.NumberFormat("en-GB", {
  style: "decimal",
  maximumFractionDigits: 0,
  useGrouping: true,
});

export type FormattedPrice = {
  /** e.g. "£300" or "₹33,400" */
  text: string;
  currency: CurrencyCode;
  /** True when this is a converted approximation rather than the GBP price. */
  isApproximate: boolean;
};

function roundToStep(value: number, step: number): number {
  return Math.round(value / step) * step;
}

/**
 * Converts a canonical GBP amount for display.
 * Falls back to GBP whenever the requested rate is unavailable or unusable,
 * so a failed FX lookup can never render a wrong or empty price.
 */
export function formatPrice(
  amountGbp: number,
  currency: CurrencyCode,
  table: RateTable,
): FormattedPrice {
  if (currency === BASE_CURRENCY) {
    return {
      text: `${CURRENCIES.GBP.symbol}${groupFormatter.format(amountGbp)}`,
      currency: BASE_CURRENCY,
      isApproximate: false,
    };
  }

  const rate = table.rates[currency];
  if (typeof rate !== "number" || !Number.isFinite(rate) || rate <= 0) {
    return formatPrice(amountGbp, BASE_CURRENCY, table);
  }

  const meta = CURRENCIES[currency];
  const converted = roundToStep(amountGbp * rate, meta.step);

  return {
    text: `${meta.symbol}${groupFormatter.format(converted)}`,
    currency,
    isApproximate: true,
  };
}

/** Human-readable note about when the rates were published. */
export function ratesNote(table: RateTable): string {
  if (table.degraded) {
    return "Live exchange rates are unavailable right now, so prices are shown in GBP.";
  }
  return table.asOf
    ? `Approximate local equivalent, converted at the published rate of ${table.asOf}.`
    : "Approximate local equivalent, converted at a recent published rate.";
}
