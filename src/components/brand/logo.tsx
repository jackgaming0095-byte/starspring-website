import { site } from "@/lib/site";

/**
 * StarSpring mark.
 *
 * One speech bubble with a four-point star knocked out of it. The star's top
 * point is stretched upward, which is where the "spring" reads from: the
 * review lifts the rating.
 *
 * Deliberately a single `evenodd` path so it stays legible at 16px favicon
 * size and can be recoloured with `currentColor`. Replace this file and
 * src/app/icon.svg together when the final identity lands.
 */
export function Mark({ className = "size-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={className}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        fill="currentColor"
        d="M9 2.5H23A7 7 0 0 1 30 9.5V19A7 7 0 0 1 23 26H16.4L10.5 30.6C9.9 31.1 9 30.7 9 29.9V26A7 7 0 0 1 2 19V9.5A7 7 0 0 1 9 2.5ZM16 5C16 14 17.5 15.5 23 15.5C17.5 15.5 16 17 16 22.5C16 17 14.5 15.5 9 15.5C14.5 15.5 16 14 16 5Z"
      />
    </svg>
  );
}

export function Logo({
  className = "",
  showDescriptor = false,
}: {
  className?: string;
  showDescriptor?: boolean;
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Mark className="size-7 shrink-0 text-accent" />
      <span className="flex flex-col leading-none">
        <span className="text-[1.0625rem] font-semibold tracking-[-0.02em] text-ink">
          {site.name}
        </span>
        {showDescriptor ? (
          <span className="mt-1 text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-ink-subtle">
            {site.descriptor}
          </span>
        ) : null}
      </span>
    </span>
  );
}
