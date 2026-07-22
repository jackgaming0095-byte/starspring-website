import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { primaryCta } from "@/lib/site";

/**
 * Closing statement. The one centred composition on the page, which is the
 * point: everything else has been argument, this is the ask.
 */
export function FinalCta() {
  return (
    <section className="relative overflow-hidden border-t border-line py-24 md:py-32">
      <div aria-hidden="true" className="absolute inset-0 grid-field opacity-40" />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(38rem_22rem_at_50%_100%,oklch(0.875_0.196_123/0.1),transparent_70%)]"
      />

      <div className="shell relative flex flex-col items-center text-center">
        <Reveal>
          <h2 className="max-w-[22ch] text-title font-semibold text-ink">
            Your happy customers already have something good to say.
          </h2>
        </Reveal>

        <Reveal delay={0.06}>
          <p className="mt-5 max-w-[46ch] text-base leading-relaxed text-ink-muted md:text-lg">
            We make it easier for them to say it where the next customer will see it.
          </p>
        </Reveal>

        <Reveal delay={0.12}>
          <ButtonLink href={primaryCta.href} size="lg" className="mt-9">
            {primaryCta.label}
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}
