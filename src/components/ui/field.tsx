"use client";

import { ChevronDown } from "lucide-react";
import { forwardRef, useId, type ReactNode } from "react";

/**
 * Form field primitives.
 *
 * Label, control, then hint and error underneath. The hint sits BELOW the
 * control on purpose: with it above, a field that has a hint pushes its input
 * lower than the field beside it in a two-column grid, and the inputs stop
 * lining up across the row.
 *
 * Errors are announced (`role="alert"`) and wired through `aria-describedby`,
 * and the control carries `aria-invalid` so assistive tech and the focus ring
 * agree about which field is wrong.
 *
 * Placeholder text uses --color-ink-subtle, which is 5.4:1 on the field
 * background. Never lighten it: placeholders need the same 4.5:1 as body text.
 */

const controlBase = `
  w-full rounded-sm border bg-surface px-3.5 py-3 text-sm text-ink
  placeholder:text-ink-subtle
  transition-[border-color,background-color] duration-150 ease-out
  hover:border-line-strong
  disabled:cursor-not-allowed disabled:opacity-60
`;

function controlClasses(invalid?: boolean) {
  return `${controlBase} ${invalid ? "border-danger bg-danger-wash" : "border-line-strong"}`;
}

export function Field({
  label,
  hint,
  error,
  optional,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  /** Receives the ids to wire onto the control. */
  children: (ids: { id: string; describedBy: string | undefined; invalid: boolean }) => ReactNode;
}) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="flex items-baseline gap-2 text-sm font-medium text-ink">
        {label}
        {optional ? <span className="text-xs font-normal text-ink-subtle">Optional</span> : null}
      </label>

      {children({ id, describedBy, invalid: Boolean(error) })}

      {hint ? (
        <p id={hintId} className="text-xs leading-relaxed text-ink-subtle">
          {hint}
        </p>
      ) : null}

      {error ? (
        <p id={errorId} role="alert" className="text-xs font-medium text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export const Input = forwardRef<HTMLInputElement, React.ComponentProps<"input"> & { invalid?: boolean }>(
  function Input({ invalid, className = "", ...rest }, ref) {
    return (
      <input
        ref={ref}
        aria-invalid={invalid || undefined}
        className={`${controlClasses(invalid)} ${className}`}
        {...rest}
      />
    );
  },
);

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea"> & { invalid?: boolean }
>(function Textarea({ invalid, className = "", ...rest }, ref) {
  return (
    <textarea
      ref={ref}
      aria-invalid={invalid || undefined}
      className={`${controlClasses(invalid)} min-h-28 resize-y ${className}`}
      {...rest}
    />
  );
});

export const Select = forwardRef<
  HTMLSelectElement,
  React.ComponentProps<"select"> & { invalid?: boolean }
>(function Select({ invalid, className = "", children, ...rest }, ref) {
  return (
    <div className="relative">
      <select
        ref={ref}
        aria-invalid={invalid || undefined}
        className={`${controlClasses(invalid)} appearance-none pr-10 ${className}`}
        {...rest}
      >
        {children}
      </select>
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-ink-subtle"
      />
    </div>
  );
});
