import { createHash, randomBytes } from "node:crypto";

/**
 * Fixed-window rate limiter.
 *
 * In-process only, which is the right level for a single form on a marketing
 * site. It resets on cold start and is not shared between serverless
 * instances, so it slows abuse rather than stopping a determined attacker. To
 * make it durable, replace `hit()` with a Redis INCR + EXPIRE against the same
 * key. Nothing else needs to change.
 *
 * PRIVACY: the caller's IP is hashed with a salt and never stored or logged in
 * raw form. The hash is one-way and the bucket is discarded on expiry.
 */

const buckets = new Map<string, { count: number; resetAt: number }>();

/** Per-process fallback salt so hashes are not comparable across deployments. */
const SALT = process.env.RATE_LIMIT_SALT ?? randomBytes(16).toString("hex");

function prune(now: number) {
  if (buckets.size < 500) return;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

/**
 * Derives a stable, non-reversible key from request headers.
 * Returns a constant key when no address header is present, which means
 * unknown clients share one bucket rather than bypassing the limit entirely.
 */
export function clientKey(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const address = forwarded || headers.get("x-real-ip") || headers.get("cf-connecting-ip") || "";
  if (!address) return "anonymous";
  return createHash("sha256").update(`${SALT}:${address}`).digest("hex").slice(0, 32);
}

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  /** Seconds until the window resets. */
  retryAfter: number;
};

export function hit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number },
): RateLimitResult {
  const now = Date.now();
  prune(now);

  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, retryAfter: 0 };
  }

  bucket.count += 1;
  const retryAfter = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));

  if (bucket.count > limit) {
    return { allowed: false, remaining: 0, retryAfter };
  }
  return { allowed: true, remaining: limit - bucket.count, retryAfter };
}
