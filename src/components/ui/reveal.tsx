"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { EASE_OUT } from "@/lib/motion";

/**
 * Scroll reveal.
 *
 * Two rules make this safe:
 *
 * 1. `initial` is a CONSTANT. It must never depend on anything that differs
 *    between the server and the browser (`useReducedMotion`, the presence of
 *    IntersectionObserver, `window`), because `initial` is written into the
 *    rendered style attribute and any branch there is a hydration mismatch.
 *    Reduced motion is honoured through `transition` instead, which is never
 *    serialised into HTML.
 *
 * 2. It fails OPEN. `data-reveal` is forced visible by a <noscript> rule in
 *    the layout, and the effect below reveals immediately in the rare
 *    environment that has JavaScript but no IntersectionObserver. A reveal
 *    must never be the thing that decides whether text exists on the page.
 */
export function Reveal({
  children,
  delay = 0,
  y = 16,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "section";
}) {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const [forceVisible, setForceVisible] = useState(false);
  const inView = useInView(ref, { once: true, amount: 0.15, margin: "0px 0px -60px 0px" });

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") setForceVisible(true);
  }, []);

  const visible = inView || forceVisible;
  const MotionTag = motion[as];

  return (
    <MotionTag
      ref={ref as never}
      data-reveal=""
      className={className}
      initial={{ opacity: 0, y }}
      animate={visible ? { opacity: 1, y: 0 } : undefined}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { duration: 0.55, delay, ease: EASE_OUT }
      }
    >
      {children}
    </MotionTag>
  );
}
