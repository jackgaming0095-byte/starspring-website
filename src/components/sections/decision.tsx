import { Reveal } from "@/components/ui/reveal";
import { Section, SectionHeading } from "@/components/ui/section";
import { ListingComparison } from "@/components/visuals/listing-comparison";

const CHECKS = [
  "The average rating, read in about two seconds",
  "How recent the last few reviews are",
  "Whether the listing looks maintained or abandoned",
  "Whether the business replies, and how it replies when the review is bad",
];

/** Stacked heading over a full-width comparison. No image-and-text split here. */
export function Decision() {
  return (
    <Section id="decision" tone="raised">
      <div className="shell">
        <div className="max-w-3xl">
          <SectionHeading
            title="Customers compare your reputation before they contact you."
            lead="Before someone calls, books, orders or drives over, they have already looked you up next to two or three alternatives. That comparison happens without you in the room."
          />
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] lg:gap-12">
          <Reveal className="lg:pt-2">
            <h3 className="text-lg font-medium text-ink">What they actually look at</h3>
            <ul className="mt-5 flex flex-col">
              {CHECKS.map((check, index) => (
                <li
                  key={check}
                  className="flex gap-4 border-t border-line py-4 last:border-b last:border-line"
                >
                  <span className="numeric mt-0.5 text-xs font-medium text-accent">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm leading-relaxed text-ink-muted">{check}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 max-w-[46ch] text-sm leading-relaxed text-ink-subtle">
              None of it is a ranking promise. It is simply what a person weighs up when they have
              three tabs open and ten minutes.
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <ListingComparison />
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
