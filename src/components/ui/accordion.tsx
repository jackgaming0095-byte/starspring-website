"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Plus } from "lucide-react";
import { useId, useState, type ReactNode } from "react";

import { EASE_OUT } from "@/lib/motion";

export type AccordionItem = {
  id: string;
  question: string;
  answer: ReactNode;
};

/**
 * Single-open accordion.
 *
 * Uses real <button> elements so keyboard support, focus order and screen
 * reader semantics come from the platform. The panel animates height because
 * that is what the interaction is; the icon rotation and the panel fade run on
 * transform and opacity only.
 */
export function Accordion({ items, className = "" }: { items: AccordionItem[]; className?: string }) {
  const baseId = useId();
  const [openId, setOpenId] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();

  return (
    <div className={`divide-y divide-line border-y border-line ${className}`}>
      {items.map((item) => {
        const isOpen = openId === item.id;
        const triggerId = `${baseId}-${item.id}-trigger`;
        const panelId = `${baseId}-${item.id}-panel`;

        return (
          <div key={item.id}>
            <h3>
              <button
                type="button"
                id={triggerId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenId(isOpen ? null : item.id)}
                className="
                  group flex w-full items-start justify-between gap-6 py-5 text-left
                  transition-colors duration-150 ease-out hover:text-accent
                "
              >
                <span className="text-base font-medium text-ink group-hover:text-accent md:text-lg">
                  {item.question}
                </span>
                <span
                  aria-hidden="true"
                  className="
                    mt-0.5 grid size-7 shrink-0 place-items-center rounded-sm
                    border border-line-strong text-ink-muted
                    transition-[transform,color,border-color] duration-200 ease-out
                    group-hover:border-accent/45 group-hover:text-accent
                  "
                  style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}
                >
                  <Plus className="size-4" />
                </span>
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  key="panel"
                  id={panelId}
                  role="region"
                  aria-labelledby={triggerId}
                  initial={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  animate={reduceMotion ? { opacity: 1 } : { height: "auto", opacity: 1 }}
                  exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  transition={{
                    height: { duration: isOpen ? 0.28 : 0.2, ease: EASE_OUT },
                    opacity: { duration: 0.18, ease: EASE_OUT },
                  }}
                  className="overflow-hidden"
                >
                  <p className="max-w-[68ch] pb-6 pr-10 text-[0.9375rem] leading-relaxed text-ink-muted">
                    {item.answer}
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
