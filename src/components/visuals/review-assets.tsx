"use client";

import { Copy, Link2, MonitorSmartphone, Printer, Star } from "lucide-react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";

import { EASE_OUT } from "@/lib/motion";

import { IllustrativeBadge } from "./illustrative-badge";

/*
  The assets that sit alongside the QR card: a direct review link, a website
  review button and printed receipt artwork.

  StarSpring builds these and hands them over. It never sends anything to a
  customer and never holds a customer list, so nothing here depicts a message,
  a campaign or an outbound send.
*/

export function ReviewAssets({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const ease = reduceMotion ? { duration: 0 } : null;

  const rows = [
    {
      icon: Link2,
      label: "Direct review link",
      body: (
        <span className="flex items-center gap-2 rounded-sm border border-line bg-bg-raised px-2.5 py-1.5">
          <span className="truncate font-mono text-[0.6875rem] text-ink-muted">
            g.page/ashgrove-dental/review
          </span>
          <Copy className="size-3 shrink-0 text-ink-subtle" aria-hidden="true" />
        </span>
      ),
    },
    {
      icon: MonitorSmartphone,
      label: "Website review button",
      body: (
        // self-start keeps this at its intrinsic width. Stretched to the panel
        // it reads as a page CTA rather than an embeddable button.
        <span className="inline-flex self-start items-center gap-1.5 rounded-sm bg-accent px-2.5 py-1.5 text-[0.6875rem] font-semibold text-accent-ink">
          <Star className="size-3" fill="currentColor" strokeWidth={0} aria-hidden="true" />
          Leave us a review
        </span>
      ),
    },
    {
      icon: Printer,
      label: "Receipt and counter artwork",
      body: (
        <span className="block rounded-sm border border-dashed border-line-strong bg-bg-raised px-2.5 py-1.5 text-[0.6875rem] text-ink-subtle">
          Thanks for visiting. Scan the code on your receipt to review us.
        </span>
      ),
    },
  ];

  return (
    <div ref={ref} className={`rounded-md border border-line bg-surface p-4 ${className}`}>
      <div className="flex items-start justify-between gap-3 border-b border-line pb-3">
        <p className="text-sm font-medium text-ink">Your review assets</p>
        <IllustrativeBadge />
      </div>

      <ul className="mt-4 flex flex-col gap-4">
        {rows.map((row, index) => (
          <motion.li
            key={row.label}
            data-reveal=""
            className="flex flex-col gap-2"
            initial={{ opacity: 0, y: 8 }}
            animate={inView ? { opacity: 1, y: 0 } : undefined}
            transition={ease ?? { duration: 0.4, ease: EASE_OUT, delay: 0.15 + index * 0.12 }}
          >
            <span className="inline-flex items-center gap-2 text-[0.6875rem] font-medium uppercase tracking-[0.1em] text-ink-subtle">
              <row.icon className="size-3.5 text-accent" aria-hidden="true" />
              {row.label}
            </span>
            {row.body}
          </motion.li>
        ))}
      </ul>

      <p className="mt-4 border-t border-line pt-3 text-[0.6875rem] leading-relaxed text-ink-subtle">
        Your team puts these in front of customers. StarSpring never messages anyone.
      </p>
    </div>
  );
}
