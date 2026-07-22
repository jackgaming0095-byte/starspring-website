"use client";

import { Star, TrendingUp } from "lucide-react";
import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { useEffect, useLayoutEffect, useRef } from "react";

import { EASE_OUT } from "@/lib/motion";

import { IllustrativeBadge } from "./illustrative-badge";

/*
  Hero illustration: a reputation panel showing a rating moving from 4.1 to 4.6
  and review volume moving from 83 to 147.

  Every number here is invented for illustration and is labelled as such. It is
  not a client result and must never be presented as one.

  HYDRATION NOTE: the motion values are seeded with the FINAL figures so the
  server HTML and the first client render agree. They are rewound to the
  starting figures in a layout effect, before paint, so there is no visible
  jump and no mismatch. Never seed them from a browser-only condition.
*/

const RATING_FROM = 4.1;
const RATING_TO = 4.6;
const REVIEWS_FROM = 83;
const REVIEWS_TO = 147;

/** Illustrative monthly review volume, drawn as a sparkline. */
const VOLUME = [6, 9, 8, 13, 17, 22, 26, 31];

const SAMPLE_REVIEWS = [
  { initials: "PR", name: "Priya R.", text: "Booked at short notice and still felt looked after.", stars: 5 },
  { initials: "TO", name: "Tomasz O.", text: "Second visit this month. Same standard both times.", stars: 5 },
  { initials: "MB", name: "Maeve B.", text: "Sorted the fault properly instead of patching it.", stars: 4 },
];

/** useLayoutEffect on the client, useEffect on the server, without warnings. */
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/*
  Revealed with a clip rather than an animated `pathLength`.

  This polyline is drawn in a viewBox that is stretched horizontally
  (`preserveAspectRatio="none"`) and strokes with `non-scaling-stroke`. Under
  that combination Chromium measures the dash pattern in screen space while
  `pathLength` normalises the geometry in user space, so the dash ends early
  and the pattern repeats, painting a stray segment at the right-hand end.
  A clip has no such dependency on path measurement.
*/
function Sparkline({ play, reduceMotion }: { play: boolean; reduceMotion: boolean | null }) {
  const max = Math.max(...VOLUME);
  const points = VOLUME.map((value, index) => {
    const x = (index / (VOLUME.length - 1)) * 100;
    const y = 32 - (value / max) * 28;
    return `${x},${y}`;
  });

  return (
    <motion.div
      data-clip=""
      className="h-10 w-full"
      initial={{ clipPath: "inset(0 100% 0 0)" }}
      animate={play ? { clipPath: "inset(0 0% 0 0)" } : undefined}
      transition={reduceMotion ? { duration: 0 } : { duration: 1.1, ease: EASE_OUT, delay: 0.35 }}
    >
      <svg viewBox="0 0 100 34" preserveAspectRatio="none" className="size-full" aria-hidden="true">
        <polyline
          points={points.join(" ")}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </motion.div>
  );
}

export function ReputationDashboard() {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.4 });

  const rating = useMotionValue(RATING_TO);
  const reviews = useMotionValue(REVIEWS_TO);

  const ratingText = useTransform(rating, (value) => value.toFixed(1));
  const reviewsText = useTransform(reviews, (value) => Math.round(value).toString());
  const starClip = useTransform(rating, (value) => `inset(0 ${100 - (value / 5) * 100}% 0 0)`);

  // Rewind before the browser paints, so the count-up starts from 4.1 / 83
  // without the reader ever seeing the final figures flash first.
  useIsomorphicLayoutEffect(() => {
    if (reduceMotion) return;
    rating.set(RATING_FROM);
    reviews.set(REVIEWS_FROM);
  }, [reduceMotion, rating, reviews]);

  useEffect(() => {
    if (!inView || reduceMotion) return;
    const a = animate(rating, RATING_TO, { duration: 1.4, ease: EASE_OUT, delay: 0.2 });
    const b = animate(reviews, REVIEWS_TO, { duration: 1.5, ease: EASE_OUT, delay: 0.2 });
    return () => {
      a.stop();
      b.stop();
    };
  }, [inView, reduceMotion, rating, reviews]);

  return (
    <div
      ref={ref}
      className="
        relative w-full rounded-lg border border-line-strong bg-bg-raised p-5
        shadow-[0_40px_90px_-40px_oklch(0_0_0/0.85)] sm:p-6
      "
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-ink">Reputation overview</p>
          <p className="mt-1 text-xs text-ink-subtle">Rolling 90 days</p>
        </div>
        <IllustrativeBadge />
      </div>

      {/* Rating block */}
      <div className="mt-6 flex items-end gap-5">
        <div>
          <motion.p className="numeric text-5xl font-semibold leading-none tracking-[-0.03em] text-ink">
            {ratingText}
          </motion.p>
          <p className="mt-2 text-xs text-ink-subtle">Average rating</p>
        </div>

        <div className="flex-1 pb-1">
          <div className="relative inline-flex">
            <div className="flex gap-1" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} className="size-5 text-surface-hi" fill="currentColor" strokeWidth={0} />
              ))}
            </div>
            <motion.div
              aria-hidden="true"
              className="absolute inset-0 flex gap-1"
              style={{ clipPath: starClip }}
            >
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} className="size-5 text-accent" fill="currentColor" strokeWidth={0} />
              ))}
            </motion.div>
          </div>
          <p className="mt-2 text-xs text-ink-subtle">
            <span className="sr-only">
              Illustrative rating of {RATING_TO.toFixed(1)} out of 5.{" "}
            </span>
            Was {RATING_FROM.toFixed(1)}
          </p>
        </div>
      </div>

      {/* Volume block */}
      <div className="mt-6 grid grid-cols-2 gap-4 rounded-md border border-line bg-surface p-4">
        <div>
          <div className="flex items-baseline gap-2">
            <motion.p className="numeric text-2xl font-semibold leading-none text-ink">
              {reviewsText}
            </motion.p>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-accent">
              <TrendingUp className="size-3.5" aria-hidden="true" />
              from {REVIEWS_FROM}
            </span>
          </div>
          <p className="mt-2 text-xs text-ink-subtle">Genuine reviews</p>
        </div>
        <div className="min-w-0">
          <Sparkline play={inView} reduceMotion={reduceMotion} />
          <p className="mt-1 text-xs text-ink-subtle">Monthly volume</p>
        </div>
      </div>

      {/* Review cards resolving in */}
      <ul className="mt-4 flex flex-col gap-2">
        {SAMPLE_REVIEWS.map((review, index) => (
          <motion.li
            key={review.name}
            data-reveal=""
            className="flex items-start gap-3 rounded-md border border-line bg-surface/60 p-3"
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : undefined}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { duration: 0.45, ease: EASE_OUT, delay: 0.55 + index * 0.08 }
            }
          >
            <span
              aria-hidden="true"
              className="grid size-8 shrink-0 place-items-center rounded-sm bg-surface-hi text-[0.6875rem] font-semibold text-ink-muted"
            >
              {review.initials}
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="truncate text-xs font-medium text-ink">{review.name}</span>
                <span className="flex gap-0.5" aria-label={`${review.stars} out of 5`}>
                  {Array.from({ length: 5 }).map((_, index2) => (
                    <Star
                      key={index2}
                      className={index2 < review.stars ? "size-2.5 text-accent" : "size-2.5 text-surface-hi"}
                      fill="currentColor"
                      strokeWidth={0}
                      aria-hidden="true"
                    />
                  ))}
                </span>
              </div>
              <p className="mt-1 truncate text-xs text-ink-subtle">{review.text}</p>
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
