import { Check } from "lucide-react";

import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { ReputationDashboard } from "@/components/visuals/reputation-dashboard";
import { trustRow } from "@/lib/content";
import { primaryCta } from "@/lib/site";

/**
 * Asymmetric split hero. Copy carries the left column, the illustrative
 * reputation panel carries the right, and both fit above the fold at 1280x800.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Two flat, fixed background layers. No scroll work, no repaint cost. */}
      <div aria-hidden="true" className="absolute inset-0 grid-field opacity-[0.55]" />
      <div aria-hidden="true" className="absolute inset-0 accent-glow" />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-bg"
      />

      <div className="shell relative pb-20 pt-14 md:pb-28 md:pt-20">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-accent">
                <span aria-hidden="true" className="h-px w-6 bg-accent/50" />
                Done-for-you reputation growth
              </span>
            </Reveal>

            <Reveal delay={0.06}>
              <h1 className="mt-5 max-w-[16ch] text-display font-semibold text-ink">
                Turn more happy customers into{" "}
                <span className="text-accent">Google reviews</span>.
              </h1>
            </Reveal>

            <Reveal delay={0.12}>
              <p className="mt-6 max-w-[52ch] text-base leading-relaxed text-ink-muted md:text-lg">
                StarSpring helps local businesses generate genuine reviews, strengthen their Google
                rating and get chosen more often, without adding more work to the team.
              </p>
            </Reveal>

            <Reveal delay={0.18}>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <ButtonLink href={primaryCta.href} size="lg">
                  {primaryCta.label}
                </ButtonLink>
                <ButtonLink href="/#how-it-works" variant="secondary" size="lg">
                  See How It Works
                </ButtonLink>
              </div>
            </Reveal>

            <Reveal delay={0.24}>
              <ul className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2.5">
                {trustRow.map((item) => (
                  <li key={item} className="inline-flex items-center gap-2 text-sm text-ink-muted">
                    <Check className="size-4 shrink-0 text-accent" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal delay={0.1} className="lg:pl-4">
            <ReputationDashboard />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
