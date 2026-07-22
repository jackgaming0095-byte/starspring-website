import { defineCloudflareConfig } from "@opennextjs/cloudflare";

/**
 * OpenNext → Cloudflare Workers adapter config.
 *
 * Defaults are deliberate: the site is a marketing front-end with one dynamic
 * API route and per-request currency, so it needs no incremental/ISR cache
 * backend, tag cache or durable queue. Add `incrementalCache`, `queue` or
 * `tagCache` here later if the app starts using ISR or `revalidateTag`.
 *
 * The Worker name and its WORKER_SELF_REFERENCE binding live in wrangler.jsonc
 * and must stay in step (both "starspring-website").
 */
export default defineCloudflareConfig();
