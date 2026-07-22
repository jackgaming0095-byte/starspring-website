import {
  Car,
  Dumbbell,
  Home,
  Hotel,
  Scale,
  Scissors,
  Stethoscope,
  Store,
  UtensilsCrossed,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import { Reveal } from "@/components/ui/reveal";
import { Section, SectionHeading } from "@/components/ui/section";
import { industries, type IconKey } from "@/lib/content";

const ICONS: Record<IconKey, LucideIcon> = {
  utensils: UtensilsCrossed,
  scissors: Scissors,
  dumbbell: Dumbbell,
  stethoscope: Stethoscope,
  home: Home,
  car: Car,
  wrench: Wrench,
  store: Store,
  scale: Scale,
  hotel: Hotel,
};

/**
 * Dense tile grid. Every tile carries the moment in that industry's day when a
 * review asset does its work, which is the real operational difference
 * between sectors.
 */
export function Industries() {
  return (
    <Section id="industries" tone="raised">
      <div className="shell">
        <SectionHeading
          title="Built for businesses judged on their last review."
          lead="The system is the same everywhere. What changes is which asset sits where, at which moment in your customer journey, and which platform matters most."
        />

        <ul className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-line-strong bg-line-strong sm:grid-cols-2 lg:grid-cols-5">
          {industries.map((industry, index) => {
            const Icon = ICONS[industry.icon];
            return (
              <Reveal
                key={industry.name}
                as="li"
                delay={Math.min(index, 5) * 0.04}
                className="
                  group flex flex-col gap-3 bg-bg p-5
                  transition-colors duration-200 ease-out hover:bg-surface
                "
              >
                <Icon
                  className="size-5 text-ink-subtle transition-colors duration-200 ease-out group-hover:text-accent"
                  aria-hidden="true"
                />
                <h3 className="text-sm font-medium leading-snug text-ink">{industry.name}</h3>
                <p className="mt-auto text-xs leading-relaxed text-ink-subtle">{industry.moment}</p>
              </Reveal>
            );
          })}
        </ul>

        <Reveal delay={0.1}>
          <p className="mt-6 max-w-[62ch] text-sm leading-relaxed text-ink-muted">
            Not on the list? If you serve local customers and they can leave a public review, the
            same system applies. Tell us what you do in the audit request and we will say honestly
            whether it fits.
          </p>
        </Reveal>
      </div>
    </Section>
  );
}
