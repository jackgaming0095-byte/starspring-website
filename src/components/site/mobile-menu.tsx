"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Menu, X } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";

import { ButtonLink } from "@/components/ui/button";
import { EASE_OUT } from "@/lib/motion";
import { navLinks, primaryCta } from "@/lib/site";

const FOCUSABLE = 'a[href], button:not([disabled]), select, [tabindex]:not([tabindex="-1"])';

/**
 * Mobile navigation.
 *
 * Behaves as a modal dialog: focus moves into the panel on open, Tab is
 * trapped inside it, Escape closes it, background scroll is locked, and focus
 * returns to the trigger on close.
 */
export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const reduceMotion = useReducedMotion();

  const close = useCallback(() => setOpen(false), []);

  // Lock background scroll while the panel is open.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Focus management: move in on open, trap Tab, restore on close.
  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    if (!panel) return;

    // Captured now, not in cleanup: by teardown the ref may point elsewhere.
    const trigger = triggerRef.current;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const first = panel.querySelector<HTMLElement>(FOCUSABLE);
    first?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== "Tab") return;

      const nodes = Array.from(panel!.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (node) => node.offsetParent !== null,
      );
      if (nodes.length === 0) return;

      const firstNode = nodes[0];
      const lastNode = nodes[nodes.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && (active === firstNode || !panel!.contains(active))) {
        event.preventDefault();
        lastNode.focus();
      } else if (!event.shiftKey && active === lastNode) {
        event.preventDefault();
        firstNode.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      (previouslyFocused ?? trigger)?.focus?.();
    };
  }, [open, close]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((value) => !value)}
        className="
          grid size-10 place-items-center rounded-sm border border-line-strong
          text-ink transition-[transform,border-color] duration-150 ease-out
          active:scale-[0.97] lg:hidden
        "
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>

      <AnimatePresence>
        {open ? (
          <>
            <motion.div
              key="backdrop"
              className="fixed inset-0 bg-bg/80 backdrop-blur-sm lg:hidden"
              style={{ zIndex: "var(--z-menu-backdrop)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18, ease: EASE_OUT }}
              onClick={close}
            />
            <motion.div
              key="panel"
              ref={panelRef}
              id={panelId}
              role="dialog"
              aria-modal="true"
              aria-label="Site menu"
              className="
                fixed inset-x-3 top-[4.5rem] rounded-lg border border-line-strong
                bg-bg-raised p-4 shadow-[0_30px_80px_-30px_oklch(0_0_0/0.9)] lg:hidden
              "
              style={{ zIndex: "var(--z-menu)" }}
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.98 }}
              animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.2, ease: EASE_OUT }}
            >
              <nav aria-label="Primary">
                <ul className="flex flex-col">
                  {navLinks.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        onClick={close}
                        className="
                          block rounded-sm px-3 py-3 text-base font-medium text-ink
                          transition-colors duration-150 ease-out hover:bg-surface
                        "
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="mt-3 border-t border-line pt-4">
                <ButtonLink href={primaryCta.href} size="lg" className="w-full" onClick={close}>
                  {primaryCta.shortLabel}
                </ButtonLink>
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
