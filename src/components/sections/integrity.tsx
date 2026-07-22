import { ShieldCheck, X } from "lucide-react";
import Link from "next/link";

import { Reveal } from "@/components/ui/reveal";
import { integrityPrinciples } from "@/lib/content";

/**
 * Integrity section.
 *
 * Visually distinct without breaking the page theme lock: same dark surface
 * ladder, but framed as one bordered panel over the hairline grid rather than
 * the open layout used everywhere else.
 */
export function Integrity() {
  return (
    <section id="integrity" className="scroll-mt-24 py-20 md:py-28">
      <div className="shell">
        <Reveal>
          <div className="relative overflow-hidden rounded-lg border border-accent/25 bg-surface">
            <div aria-hidden="true" className="absolute inset-0 grid-field opacity-40" />
            <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-accent/60" />

            <div className="relative p-6 md:p-10 lg:p-14">
              <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-accent">
                <ShieldCheck className="size-4" aria-hidden="true" />
                Review integrity
              </span>

              <h2 className="mt-5 max-w-[20ch] text-title font-semibold text-ink">
                Real customers. Real experiences. Durable growth.
              </h2>

              <p className="mt-5 max-w-[62ch] text-base leading-relaxed text-ink-muted">
                StarSpring does not buy, invent or incentivise reviews, and we never hold or contact
                your customers. We build the assets your team puts in front of them, so every
                customer receives an equal opportunity to leave honest public feedback. Private
                support options may be offered alongside the public review route, but never used to
                block or suppress genuine reviews.
              </p>

              <ul className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-md border border-line-strong bg-line-strong sm:grid-cols-2 lg:grid-cols-3">
                {integrityPrinciples.map((principle) => (
                  <li key={principle.title} className="bg-bg-raised p-5">
                    <span
                      aria-hidden="true"
                      className="grid size-7 place-items-center rounded-sm border border-line-strong text-ink-subtle"
                    >
                      <X className="size-3.5" strokeWidth={2.5} />
                    </span>
                    <h3 className="mt-4 text-sm font-semibold text-ink">{principle.title}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-ink-subtle">{principle.body}</p>
                  </li>
                ))}
              </ul>

              <p className="mt-8 max-w-[76ch] text-xs leading-relaxed text-ink-subtle">
                Review platform policies apply at all times, and results vary by business, location,
                customer volume and service quality. Read the full{" "}
                <Link
                  href="/review-integrity-policy"
                  className="text-ink-muted underline decoration-line-strong underline-offset-4 transition-colors duration-150 ease-out hover:text-accent hover:decoration-accent"
                >
                  Review Integrity Policy
                </Link>
                .
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
