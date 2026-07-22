"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";

import { EASE_OUT } from "@/lib/motion";

import { IllustrativeBadge } from "./illustrative-badge";

/*
  Monthly report visual: review volume as columns, average rating as a line
  across the same six months. Every figure is invented for illustration.

  Bars grow with `scaleY` rather than an animated `height`. Transform is
  composited rather than triggering layout, and it means the <noscript>
  `transform: none` rule can restore the chart when motion never runs.
*/

const MONTHS = [
  { label: "Jan", reviews: 9, rating: 4.1 },
  { label: "Feb", reviews: 14, rating: 4.2 },
  { label: "Mar", reviews: 12, rating: 4.2 },
  { label: "Apr", reviews: 21, rating: 4.4 },
  { label: "May", reviews: 26, rating: 4.5 },
  { label: "Jun", reviews: 31, rating: 4.6 },
];

const W = 300;
const H = 130;
const PAD_X = 14;
const BASELINE = H - 18;
const RATING_MIN = 3.9;
const RATING_MAX = 4.8;

const maxReviews = Math.max(...MONTHS.map((m) => m.reviews));
const bandWidth = (W - PAD_X * 2) / MONTHS.length;

const ratingPoints = MONTHS.map((month, index) => {
  const x = PAD_X + bandWidth * index + bandWidth / 2;
  const y = BASELINE - ((month.rating - RATING_MIN) / (RATING_MAX - RATING_MIN)) * (H - 46);
  return { x, y };
});

export function ReportChart({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.35 });
  // `initial` stays constant across server and client; reduced motion is
  // handled in `transition`, which is never serialised into the HTML.
  const ease = reduceMotion ? { duration: 0 } : null;

  return (
    <div ref={ref} className={`rounded-md border border-line bg-surface p-4 ${className}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-ink">Six-month trend</p>
          <p className="mt-1 text-xs text-ink-subtle">Review volume and average rating</p>
        </div>
        <IllustrativeBadge />
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="mt-4 block w-full"
        role="img"
        aria-label="Illustrative chart showing review volume rising from 9 to 31 per month and average rating rising from 4.1 to 4.6 over six months"
      >
        <line
          x1={PAD_X}
          y1={BASELINE}
          x2={W - PAD_X}
          y2={BASELINE}
          stroke="var(--color-line-strong)"
          strokeWidth="1"
        />

        {MONTHS.map((month, index) => {
          const barHeight = (month.reviews / maxReviews) * (H - 52);
          const x = PAD_X + bandWidth * index + bandWidth * 0.28;
          return (
            <motion.rect
              key={month.label}
              data-grow=""
              x={x}
              y={BASELINE - barHeight}
              width={bandWidth * 0.44}
              height={barHeight}
              rx="2"
              fill="var(--color-surface-hi)"
              style={{ transformBox: "fill-box", transformOrigin: "bottom" }}
              initial={{ scaleY: 0 }}
              animate={inView ? { scaleY: 1 } : undefined}
              transition={ease ?? { duration: 0.6, ease: EASE_OUT, delay: index * 0.06 }}
            />
          );
        })}

        <motion.polyline
          data-draw=""
          points={ratingPoints.map((p) => `${p.x},${p.y}`).join(" ")}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={inView ? { pathLength: 1 } : undefined}
          transition={ease ?? { duration: 0.9, ease: EASE_OUT, delay: 0.3 }}
        />

        {ratingPoints.map((point, index) => (
          <motion.circle
            key={index}
            data-reveal=""
            cx={point.x}
            cy={point.y}
            r="2.8"
            fill="var(--color-bg-raised)"
            stroke="var(--color-accent)"
            strokeWidth="1.6"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : undefined}
            transition={ease ?? { duration: 0.25, ease: EASE_OUT, delay: 0.45 + index * 0.07 }}
          />
        ))}

        {MONTHS.map((month, index) => (
          <text
            key={month.label}
            x={PAD_X + bandWidth * index + bandWidth / 2}
            y={H - 5}
            textAnchor="middle"
            fill="var(--color-ink-subtle)"
            fontSize="9"
          >
            {month.label}
          </text>
        ))}
      </svg>

      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line pt-3">
        <span className="inline-flex items-center gap-2 text-xs text-ink-muted">
          <span aria-hidden="true" className="h-2.5 w-3 rounded-[2px] bg-surface-hi" />
          Reviews per month
        </span>
        <span className="inline-flex items-center gap-2 text-xs text-ink-muted">
          <span aria-hidden="true" className="h-0.5 w-3 rounded-full bg-accent" />
          Average rating
        </span>
      </div>
    </div>
  );
}
