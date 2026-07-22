"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import {
  BUSINESS_TYPE_OPTIONS,
  LOCATION_OPTIONS,
  auditRequestSchema,
  type AuditRequest,
} from "@/lib/audit/schema";
import { site } from "@/lib/site";

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success" }
  | { kind: "error"; message: string };

/**
 * The audit form.
 *
 * Split out of the section so Zod, React Hook Form and the resolver load as
 * their own chunk instead of on first paint. The section around it is a
 * Server Component and ships no JavaScript at all.
 */
export function AuditForm() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const renderedAt = useRef<number>(0);
  const successRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<AuditRequest>({
    resolver: zodResolver(auditRequestSchema),
    mode: "onBlur",
  });

  // Stamped after mount so it is never part of the server HTML.
  useEffect(() => {
    renderedAt.current = Date.now();
  }, []);

  // Move focus to the confirmation so keyboard and screen reader users are
  // told the submission landed, rather than being left on a vanished form.
  useEffect(() => {
    if (status.kind === "success") successRef.current?.focus();
  }, [status.kind]);

  async function onSubmit(values: AuditRequest) {
    setStatus({ kind: "submitting" });
    try {
      const response = await fetch("/api/audit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...values, renderedAt: renderedAt.current }),
      });
      const body = (await response.json().catch(() => null)) as
        | { ok?: boolean; message?: string; fieldErrors?: Record<string, string[]> }
        | null;

      if (response.ok && body?.ok) {
        setStatus({ kind: "success" });
        reset();
        return;
      }

      // Surface server-side field errors on the fields themselves.
      if (body?.fieldErrors) {
        for (const [field, messages] of Object.entries(body.fieldErrors)) {
          if (messages?.[0] && field in values) {
            setError(field as keyof AuditRequest, { message: messages[0] });
          }
        }
      }

      setStatus({
        kind: "error",
        message:
          body?.message ??
          `Something went wrong on our side. Please email ${site.email} and we will pick it up.`,
      });
    } catch {
      setStatus({
        kind: "error",
        message: `We could not reach the server. Check your connection, or email ${site.email}.`,
      });
    }
  }

  const submitting = status.kind === "submitting";

  return (
    <div className="rounded-lg border border-line-strong bg-bg p-6 md:p-8">
      {status.kind === "success" ? (
        <div
          ref={successRef}
          tabIndex={-1}
          className="flex flex-col items-start gap-4 py-6 outline-none"
        >
          <span className="grid size-11 place-items-center rounded-sm bg-accent text-accent-ink">
            <CheckCircle2 className="size-6" aria-hidden="true" />
          </span>
          <h3 className="text-xl font-semibold text-ink">Request received.</h3>
          <p className="max-w-[46ch] text-sm leading-relaxed text-ink-muted">
            We will review your profile and reply within one working day. If it is urgent,
            email {site.email} and reference your business name.
          </p>
          <Button
            variant="secondary"
            onClick={() => setStatus({ kind: "idle" })}
            className="mt-2"
          >
            Send another request
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
          {/* Honeypot. Hidden from sight and from assistive tech, but a
              form-filling bot will still complete it. Clipped to a 1px box
              rather than pushed off-canvas, so it cannot affect layout width. */}
          <div
            aria-hidden="true"
            className="absolute size-px overflow-hidden [clip-path:inset(50%)]"
          >
            <label htmlFor="fax">Fax</label>
            <input id="fax" type="text" tabIndex={-1} autoComplete="off" {...register("fax")} />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Name" error={errors.name?.message}>
              {({ id, describedBy, invalid }) => (
                <Input
                  id={id}
                  aria-describedby={describedBy}
                  invalid={invalid}
                  autoComplete="name"
                  placeholder="Jordan Whitfield"
                  {...register("name")}
                />
              )}
            </Field>

            <Field label="Work email" error={errors.email?.message}>
              {({ id, describedBy, invalid }) => (
                <Input
                  id={id}
                  type="email"
                  aria-describedby={describedBy}
                  invalid={invalid}
                  autoComplete="email"
                  placeholder="you@yourbusiness.co.uk"
                  {...register("email")}
                />
              )}
            </Field>

            <Field
              label="Phone number"
              hint="The best number to reach you on."
              error={errors.phone?.message}
            >
              {({ id, describedBy, invalid }) => (
                <Input
                  id={id}
                  type="tel"
                  aria-describedby={describedBy}
                  invalid={invalid}
                  autoComplete="tel"
                  placeholder="+44 7700 900123"
                  {...register("phone")}
                />
              )}
            </Field>

            <Field label="Business name" error={errors.businessName?.message}>
              {({ id, describedBy, invalid }) => (
                <Input
                  id={id}
                  aria-describedby={describedBy}
                  invalid={invalid}
                  autoComplete="organization"
                  placeholder="Ashgrove Dental Practice"
                  {...register("businessName")}
                />
              )}
            </Field>

            <Field label="Website" optional error={errors.website?.message}>
              {({ id, describedBy, invalid }) => (
                <Input
                  id={id}
                  type="url"
                  aria-describedby={describedBy}
                  invalid={invalid}
                  autoComplete="url"
                  placeholder="https://yourbusiness.co.uk"
                  {...register("website")}
                />
              )}
            </Field>

            <Field
              label="Google Business Profile URL"
              optional
              hint="Skip it if you are not sure. We can find it."
              error={errors.googleProfileUrl?.message}
            >
              {({ id, describedBy, invalid }) => (
                <Input
                  id={id}
                  type="url"
                  aria-describedby={describedBy}
                  invalid={invalid}
                  placeholder="https://maps.app.goo.gl/..."
                  {...register("googleProfileUrl")}
                />
              )}
            </Field>

            <Field label="Business type" error={errors.businessType?.message}>
              {({ id, describedBy, invalid }) => (
                <Select
                  id={id}
                  aria-describedby={describedBy}
                  invalid={invalid}
                  defaultValue=""
                  {...register("businessType")}
                >
                  <option value="" disabled>
                    Choose one
                  </option>
                  {BUSINESS_TYPE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              )}
            </Field>

            <Field label="Number of locations" error={errors.locations?.message}>
              {({ id, describedBy, invalid }) => (
                <Select
                  id={id}
                  aria-describedby={describedBy}
                  invalid={invalid}
                  defaultValue=""
                  {...register("locations")}
                >
                  <option value="" disabled>
                    Choose one
                  </option>
                  {LOCATION_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              )}
            </Field>
          </div>

          <Field
            label="Current challenge"
            hint="What is actually going wrong? A couple of sentences is plenty."
            error={errors.challenge?.message}
          >
            {({ id, describedBy, invalid }) => (
              <Textarea
                id={id}
                aria-describedby={describedBy}
                invalid={invalid}
                placeholder="We get busy weekends but almost nobody leaves a review, and our last three are all from months ago."
                {...register("challenge")}
              />
            )}
          </Field>

          <div className="flex flex-col gap-2">
            <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-ink-muted">
              <input
                type="checkbox"
                aria-invalid={errors.consent ? true : undefined}
                aria-describedby={errors.consent ? "consent-error" : undefined}
                className="
                  mt-0.5 size-4 shrink-0 cursor-pointer appearance-none rounded-[4px]
                  border border-line-strong bg-surface
                  checked:border-accent checked:bg-accent
                  checked:bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 16 16%22 fill=%22none%22 stroke=%22%23111607%22 stroke-width=%223%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><path d=%22M3 8.5l3.2 3.2L13 5%22/></svg>')]
                  bg-[length:12px_12px] bg-center bg-no-repeat
                  transition-colors duration-150 ease-out
                "
                {...register("consent")}
              />
              <span>
                I agree that StarSpring may contact me about this request and store these
                details in line with the{" "}
                <Link
                  href="/privacy-policy"
                  className="text-accent underline decoration-accent/40 underline-offset-4"
                >
                  Privacy Policy
                </Link>
                .
              </span>
            </label>
            {errors.consent ? (
              <p id="consent-error" role="alert" className="text-xs font-medium text-danger">
                {errors.consent.message}
              </p>
            ) : null}
          </div>

          {status.kind === "error" ? (
            <div
              role="alert"
              className="flex items-start gap-3 rounded-sm border border-danger/50 bg-danger-wash p-3.5"
            >
              <AlertCircle className="mt-0.5 size-4 shrink-0 text-danger" aria-hidden="true" />
              <p className="text-sm leading-relaxed text-ink">{status.message}</p>
            </div>
          ) : null}

          <Button type="submit" size="lg" disabled={submitting} className="w-full">
            {submitting ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                Sending your request
              </>
            ) : (
              "Request My Free Audit"
            )}
          </Button>

          <p className="text-xs leading-relaxed text-ink-subtle">
            We use these details to prepare your audit and reply. No newsletter, no list
            sales, no sharing with third parties.
          </p>
        </form>
      )}
    </div>
  );
}
