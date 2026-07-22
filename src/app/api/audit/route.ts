import { NextResponse } from "next/server";
import { z } from "zod";

import { auditRequestSchema, type AuditLead } from "@/lib/audit/schema";
import { site } from "@/lib/site";

/**
 * Free-audit form endpoint (POST /api/audit).
 *
 * Runs inside the Cloudflare Worker via OpenNext. Written against Web-standard
 * APIs (Web Crypto, fetch) so it needs no Node built-ins. Contract:
 *   - server-side validation with the SAME Zod schema the browser uses
 *   - honeypot + time-trap, both answering 200 so a bot cannot learn which
 *     control caught it, while nothing is delivered or stored
 *   - basic in-memory rate limiting, keyed by a salted hash of the address
 *   - an honest 503 when no delivery destination is configured — it NEVER
 *     reports success for a request nobody received
 *
 * PRIVACY: the caller's IP is hashed with a salt for the rate-limit bucket and
 * is never stored or logged in raw form. The lead itself is never logged.
 */

// Node-compatible runtime (nodejs_compat is enabled in wrangler.jsonc). Dynamic
// so the handler always runs per request rather than being cached.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RATE_LIMIT = { limit: 5, windowMs: 10 * 60 * 1000 };
const MIN_FILL_MS = 3000;

/* ---- Rate limiting -------------------------------------------------------
   In-memory, per-isolate fixed window. "Basic" by design: it resets when the
   isolate recycles and is not shared across the fleet, so it slows abuse rather
   than stopping a determined attacker. Swap this Map for a Cloudflare KV or
   Durable Object INCR to make it durable; nothing else changes.
*/
const buckets = new Map<string, { count: number; resetAt: number }>();

/** Per-isolate fallback salt, built lazily (never at module/global scope). */
let fallbackSalt: string | null = null;
function resolveSalt(): string {
  const configured = process.env.RATE_LIMIT_SALT;
  if (configured) return configured;
  if (!fallbackSalt) fallbackSalt = crypto.randomUUID();
  return fallbackSalt;
}

function prune(now: number) {
  if (buckets.size < 500) return;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

function hit(key: string): { allowed: boolean; retryAfter: number } {
  const now = Date.now();
  prune(now);
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + RATE_LIMIT.windowMs });
    return { allowed: true, retryAfter: 0 };
  }
  bucket.count += 1;
  const retryAfter = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));
  return { allowed: bucket.count <= RATE_LIMIT.limit, retryAfter };
}

async function clientKey(headers: Headers): Promise<string> {
  const address =
    headers.get("cf-connecting-ip") ||
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    "";
  if (!address) return "anonymous";
  const data = new TextEncoder().encode(`${resolveSalt()}:${address}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 32);
}

export async function POST(request: Request) {
  const key = await clientKey(request.headers);
  const limit = hit(key);
  if (!limit.allowed) {
    return NextResponse.json(
      { ok: false, message: "That is a few requests in a short time. Try again shortly." },
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

  // Honeypot: a hidden field only an automated filler completes.
  // Time trap: a genuine person cannot read and complete the form in 3s.
  // Both answer 200 so a bot cannot tell which control caught it, but nothing
  // is delivered and nothing is stored.
  const tooFast = typeof renderedAt === "number" && Date.now() - renderedAt < MIN_FILL_MS;
  if (fax || tooFast) {
    return NextResponse.json({ ok: true, delivered: false }, { status: 200 });
  }

  const webhook = process.env.LEAD_WEBHOOK_URL;
  if (!webhook) {
    // No destination configured, so this request cannot be delivered. Say so
    // rather than showing success for a message nobody receives.
    return NextResponse.json(
      {
        ok: false,
        message: `We could not submit that automatically. Please email ${site.email} and we will pick it up straight away.`,
      },
      { status: 503 },
    );
  }

  const lead: AuditLead = { ...data, receivedAt: new Date().toISOString() };

  try {
    const delivery = await fetch(webhook, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(process.env.LEAD_WEBHOOK_TOKEN
          ? { authorization: `Bearer ${process.env.LEAD_WEBHOOK_TOKEN}` }
          : {}),
      },
      body: JSON.stringify({ source: "starspring-free-audit", lead }),
      // A hung CRM must not hold the visitor's browser open.
      signal: AbortSignal.timeout(8000),
    });
    if (!delivery.ok) {
      // Log the status for operators; never log the lead itself.
      console.error(`[audit] webhook responded ${delivery.status}`);
      return NextResponse.json(
        {
          ok: false,
          message: `We could not submit that automatically. Please email ${site.email} and we will pick it up straight away.`,
        },
        { status: 502 },
      );
    }
  } catch (error) {
    console.error(`[audit] webhook request failed: ${error instanceof Error ? error.message : "unknown"}`);
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

export async function GET() {
  return NextResponse.json({ ok: false, message: "Method Not Allowed" }, {
    status: 405,
    headers: { allow: "POST" },
  });
}
