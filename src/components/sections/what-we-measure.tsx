import { FileText, Lock } from "lucide-react";

import { Reveal } from "@/components/ui/reveal";
import { Section, SectionHeading } from "@/components/ui/section";
import { measuredMetrics } from "@/lib/content";

/**
 * Honest empty state for the results section.
 *
 * There are no testimonials, logos, case studies or performance figures on
 * this page because none have been verified and cleared for publication.
 *
 * TO ADD VERIFIED CASE STUDIES LATER:
 *  1. Get written permission from the client to publish their figures.
 *  2. Add a `caseStudies` array to src/lib/content.ts (see the TODO beside
 *     `measuredMetrics` for the expected shape, including a permission ref).
 *  3. Render them BELOW this panel as a new sibling block. Keep this panel:
 *     it explains what the numbers mean.
 *  4. Never populate it with illustrative or averaged figures.
 */
export function WhatWeMeasure() {
  return (
    <Section id="what-we-measure">
      <div className="shell">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-16">
          <div>
            <SectionHeading
              title="What we measure."
              lead="We are not going to show you someone else's screenshot. Here is the report you get instead, and every line of it is about your business."
            />

            <Reveal delay={0.08}>
              <div className="mt-8 flex items-start gap-3 rounded-md border border-line bg-bg-raised p-4">
                <Lock className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
                <p className="text-sm leading-relaxed text-ink-muted">
                  We publish client results only with that client&rsquo;s written permission, and we
                  have not published any yet. When we do, they will appear here with the business
                  named and the period stated.
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.12}>
            <div className="rounded-lg border border-line-strong bg-bg-raised">
              <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
                <span className="inline-flex items-center gap-2 text-sm font-medium text-ink">
                  <FileText className="size-4 text-accent" aria-hidden="true" />
                  Your monthly report
                </span>
                <span className="text-xs text-ink-subtle">Seven lines, plain English</span>
              </div>

              <ul className="divide-y divide-line">
                {measuredMetrics.map((metric) => (
                  <li
                    key={metric.label}
                    className="flex items-center justify-between gap-6 px-5 py-4"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-ink">{metric.label}</p>
                      <p className="mt-1 text-xs leading-relaxed text-ink-subtle">{metric.hint}</p>
                    </div>
                    {/* Placeholder rather than a number: this row is yours to fill. */}
                    <span
                      aria-hidden="true"
                      className="h-2 w-14 shrink-0 rounded-full bg-surface-hi"
                    />
                  </li>
                ))}
              </ul>

              <p className="border-t border-line px-5 py-4 text-xs leading-relaxed text-ink-subtle">
                Values are blank because they are yours. Your first report sets the baseline, and
                every report after it compares against that.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
