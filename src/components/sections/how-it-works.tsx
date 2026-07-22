"use client";

import { Check } from "lucide-react";
import { motion, useScroll, useSpring } from "motion/react";
import { useRef, type ReactNode } from "react";

import { Reveal } from "@/components/ui/reveal";
import { Section, SectionHeading } from "@/components/ui/section";
import { ListingOptimiser } from "@/components/visuals/listing-optimiser";
import { QrCard } from "@/components/visuals/qr-card";
import { ReportChart } from "@/components/visuals/report-chart";
import { ResponseComposer } from "@/components/visuals/response-composer";
import { ReviewAssets } from "@/components/visuals/review-assets";
import { steps } from "@/lib/content";

/**
 * Four-stage flow.
 *
 * The connecting rail is scroll-linked: it draws downward as the reader moves
 * through the stages, which is the one thing on this page where motion carries
 * real information (how far through the process you are). Driven by
 * `useScroll`, so nothing runs on a scroll listener.
 */

const VISUALS: ReactNode[] = [
  <ListingOptimiser key="1" />,
  <div key="2" className="grid grid-cols-1 gap-4 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-start">
    <QrCard />
    <ReviewAssets />
  </div>,
  <ResponseComposer key="3" />,
  <ReportChart key="4" />,
];

/** Steps 1 and 3 sit beside their visual; 2 and 4 run full width for rhythm. */
const WIDE = [false, true, false, true];

export function HowItWorks() {
  const railRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ["start 70%", "end 65%"],
  });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <Section id="how-it-works" tone="raised">
      <div className="shell">
        <SectionHeading
          title="Four stages, run for you end to end."
          lead="You approve the plan and keep serving customers. We handle the profile, the review assets, the responses and the reporting."
        />

        <div ref={railRef} className="relative mt-14">
          {/* Connector rail. Hidden on mobile where the steps already stack. */}
          <div
            aria-hidden="true"
            className="absolute left-[15px] top-2 hidden h-[calc(100%-2rem)] w-px bg-line-strong md:block"
          >
            {/* Reduced motion is handled in CSS (.flow-rail) rather than by
                branching here. A branch on a browser-only value would change
                the rendered style attribute and break hydration. */}
            <motion.div
              className="flow-rail h-full w-px origin-top bg-accent"
              style={{ scaleY }}
            />
          </div>

          <ol className="flex flex-col gap-14 md:gap-20">
            {steps.map((step, index) => (
              <li key={step.n} className="md:pl-14">
                <Reveal>
                  <div className="relative">
                    {/* Step marker, aligned to the rail. */}
                    <span
                      aria-hidden="true"
                      className="
                        absolute -left-14 top-0 hidden size-8 place-items-center
                        rounded-sm border border-line-strong bg-bg-raised
                        text-xs font-semibold text-accent md:grid
                      "
                    >
                      {step.n}
                    </span>

                    <div
                      className={
                        WIDE[index] ? "" : "grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-12"
                      }
                    >
                      <div className={WIDE[index] ? "max-w-2xl" : ""}>
                        <h3 className="flex items-baseline gap-3 text-xl font-semibold text-ink md:text-2xl">
                          <span className="numeric text-sm font-semibold text-accent md:hidden">
                            {step.n}
                          </span>
                          {step.title}
                        </h3>
                        <p className="mt-3 max-w-[52ch] text-sm leading-relaxed text-ink-muted md:text-base">
                          {step.body}
                        </p>
                        <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
                          {step.points.map((point) => (
                            <li
                              key={point}
                              className="inline-flex items-center gap-2 text-xs text-ink-subtle"
                            >
                              <Check className="size-3.5 shrink-0 text-accent" aria-hidden="true" />
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className={WIDE[index] ? "mt-8" : ""}>{VISUALS[index]}</div>
                    </div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  );
}
