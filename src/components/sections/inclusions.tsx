"use client";

import { ArrowRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";

import { Accordion } from "@/components/ui/accordion";
import { Reveal } from "@/components/ui/reveal";
import { Section, SectionHeading } from "@/components/ui/section";
import { inclusions } from "@/lib/content";
import { EASE_OUT } from "@/lib/motion";

function tierLabel(tier: string) {
  return tier === "growth" ? "Reputation Growth" : "Both plans";
}

/**
 * Service inclusions.
 *
 * Master/detail on large screens, accordion below `lg`. Two layouts rather
 * than one clever responsive component, because the interaction genuinely
 * differs: a side panel needs a persistent selection, an accordion does not.
 */
export function Inclusions() {
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion();
  const selected = inclusions[active];

  return (
    <Section id="inclusions">
      <div className="shell">
        <SectionHeading
          title="Everything the service covers."
          lead="Google Reviews is the primary platform. Where your sector calls for it we also support relevant industry platforms such as TripAdvisor and Booking.com. We are independent of all of them."
        />

        {/* Desktop: master / detail */}
        <div className="mt-12 hidden gap-10 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <Reveal>
            <ul className="flex flex-col border-t border-line">
              {inclusions.map((item, index) => {
                const isActive = index === active;
                return (
                  <li key={item.title} className="border-b border-line">
                    <button
                      type="button"
                      onClick={() => setActive(index)}
                      aria-current={isActive ? "true" : undefined}
                      className="
                        group flex w-full items-center justify-between gap-4 py-3.5 text-left
                        transition-colors duration-150 ease-out
                      "
                    >
                      <span
                        className={`text-sm transition-colors duration-150 ease-out ${
                          isActive ? "font-medium text-accent" : "text-ink-muted group-hover:text-ink"
                        }`}
                      >
                        {item.title}
                      </span>
                      <ArrowRight
                        aria-hidden="true"
                        className={`size-4 shrink-0 transition-[opacity,transform] duration-200 ease-out ${
                          isActive
                            ? "text-accent opacity-100"
                            : "text-ink-subtle opacity-0 group-hover:opacity-60"
                        }`}
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="sticky top-24 rounded-lg border border-line-strong bg-bg-raised p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selected.title}
                  // A short blur on the crossfade stops the two states reading
                  // as separate overlapping panels mid-transition.
                  initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -6, filter: "blur(4px)" }}
                  transition={reduceMotion ? { duration: 0 } : { duration: 0.22, ease: EASE_OUT }}
                >
                  <span className="inline-flex rounded-sm border border-line-strong bg-surface px-2.5 py-1 text-[0.6875rem] font-medium text-ink-subtle">
                    {tierLabel(selected.tier)}
                  </span>
                  <h3 className="mt-5 text-2xl font-semibold text-ink">{selected.title}</h3>
                  <p className="mt-4 max-w-[52ch] text-base leading-relaxed text-ink-muted">
                    {selected.body}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </Reveal>
        </div>

        {/* Below lg: accordion */}
        <div className="mt-10 lg:hidden">
          <Accordion
            items={inclusions.map((item) => ({
              id: item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
              question: item.title,
              answer: (
                <>
                  <span className="mb-2 block text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-ink-subtle">
                    {tierLabel(item.tier)}
                  </span>
                  {item.body}
                </>
              ),
            }))}
          />
        </div>
      </div>
    </Section>
  );
}
