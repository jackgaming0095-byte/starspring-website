import type { ReactNode } from "react";

import { Reveal } from "./reveal";

/**
 * Section shell. Owns the vertical rhythm and the heading block so every
 * section shares the same measure and spacing without repeating utilities.
 *
 * `eyebrow` is deliberately rationed. Only two sections on the whole page use
 * one; everywhere else the heading carries the section on its own.
 */
export function Section({
  id,
  children,
  className = "",
  tone = "base",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  tone?: "base" | "raised";
}) {
  return (
    <section
      id={id}
      className={[
        "scroll-mt-24 py-20 md:py-28",
        tone === "raised" ? "bg-bg-raised" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
  className = "",
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <Reveal
      className={[
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start",
        className,
      ].join(" ")}
    >
      {eyebrow ? (
        <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-accent">
          <span aria-hidden="true" className="h-px w-6 bg-accent/50" />
          {eyebrow}
        </span>
      ) : null}
      <h2 className="max-w-[19ch] text-title font-semibold text-ink">{title}</h2>
      {lead ? (
        <p
          className={[
            "text-base leading-relaxed text-ink-muted md:text-lg",
            align === "center" ? "max-w-[58ch]" : "max-w-[54ch]",
          ].join(" ")}
        >
          {lead}
        </p>
      ) : null}
    </Reveal>
  );
}
