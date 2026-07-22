"use client";

import { AlertTriangle, CornerDownRight, Star } from "lucide-react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";

import { EASE_OUT } from "@/lib/motion";

import { IllustrativeBadge } from "./illustrative-badge";

/*
  Illustrative review plus the reply we would post, and the escalation path a
  serious complaint takes. Invented content.
*/

export function ResponseComposer({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.35 });
  // `initial` must stay constant across server and client; reduced motion
  // is handled in `transition`, which is never serialised into the HTML.
  const ease = reduceMotion ? { duration: 0 } : null;

  return (
    <div ref={ref} className={`rounded-md border border-line bg-surface p-4 ${className}`}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-ink">Response and escalation</p>
        <IllustrativeBadge />
      </div>

      <div className="mt-4 rounded-md border border-line bg-bg-raised p-3">
        <div className="flex items-center gap-2">
          <span className="flex gap-0.5" aria-label="2 out of 5">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                className={index < 2 ? "size-3 text-accent" : "size-3 text-surface-hi"}
                fill="currentColor"
                strokeWidth={0}
                aria-hidden="true"
              />
            ))}
          </span>
          <span className="text-xs font-medium text-ink">Callum W.</span>
          <span className="text-[0.6875rem] text-ink-subtle">2 days ago</span>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-ink-subtle">
          Waited 40 minutes past my appointment time and nobody explained why.
        </p>
      </div>

      <motion.div
        className="mt-3 flex gap-2.5 pl-4"
        data-reveal=""

        initial={{ opacity: 0, y: 8 }}
        animate={inView ? { opacity: 1, y: 0 } : undefined}
        transition={ease ?? { duration: 0.45, ease: EASE_OUT, delay: 0.25 }}
      >
        <CornerDownRight className="mt-1 size-3.5 shrink-0 text-accent" aria-hidden="true" />
        <div className="rounded-md border border-accent/35 bg-accent-wash p-3">
          <p className="text-[0.6875rem] font-medium text-accent">Posted reply</p>
          <p className="mt-1.5 text-xs leading-relaxed text-ink-muted">
            Callum, a 40 minute wait with no explanation is not the standard we hold ourselves to,
            and I am sorry. I have passed the detail to our practice manager and we would like to
            put it right. Please reach us on the number below.
          </p>
        </div>
      </motion.div>

      <motion.div
        className="mt-4 flex items-start gap-2.5 border-t border-line pt-3"
        data-reveal=""

        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : undefined}
        transition={ease ?? { duration: 0.4, ease: EASE_OUT, delay: 0.5 }}
      >
        <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-ink-subtle" aria-hidden="true" />
        <p className="text-[0.6875rem] leading-relaxed text-ink-subtle">
          Escalated to the practice manager the same day. The public review stays exactly where the
          customer put it.
        </p>
      </motion.div>
    </div>
  );
}
