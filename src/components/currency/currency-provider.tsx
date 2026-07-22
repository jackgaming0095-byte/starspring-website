"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import {
  CURRENCIES,
  CURRENCY_COOKIE,
  CURRENCY_STORAGE_KEY,
  isCurrencyCode,
  type CurrencyCode,
} from "@/lib/currency/config";
import { formatPrice, ratesNote, type FormattedPrice } from "@/lib/currency/format";
import type { RateTable } from "@/lib/currency/rates";
import type { CurrencySource } from "@/lib/currency/server";

type CurrencyContextValue = {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  /** Currencies we actually hold a live rate for, in a stable order. */
  available: CurrencyCode[];
  format: (amountGbp: number) => FormattedPrice;
  note: string;
  degraded: boolean;
};

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

function persist(code: CurrencyCode) {
  // Cookie is authoritative: it lets the server render the right price on the
  // next request, which is what prevents a flash of the wrong currency.
  document.cookie = `${CURRENCY_COOKIE}=${code}; path=/; max-age=31536000; samesite=lax`;
  try {
    window.localStorage.setItem(CURRENCY_STORAGE_KEY, code);
  } catch {
    // Private browsing or blocked storage. The cookie still carries the choice.
  }
}

export function CurrencyProvider({
  initialCurrency,
  initialSource,
  table,
  children,
}: {
  initialCurrency: CurrencyCode;
  initialSource: CurrencySource;
  table: RateTable;
  children: React.ReactNode;
}) {
  const [currency, setCurrencyState] = useState<CurrencyCode>(initialCurrency);

  useEffect(() => {
    // Restore a saved choice only when the server had none to work from, so a
    // stale localStorage value can never override a fresh explicit selection.
    if (initialSource === "manual") return;
    let saved: string | null = null;
    try {
      saved = window.localStorage.getItem(CURRENCY_STORAGE_KEY);
    } catch {
      return;
    }
    if (!isCurrencyCode(saved) || saved === initialCurrency) return;
    if (!table.rates[saved]) return;
    setCurrencyState(saved);
    persist(saved);
  }, [initialCurrency, initialSource, table]);

  const setCurrency = useCallback((code: CurrencyCode) => {
    setCurrencyState(code);
    persist(code);
  }, []);

  const value = useMemo<CurrencyContextValue>(() => {
    const available = (Object.keys(CURRENCIES) as CurrencyCode[]).filter(
      (code) => typeof table.rates[code] === "number",
    );
    return {
      currency,
      setCurrency,
      available,
      format: (amountGbp: number) => formatPrice(amountGbp, currency, table),
      note: ratesNote(table),
      degraded: table.degraded,
    };
  }, [currency, setCurrency, table]);

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

/**
 * GBP-only fallback for surfaces rendered outside a provider, such as the
 * header on a legal page. Those routes show no prices, so they stay statically
 * rendered rather than being forced dynamic just to resolve a currency.
 * `CurrencySelect` renders nothing when only one currency is available.
 */
const GBP_FALLBACK: CurrencyContextValue = {
  currency: "GBP",
  setCurrency: () => {},
  available: ["GBP"],
  format: (amountGbp: number) => ({
    text: `£${amountGbp}`,
    currency: "GBP",
    isApproximate: false,
  }),
  note: "",
  degraded: true,
};

export function useCurrency(): CurrencyContextValue {
  return useContext(CurrencyContext) ?? GBP_FALLBACK;
}
