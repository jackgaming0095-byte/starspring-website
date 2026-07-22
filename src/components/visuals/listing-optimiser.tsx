"use client";

import { Check, Minus } from "lucide-react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";

import { EASE_OUT } from "@/lib/motion";

import { IllustrativeBadge } from "./illustrative-badge";

/* Illustrative profile-completeness checklist for the listing-optimisation step. */

const FIELDS = [
  { label: "Primary category", done: true },
  { label: "Secondary categories", done: true },
  { label: "Services and pricing", done: true },
  { label: "Business description", done: true },
  { label: "Opening hours and holidays", done: true },
  { label: "Photos by area", done: true },
  { label: "Accessibility attributes", done: false },
];

export function ListingOptimiser({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.4 });
  // `initial` must stay constant across server and client; reduced motion
  // is handled in `transition`, which is never serialised into the HTML.
  const ease = reduceMotion ? { duration: 0 } : null;

  const complete = FIELDS.filter((field) => field.done).length;
  const pct = Math.round((complete / FIELDS.length) * 100);

  return (
    <div ref={ref} className={`rounded-md border border-line bg-surface p-4 ${className}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-ink">Profile completeness</p>
          <p className="numeric mt-1 text-xs text-ink-subtle">
            {complete} of {FIELDS.length} areas complete
          </p>
        </div>
        <IllustrativeBadge />
      </div>

      {/* Progress rendered as a hairline, not a filled dashboard track. */}
      <div className="mt-4 h-px w-full bg-line-strong">
        <motion.div
          className="h-px origin-left bg-accent"
          data-grow=""

          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: pct / 100 } : undefined}
          transition={ease ?? { duration: 0.8, ease: EASE_OUT, delay: 0.1 }}
        />
      </div>

      <ul className="mt-4 flex flex-col gap-2.5">
        {FIELDS.map((field, index) => (
          <motion.li
            key={field.label}
            className="flex items-center gap-2.5"
            data-reveal=""

            initial={{ opacity: 0, x: -6 }}
            animate={inView ? { opacity: 1, x: 0 } : undefined}
            transition={ease ?? { duration: 0.35, ease: EASE_OUT, delay: 0.15 + index * 0.05 }}
          >
            <span
              aria-hidden="true"
              className={`
                grid size-4 shrink-0 place-items-center rounded-[4px]
                ${field.done ? "bg-accent text-accent-ink" : "border border-line-strong text-ink-subtle"}
              `}
            >
              {field.done ? <Check className="size-3" strokeWidth={3} /> : <Minus className="size-2.5" />}
            </span>
            <span className={`text-xs ${field.done ? "text-ink-muted" : "text-ink-subtle"}`}>
              {field.label}
            </span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
