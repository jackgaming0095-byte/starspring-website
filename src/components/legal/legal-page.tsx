import { FileWarning } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { ButtonLink } from "@/components/ui/button";
import { legalLinks, site } from "@/lib/site";

/**
 * Shared shell for the four policy pages.
 *
 * Every one of these documents is a STARTING DRAFT. The notice below is not
 * decoration: none of this content has been reviewed by a solicitor, and it
 * must be before the site goes live. Do not remove the notice without that
 * review having actually happened.
 */
export const LEGAL_LAST_UPDATED = "22 July 2026";

export function LegalPage({
  title,
  summary,
  children,
}: {
  title: string;
  summary: string;
  children: ReactNode;
}) {
  return (
    <div className="shell py-16 md:py-24">
      <div className="max-w-3xl">
        <Link
          href="/"
          className="text-sm text-ink-subtle transition-colors duration-150 ease-out hover:text-accent"
        >
          Back to {site.name}
        </Link>

        <h1 className="mt-6 text-title font-semibold text-ink">{title}</h1>
        <p className="mt-4 text-base leading-relaxed text-ink-muted">{summary}</p>
        <p className="mt-4 text-sm text-ink-subtle">Last updated {LEGAL_LAST_UPDATED}</p>

        <div className="mt-8 flex items-start gap-3 rounded-md border border-line-strong bg-bg-raised p-4">
          <FileWarning className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
          <p className="text-sm leading-relaxed text-ink-muted">
            <strong className="font-semibold text-ink">Draft for review.</strong> This document is a
            starting point written for a UK-based service business. It has not been checked by a
            qualified solicitor and must be reviewed, completed and adapted to your registered
            entity, jurisdiction and insurers before launch.
          </p>
        </div>

        <div
          className="
            mt-12 flex flex-col gap-10
            [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-ink
            [&_h3]:mt-6 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-ink
            [&_p]:mt-3 [&_p]:max-w-[70ch] [&_p]:text-sm [&_p]:leading-relaxed [&_p]:text-ink-muted
            [&_ul]:mt-4 [&_ul]:flex [&_ul]:max-w-[70ch] [&_ul]:flex-col [&_ul]:gap-2.5
            [&_li]:relative [&_li]:pl-5 [&_li]:text-sm [&_li]:leading-relaxed [&_li]:text-ink-muted
            [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:top-[0.6em]
            [&_li]:before:size-1.5 [&_li]:before:rounded-full [&_li]:before:bg-accent/60
            [&_a]:text-accent [&_a]:underline [&_a]:decoration-accent/40 [&_a]:underline-offset-4
          "
        >
          {children}
        </div>

        <div className="mt-16 border-t border-line pt-8">
          <h2 className="text-sm font-semibold text-ink">Other policies</h2>
          <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
            {legalLinks
              .filter((link) => link.label !== title)
              .map((link) => (
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

          <ButtonLink href="/#free-audit" className="mt-8">
            Get Your Free Reputation Audit
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
