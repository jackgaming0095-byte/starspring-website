"use client";

import dynamic from "next/dynamic";

/**
 * Defers the audit form's chunk (Zod + React Hook Form, ~40kB gzipped) off the
 * critical path. The skeleton reserves the form's real height so nothing
 * shifts when it mounts, and it is replaced within a frame of hydration.
 *
 * `ssr: false` is deliberate: a form is not indexable content, and keeping it
 * out of the server HTML also keeps ~14kB of markup out of the document.
 */
const AuditForm = dynamic(() => import("./audit-form").then((mod) => mod.AuditForm), {
  ssr: false,
  loading: () => <AuditFormSkeleton />,
});

function SkeletonRow({ wide = false }: { wide?: boolean }) {
  return (
    <div className={wide ? "sm:col-span-2" : ""}>
      <div className="h-4 w-24 rounded-sm bg-surface" />
      <div className={`mt-2 rounded-sm bg-surface ${wide ? "h-28" : "h-11"}`} />
    </div>
  );
}

function AuditFormSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="rounded-lg border border-line-strong bg-bg p-6 md:p-8"
    >
      <div className="grid grid-cols-1 animate-pulse gap-5 sm:grid-cols-2">
        {Array.from({ length: 8 }).map((_, index) => (
          <SkeletonRow key={index} />
        ))}
        <SkeletonRow wide />
        <div className="sm:col-span-2">
          <div className="h-4 w-full rounded-sm bg-surface" />
          <div className="mt-5 h-13 w-full rounded-sm bg-surface" />
        </div>
      </div>
      <span className="sr-only">Loading the audit request form</span>
    </div>
  );
}

export function AuditFormPanel() {
  return <AuditForm />;
}
