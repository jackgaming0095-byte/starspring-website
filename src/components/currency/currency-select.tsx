"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useId, useState } from "react";

import {
  CURRENCIES,
  CURRENCY_CODES,
  CURRENCY_COOKIE,
  CURRENCY_STORAGE_KEY,
  isCurrencyCode,
  type CurrencyCode,
} from "@/lib/currency/config";

/**
 * Manual currency override.
 *
 * There is no React state driving prices: every price is already in the static
 * HTML, and CSS shows exactly one currency based on the `data-currency`
 * attribute on <html>. This control's only job is to change that attribute and
 * remember the choice, so switching is instant and never re-renders the page.
 *
 * A native <select> on purpose: keyboard- and screen-reader-correct for free,
 * renders as the platform picker on mobile, cannot be clipped by an overflow
 * container, and ships no popover JavaScript.
 */
function persist(code: CurrencyCode) {
  // Cookie is read by the Cloudflare edge and the pre-paint script on the next
  // visit; localStorage is the resilient mirror. Neither holds personal data.
  document.cookie = `${CURRENCY_COOKIE}=${code}; path=/; max-age=31536000; samesite=lax`;
  try {
    window.localStorage.setItem(CURRENCY_STORAGE_KEY, code);
  } catch {
    // Private browsing or blocked storage — the cookie still carries the choice.
  }
}

export function CurrencySelect({
  className = "",
  labelText = "Currency",
  compact = false,
}: {
  className?: string;
  labelText?: string;
  compact?: boolean;
}) {
  const id = useId();
  // Start at GBP to match the server-rendered default, then sync to whatever
  // the pre-paint script resolved (geo or a saved choice) after mount. This
  // keeps the control's value honest without causing a hydration mismatch.
  const [currency, setCurrency] = useState<CurrencyCode>("GBP");

  useEffect(() => {
    const resolved = document.documentElement.getAttribute("data-currency");
    if (isCurrencyCode(resolved)) setCurrency(resolved);
  }, []);

  function choose(next: string) {
    if (!isCurrencyCode(next)) return;
    setCurrency(next);
    document.documentElement.setAttribute("data-currency", next);
    persist(next);
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <label
        htmlFor={id}
        className={compact ? "sr-only" : "text-sm text-ink-muted whitespace-nowrap"}
      >
        {labelText}
      </label>
      <div className="relative">
        <select
          id={id}
          value={currency}
          onChange={(event) => choose(event.target.value)}
          className="
            appearance-none rounded-sm border border-line-strong bg-surface
            py-2 pl-3 pr-9 text-sm font-medium text-ink
            transition-colors duration-150 ease-out
            hover:border-accent/40 focus-visible:border-accent
          "
        >
          {CURRENCY_CODES.map((code) => (
            <option key={code} value={code} className="bg-bg text-ink">
              {code} {CURRENCIES[code].symbol.trim()}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-ink-subtle"
        />
      </div>
    </div>
  );
}
