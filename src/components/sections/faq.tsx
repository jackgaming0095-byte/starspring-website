import { Accordion } from "@/components/ui/accordion";
import { Reveal } from "@/components/ui/reveal";
import { Section, SectionHeading } from "@/components/ui/section";
import { faqs } from "@/lib/content";
import { site } from "@/lib/site";

/**
 * Answers here are mirrored verbatim into FAQPage structured data, so any edit
 * to src/lib/content.ts updates both the visible page and the markup.
 */
export function Faq() {
  return (
    <Section id="faqs">
      <div className="shell">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
          <div>
            <SectionHeading
              title="The questions worth asking."
              lead="Including the ones where the honest answer is no."
            />
            <Reveal delay={0.08}>
              <p className="mt-6 max-w-[40ch] text-sm leading-relaxed text-ink-subtle">
                Something not covered here? Email{" "}
                <a
                  href={`mailto:${site.email}`}
                  className="text-accent underline decoration-accent/40 underline-offset-4 transition-opacity duration-150 ease-out hover:opacity-80"
                >
                  {site.email}
                </a>{" "}
                and we will answer it plainly.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <Accordion
              items={faqs.map((item, index) => ({
                id: `q${index + 1}`,
                question: item.q,
                answer: item.a,
              }))}
            />
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
