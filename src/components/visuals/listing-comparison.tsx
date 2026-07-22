"use client";

import { Camera, MessageSquareReply, Search, Star } from "lucide-react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";

import { EASE_OUT, STAGGER } from "@/lib/motion";

import { IllustrativeBadge } from "./illustrative-badge";

/*
  A generic local-results comparison. Three invented businesses, deliberately
  drawn in our own visual language rather than any platform's interface, and
  using no third-party marks or brand colours.
*/

type Listing = {
  name: string;
  category: string;
  rating: number;
  reviews: number;
  photos: number;
  responses: string;
  snippet: string;
  strongest?: boolean;
};

const LISTINGS: Listing[] = [
  {
    name: "Ashgrove Dental Practice",
    category: "Dental clinic",
    rating: 4.8,
    reviews: 312,
    photos: 48,
    responses: "Replies within 2 days",
    snippet: "Explained the options before starting anything. No pressure at all.",
    strongest: true,
  },
  {
    name: "Kingsway Dental Care",
    category: "Dental clinic",
    rating: 4.3,
    reviews: 96,
    photos: 12,
    responses: "Last reply 7 months ago",
    snippet: "Fine appointment, though reception took a while to answer.",
  },
  {
    name: "Bell Lane Dental",
    category: "Dental clinic",
    rating: 3.9,
    reviews: 41,
    photos: 3,
    responses: "No replies to reviews",
    snippet: "Treatment was OK. Nobody followed up about the second visit.",
  },
];

function StarRow({ rating }: { rating: number }) {
  return (
    <span className="relative inline-flex" aria-hidden="true">
      <span className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star key={index} className="size-3.5 text-surface-hi" fill="currentColor" strokeWidth={0} />
        ))}
      </span>
      <span
        className="absolute inset-0 flex gap-0.5 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - (rating / 5) * 100}% 0 0)` }}
      >
        {Array.from({ length: 5 }).map((_, index) => (
          <Star key={index} className="size-3.5 text-accent" fill="currentColor" strokeWidth={0} />
        ))}
      </span>
    </span>
  );
}

export function ListingComparison() {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.25 });
  // `initial` must stay constant across server and client; reduced motion
  // is handled in `transition`, which is never serialised into the HTML.
  const ease = reduceMotion ? { duration: 0 } : null;

  return (
    <div ref={ref} className="rounded-lg border border-line-strong bg-bg-raised p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-2.5 rounded-sm border border-line bg-surface px-3.5 py-2.5">
          <Search className="size-4 shrink-0 text-ink-subtle" aria-hidden="true" />
          <span className="truncate text-sm text-ink-muted">dentist near me</span>
        </div>
        <IllustrativeBadge />
      </div>

      <ul className="mt-4 flex flex-col gap-3">
        {LISTINGS.map((listing, index) => (
          <motion.li
            key={listing.name}
            data-reveal=""

            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : undefined}
            transition={ease ?? { duration: 0.5, ease: EASE_OUT, delay: index * STAGGER }}
            className={`
              rounded-md border p-4 transition-colors duration-200 ease-out
              ${
                listing.strongest
                  ? "border-accent/45 bg-surface"
                  : "border-line bg-surface/45"
              }
            `}
          >
            <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
              <div className="min-w-0">
                <h3
                  className={`text-sm font-semibold ${listing.strongest ? "text-ink" : "text-ink-muted"}`}
                >
                  {listing.name}
                </h3>
                <p className="mt-0.5 text-xs text-ink-subtle">{listing.category}</p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`numeric text-sm font-semibold ${listing.strongest ? "text-ink" : "text-ink-muted"}`}
                >
                  {listing.rating.toFixed(1)}
                </span>
                <StarRow rating={listing.rating} />
                <span className="numeric text-xs text-ink-subtle">({listing.reviews})</span>
              </div>
            </div>

            <p className="mt-3 text-xs leading-relaxed text-ink-subtle">
              &ldquo;{listing.snippet}&rdquo;
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5">
              <span
                className={`inline-flex items-center gap-1.5 text-xs ${
                  listing.strongest ? "text-accent" : "text-ink-subtle"
                }`}
              >
                <MessageSquareReply className="size-3.5" aria-hidden="true" />
                {listing.responses}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-ink-subtle">
                <Camera className="size-3.5" aria-hidden="true" />
                <span className="numeric">{listing.photos}</span> photos
              </span>
            </div>
          </motion.li>
        ))}
      </ul>

      <p className="mt-5 border-t border-line pt-4 text-xs leading-relaxed text-ink-subtle">
        Rating is one of several things a person weighs up, alongside recency, photos and whether
        the business bothers to reply. Search ranking factors are set by the platform, not by us.
      </p>
    </div>
  );
}
