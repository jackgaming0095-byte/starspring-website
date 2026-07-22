"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";

import { SPRING_SOFT } from "@/lib/motion";

import { IllustrativeBadge } from "./illustrative-badge";

/*
  Abstract local-area grid. Not a real map and not tied to any mapping
  provider: streets are drawn from fixed coordinates so the composition is
  identical on the server and the client.
*/

const STREETS_V = [26, 62, 104, 148, 186];
const STREETS_H = [30, 66, 100, 136];

/** Pin 0 is the subject business; the rest are illustrative competitors. */
const PINS = [
  { x: 104, y: 66, subject: true },
  { x: 44, y: 38, subject: false },
  { x: 160, y: 52, subject: false },
  { x: 72, y: 116, subject: false },
  { x: 172, y: 120, subject: false },
];

export function MapGrid({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.4 });
  // `initial` must stay constant across server and client; reduced motion
  // is handled in `transition`, which is never serialised into the HTML.
  const ease = reduceMotion ? { duration: 0 } : null;

  return (
    <div ref={ref} className={`relative aspect-[16/9] overflow-hidden rounded-md border border-line bg-surface ${className}`}>
      <svg viewBox="0 0 212 152" preserveAspectRatio="xMidYMid slice" className="block size-full" role="img" aria-label="Illustration of a local area with the subject business marked among nearby competitors">
        {/* Street grid */}
        <g stroke="var(--color-line-strong)" strokeWidth="1">
          {STREETS_V.map((x) => (
            <line key={`v${x}`} x1={x} y1="0" x2={x} y2="152" />
          ))}
          {STREETS_H.map((y) => (
            <line key={`h${y}`} x1="0" y1={y} x2="212" y2={y} />
          ))}
        </g>

        {/* Two wider routes, to keep the grid from reading as graph paper */}
        <g stroke="var(--color-surface-hi)" strokeWidth="6" strokeLinecap="round">
          <line x1="0" y1="100" x2="212" y2="100" />
          <line x1="104" y1="0" x2="104" y2="152" />
        </g>

        {/* Catchment radius around the subject */}
        <motion.circle
          cx={PINS[0].x}
          cy={PINS[0].y}
          r="46"
          fill="var(--color-accent)"
          fillOpacity="0.06"
          stroke="var(--color-accent)"
          strokeOpacity="0.28"
          strokeWidth="1"
          strokeDasharray="3 4"
          data-reveal=""

          initial={{ scale: 0.85, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : undefined}
          transition={ease ?? { ...SPRING_SOFT, delay: 0.15 }}
          style={{ transformOrigin: `${PINS[0].x}px ${PINS[0].y}px` }}
        />

        {PINS.map((pin, index) => (
          <motion.g
            key={`${pin.x}-${pin.y}`}
            data-reveal=""

            initial={{ y: -14, opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : undefined}
            transition={ease ?? { ...SPRING_SOFT, delay: 0.1 + index * 0.07 }}
          >
            <path
              d={`M${pin.x} ${pin.y - 13}c-3.9 0-7 3.1-7 7 0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7Z`}
              fill={pin.subject ? "var(--color-accent)" : "var(--color-surface-hi)"}
              stroke={pin.subject ? "none" : "var(--color-line-strong)"}
              strokeWidth="1"
            />
            <circle
              cx={pin.x}
              cy={pin.y - 6}
              r="2.6"
              fill={pin.subject ? "var(--color-accent-ink)" : "var(--color-bg-raised)"}
            />
          </motion.g>
        ))}
      </svg>

      <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 rounded-sm border border-line-strong bg-bg-raised/90 px-2.5 py-1.5 text-[0.6875rem] font-medium text-ink backdrop-blur-sm">
          <span aria-hidden="true" className="size-2 rounded-full bg-accent" />
          Your business
        </span>
        <IllustrativeBadge />
      </div>
    </div>
  );
}
