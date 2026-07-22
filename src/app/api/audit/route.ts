import { NextResponse } from "next/server";
import { z } from "zod";

import { resolveDestination } from "@/lib/audit/destinations";
import { auditRequestSchema, type AuditLead } from "@/lib/audit/schema";
import { clientKey, hit } from "@/lib/rate-limit";
import { site } from "@/lib/site";

/** Node runtime: the development file adapter needs the filesystem. */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RATE_LIMIT = { limit: 5, windowMs: 10 * 60 * 1000 };
const MIN_FILL_MS = 3000;

export async function POST(request: Request) {
  const key = clientKey(request.headers);
  const limit = hit(key, RATE_LIMIT);
  if (!limit.allowed) {
    return NextResponse.json(
      {
        ok: false,
        message: "That is a few requests in a short time. Try again shortly.",
      },
      { status: 429, headers: { "retry-after": String(limit.retryAfter) } },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Malformed request." }, { status: 400 });
  }

  const parsed = auditRequestSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        message: "Some fields need another look.",
        fieldErrors: z.flattenError(parsed.error).fieldErrors,
      },
      { status: 400 },
    );
  }

  const { fax, renderedAt, ...data } = parsed.data;

  // Honeypot: a hidden field only an automated filler would complete.
  // Time trap: a genuine person cannot read and complete this form in 3s.
  // Both return 200 so a bot cannot tell which control caught it, but nothing
  // is delivered and nothing is stored.
  const tooFast = typeof renderedAt === "number" && Date.now() - renderedAt < MIN_FILL_MS;
  if (fax || tooFast) {
    return NextResponse.json({ ok: true, delivered: false }, { status: 200 });
  }

  const destination = resolveDestination();
  if (!destination) {
    // No CRM or webhook is configured, so this request cannot be delivered.
    // Say so rather than showing a success state for a message nobody receives.
    return NextResponse.json(
      {
        ok: false,
        message: `We could not submit that automatically. Please email ${site.email} and we will pick it up straight away.`,
      },
      { status: 503 },
    );
  }

  const lead: AuditLead = { ...data, receivedAt: new Date().toISOString() };
  const result = await destination.deliver(lead);

  if (!result.ok) {
    // Log the failure reason for operators; never log the lead itself.
    console.error(`[audit] delivery via ${destination.name} failed: ${result.reason}`);
    return NextResponse.json(
      {
        ok: false,
        message: `We could not submit that automatically. Please email ${site.email} and we will pick it up straight away.`,
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, delivered: true }, { status: 200 });
}
