import { Reveal } from "@/components/ui/reveal";
import { Section, SectionHeading } from "@/components/ui/section";
import { site } from "@/lib/site";

import { AuditFormPanel } from "./audit-form-panel";

const WHAT_YOU_GET = [
  "A read on your current profile, categories and completeness",
  "Where your rating and review recency sit against nearby alternatives",
  "The review moments your business is currently missing",
  "What we would do first, and what we would leave alone",
];

/**
 * Server Component. Only the form panel inside it is interactive, and its
 * dependencies (Zod, React Hook Form) are code-split away from first paint.
 */
export function FreeAudit() {
  return (
    <Section id="free-audit" tone="raised">
      <div className="shell">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
          <div>
            <SectionHeading
              title="Get your free reputation audit."
              lead="Send us the basics and we will look at your profile properly, then come back with what we would actually do. No obligation, and we will tell you if we think you do not need us."
            />

            <Reveal delay={0.08}>
              <ul className="mt-8 flex flex-col">
                {WHAT_YOU_GET.map((item) => (
                  <li
                    key={item}
                    className="border-t border-line py-3.5 text-sm leading-relaxed text-ink-muted last:border-b"
                  >
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm text-ink-subtle">
                Prefer email? Write to{" "}
                <a
                  href={`mailto:${site.email}`}
                  className="text-accent underline decoration-accent/40 underline-offset-4 transition-opacity duration-150 ease-out hover:opacity-80"
                >
                  {site.email}
                </a>
                .
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.12}>
            <AuditFormPanel />
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
