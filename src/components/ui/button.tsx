import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

/*
  One radius rule across the site: interactive controls are radius-sm (8px).
  Press feedback is a 0.97 scale on :active with a short ease-out, so the
  control acknowledges the press before the navigation resolves.
*/
const base =
  "inline-flex items-center justify-center gap-2 rounded-sm font-medium whitespace-nowrap " +
  "transition-[transform,background-color,border-color,color] duration-150 ease-out " +
  "active:scale-[0.97] disabled:pointer-events-none disabled:opacity-55";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-accent-ink hover:bg-accent-dim " +
    "shadow-[0_1px_0_oklch(1_0_0/0.22)_inset,0_8px_20px_-14px_oklch(0.875_0.196_123/0.35)]",
  secondary: "border border-line-strong bg-surface text-ink hover:border-accent/45 hover:bg-surface-hi",
  ghost: "text-ink-muted hover:text-ink",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-6 text-[0.9375rem]",
};

function classesFor(variant: Variant, size: Size, className?: string) {
  return [base, variants[variant], sizes[size], className].filter(Boolean).join(" ");
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
} & Omit<ComponentProps<typeof Link>, "href" | "className" | "children">) {
  return (
    <Link href={href} className={classesFor(variant, size, className)} {...rest}>
      {children}
    </Link>
  );
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: {
  variant?: Variant;
  size?: Size;
} & ComponentProps<"button">) {
  return (
    <button className={classesFor(variant, size, className)} {...rest}>
      {children}
    </button>
  );
}
