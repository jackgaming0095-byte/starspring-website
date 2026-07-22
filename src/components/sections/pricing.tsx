import { Check } from "lucide-react";

import { CurrencySelect } from "@/components/currency/currency-select";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { Section, SectionHeading } from "@/components/ui/section";
import { CURRENCY_CODES, PRICES, formatPrice, type PlanId } from "@/lib/currency/config";

/** GBP is canonical and billed. Local currencies are fixed approximations. */
const PLANS: {
  id: PlanId;
  name: string;
  cadence: string;
  description: string;
  cta: string;
  featured: boolean;
  features: string[];
}[] = [
  {
    id: "launch",
    name: "Review Launch",
    cadence: "one time",
    description:
      "A complete reputation-system setup for businesses that want the foundation built properly.",
    cta: "Launch My Review System",
    featured: false,
    features: [
      "Google Business Profile audit",
      "Complete listing optimisation",
      "Review-generation strategy",
      "Branded QR review card",
      "Direct Google review link",
      "Printable counter and receipt materials",
      "Website review-button assets",
      "Review-response templates",
      "Negative-feedback process",
      "30-day progress review",
    ],
  },
  {
    id: "growth",
    name: "Reputation Growth",
    cadence: "per month",
    description:
      "Managed reputation growth, month to month, with reporting you can actually read.",
    cta: "Grow My Reputation",
    featured: true,
    features: [
      "Initial setup included",
      "Ongoing listing optimisation",
      "Review and rating monitoring",
      "Professional responses to new reviews",
      "Negative-feedback escalation",
      "QR and review-link asset updates",
      "Local visibility tracking",
      "Monthly performance report",
      "Ongoing reputation strategy",
      "Cancel anytime",
    ],
  },
];

/**
 * Every currency's price is rendered into the static HTML at build time, each
 * wrapped in a `[data-cur]` block. CSS in globals.css shows exactly one based
 * on the `data-currency` attribute on <html>, which the Cloudflare edge and the
 * pre-paint script set before first paint. That is what keeps the price from
 * flickering: no request-time work, no client fetch, no hydration swap.
 */
function PriceDisplay({ planId, cadence }: { planId: PlanId; cadence: string }) {
  const gbp = formatPrice(PRICES[planId].GBP, "GBP");

  return (
    <div className="mt-6">
      {CURRENCY_CODES.map((code) => (
        <div key={code} data-cur={code}>
          <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
            <span className="numeric text-4xl font-semibold tracking-[-0.03em] text-ink">
              {formatPrice(PRICES[planId][code], code)}
            </span>
            <span className="text-sm text-ink-muted">{cadence}</span>
          </div>
          {code === "GBP" ? (
            <p className="mt-2.5 text-xs leading-relaxed text-ink-subtle">
              Invoices are issued and charged in GBP.
            </p>
          ) : (
            <p className="mt-2.5 text-xs leading-relaxed text-ink-subtle">
              Approximate local equivalent of {gbp} {cadence}. Invoices are issued and charged in
              GBP.
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

export function Pricing() {
  return (
    <Section id="pricing">
      <div className="shell">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Pricing"
            title="Two ways to work together."
            lead="Start with the setup, or hand the whole thing over. No minimum term on the monthly plan."
            className="max-w-2xl"
          />
          <Reveal delay={0.06} className="shrink-0">
            <CurrencySelect labelText="Show prices in" />
          </Reveal>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-2">
          {PLANS.map((plan, index) => (
            <Reveal
              key={plan.id}
              delay={index * 0.08}
              className={`
                flex flex-col rounded-lg border p-7 md:p-8
                ${plan.featured ? "border-accent/45 bg-bg-raised" : "border-line bg-bg-raised/60"}
              `}
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-lg font-semibold text-ink">{plan.name}</h3>
                {plan.featured ? (
                  <span className="rounded-sm bg-accent px-2.5 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-accent-ink">
                    Done for you
                  </span>
                ) : null}
              </div>

              <p className="mt-3 max-w-[44ch] text-sm leading-relaxed text-ink-muted">
                {plan.description}
              </p>

              <PriceDisplay planId={plan.id} cadence={plan.cadence} />

              <ButtonLink
                href="/#free-audit"
                size="lg"
                variant={plan.featured ? "primary" : "secondary"}
                className="mt-7 w-full"
              >
                {plan.cta}
              </ButtonLink>

              <ul className="mt-8 flex flex-col gap-3 border-t border-line pt-7">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm text-ink-muted">
                    <Check className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <p className="mt-8 max-w-[72ch] text-xs leading-relaxed text-ink-subtle">
            Printing, paid advertising and third-party platform fees are separate where applicable.
            Prices exclude VAT where it applies.
          </p>
        </Reveal>
      </div>
    </Section>
  );
}
