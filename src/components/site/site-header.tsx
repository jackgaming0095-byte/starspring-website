"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { Logo } from "@/components/brand/logo";
import { ButtonLink } from "@/components/ui/button";
import { navLinks, primaryCta, site } from "@/lib/site";

import { MobileMenu } from "./mobile-menu";

/**
 * Sticky header, 64px tall, single row at every breakpoint.
 *
 * The scrolled state is driven by an IntersectionObserver on a zero-height
 * sentinel rather than a scroll listener, so nothing runs per scroll frame.
 */
export function SiteHeader() {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => setStuck(!entry.isIntersecting),
      { rootMargin: "0px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div ref={sentinelRef} aria-hidden="true" className="absolute top-0 h-px w-full" />
      <header
        className={`
          sticky top-0 w-full
          transition-[background-color,border-color,backdrop-filter] duration-200 ease-out
          ${stuck ? "border-b border-line bg-bg/85 backdrop-blur-md" : "border-b border-transparent bg-transparent"}
        `}
        style={{ zIndex: "var(--z-sticky)" }}
      >
        <div className="shell flex h-16 items-center justify-between gap-6">
          <Link href="/" aria-label={`${site.name} home`} className="shrink-0">
            <Logo />
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="
                      rounded-sm px-3 py-2 text-sm font-medium text-ink-muted
                      transition-colors duration-150 ease-out hover:text-ink
                    "
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            {/* Wrapped rather than given `hidden sm:inline-flex` directly: the
                button's own `inline-flex` is also a display utility, and which
                one wins depends on stylesheet order, not class order. */}
            <span className="hidden sm:block">
              <ButtonLink href={primaryCta.href}>{primaryCta.shortLabel}</ButtonLink>
            </span>
            <MobileMenu />
          </div>
        </div>
      </header>
    </>
  );
}
