import Link from "next/link";

import { Logo } from "@/components/brand/logo";
import { legalLinks, platformDisclaimer, site } from "@/lib/site";

const exploreLinks = [
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Industries", href: "/#industries" },
  { label: "Pricing", href: "/#pricing" },
  { label: "What We Measure", href: "/#what-we-measure" },
  { label: "FAQs", href: "/#faqs" },
];

/** Server component: the copyright year is rendered at request time. */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-bg-raised">
      <div className="shell py-16 md:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-8">
          <div className="max-w-sm">
            <Logo showDescriptor />
            <p className="mt-5 text-sm leading-relaxed text-ink-muted">{site.shortDescription}</p>
            <p className="mt-4 text-sm leading-relaxed text-ink-subtle">
              Real customers only. No fake reviews. Cancel anytime.
            </p>
          </div>

          <nav aria-label="Explore">
            <h2 className="text-sm font-semibold text-ink">Explore</h2>
            <ul className="mt-4 flex flex-col gap-2.5">
              {exploreLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-ink-muted transition-colors duration-150 ease-out hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-sm font-semibold text-ink">Contact</h2>
            <ul className="mt-4 flex flex-col gap-2.5">
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="text-sm text-ink-muted transition-colors duration-150 ease-out hover:text-accent"
                >
                  {site.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${site.phoneHref}`}
                  className="text-sm text-ink-muted transition-colors duration-150 ease-out hover:text-accent"
                >
                  {site.phoneDisplay}
                </a>
              </li>
              <li>
                <Link
                  href="/#free-audit"
                  className="text-sm text-accent transition-opacity duration-150 ease-out hover:opacity-80"
                >
                  Request a free audit
                </Link>
              </li>
            </ul>

            <h2 className="mt-8 text-sm font-semibold text-ink">Legal</h2>
            <ul className="mt-4 flex flex-col gap-2.5">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-ink-muted transition-colors duration-150 ease-out hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 border-t border-line pt-8">
          <p className="max-w-[80ch] text-xs leading-relaxed text-ink-subtle">
            {platformDisclaimer}
          </p>
          <p className="mt-4 text-xs text-ink-subtle">
            &copy; {year} {site.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
