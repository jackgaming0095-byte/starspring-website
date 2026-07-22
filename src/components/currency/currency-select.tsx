"use client";

import { ChevronDown } from "lucide-react";
import { useId } from "react";

import { CURRENCIES, isCurrencyCode } from "@/lib/currency/config";

import { useCurrency } from "./currency-provider";

/**
 * Manual currency override.
 *
 * A native <select> on purpose: it is keyboard and screen-reader correct for
 * free, renders as the platform picker on mobile, cannot be clipped by an
 * overflow container, and ships no popover JavaScript.
 */
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
  const { currency, setCurrency, available } = useCurrency();

  // With no live rates there is nothing to choose between, so the control is
  // hidden rather than shown as a dead dropdown with one option.
  if (available.length < 2) return null;

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
          onChange={(event) => {
            const next = event.target.value;
            if (isCurrencyCode(next)) setCurrency(next);
          }}
          className="
            appearance-none rounded-sm border border-line-strong bg-surface
            py-2 pl-3 pr-9 text-sm font-medium text-ink
            transition-colors duration-150 ease-out
            hover:border-accent/40 focus-visible:border-accent
          "
        >
          {available.map((code) => (
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
