/**
 * Marks a visual whose numbers are invented for demonstration.
 *
 * Every illustration on this site that shows a rating, a review count, a chart
 * or a business name must carry one of these. No figure anywhere on the page
 * represents a real client result.
 */
export function IllustrativeBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`
        inline-flex shrink-0 items-center rounded-sm border border-line-strong
        bg-surface px-2 py-1 text-[0.625rem] font-medium uppercase
        tracking-[0.12em] text-ink-subtle ${className}
      `}
    >
      Illustrative example
    </span>
  );
}
