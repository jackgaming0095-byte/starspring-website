# StarSpring

Marketing site for StarSpring, a done-for-you reputation growth service for local businesses.

> **StarSpring helps local businesses improve their Google presence, make it easier for genuine
> customers to leave reviews, manage their reputation and get chosen more often, completely done
> for them.**

Single landing page plus four policy pages. Dark, one accent, no stock photography: every
illustration is built from HTML, CSS and SVG in `src/components/visuals`.

A **Next.js** app deployed to **Cloudflare Workers** via **[OpenNext](https://opennext.js.org/cloudflare)**
(`@opennextjs/cloudflare`) — the full Next server (App Router pages, the `/api/audit` route handler,
server-side currency) runs on a single Worker on Cloudflare's free tier. See
**[Deploying to Cloudflare Workers](#deploying-to-cloudflare-workers-opennext)**.

## Scope: what StarSpring is not

**Not a messaging or outreach platform.** This constrains the copy, the illustrations and the
privacy position, so it is worth stating plainly before you edit anything:

- We do **not** send review requests, or messages of any kind, to a client's customers.
- No WhatsApp, SMS or email campaigns. No automated follow-ups or customer sequences.
- We never upload, hold, process or contact a client's customer list.

What we do: audit and optimise the Google Business Profile, build the review assets the client's
own team puts in front of customers (branded QR cards, direct review links, printable counter and
receipt materials, website review buttons), then monitor reviews, write professional responses,
escalate serious complaints, track local visibility and report monthly.

The rule is enforced in three places: a scope note at the top of `src/lib/content.ts`, a
"Not in scope" clause in the Terms, and a "What we never collect" section in the Privacy Policy.
If you reintroduce messaging language in the copy, those three become false.

---

## Quick start

```bash
npm install
cp .env.example .env.local     # optional, everything has a safe default
npm run dev                    # http://localhost:3000 (Next dev server)
```

```bash
npm run typecheck   # tsc --noEmit
npm run lint        # eslint
npm run build       # next build
npm run cf:build    # opennextjs-cloudflare build  -> ./.open-next/worker.js
npm run preview     # build for Cloudflare, then serve it on the real Workers runtime
```

`npm run cf:build` runs the OpenNext adapter over the Next build and writes the Worker to
`.open-next/`. `npm run preview` then serves it through Wrangler, the closest local mirror of
production. To exercise the Worker's runtime variables locally (lead delivery), put them in an
untracked `.dev.vars` file (same `KEY=value` format as `.env.example`).

---

## Stack

| Piece | Choice |
| --- | --- |
| Framework | Next.js 15, App Router, React 19 |
| Language | TypeScript, strict |
| Styling | Tailwind CSS v4 (`@theme` tokens in `src/app/globals.css`) |
| Motion | Motion (`motion/react`, the current package name for Framer Motion) |
| Icons | `lucide-react` |
| Forms | React Hook Form + Zod v4 (Zod is shared by the browser and the `/api/audit` route) |
| Fonts | Geist Sans + Geist Mono, self-hosted via the `geist` package |
| Hosting | Cloudflare Workers via OpenNext (`@opennextjs/cloudflare`) |
| Tooling | Wrangler for local preview and deploy |

Server Components by default. `"use client"` appears only where an interaction genuinely needs
it: the header, the mobile menu, the currency selector, the inclusions master/detail, the audit
form, and the animated visuals. Prices are plain server-rendered HTML — no client component renders
them.

---

## Environment variables

None are required to run the site. Every one has a safe fallback. See `.env.example`. There are
two kinds:

**Build-time (Next)** — read during `next build` / `opennextjs-cloudflare build`. Set in the
Cloudflare *build* environment variables, or in `.env.local` locally.

| Variable | Effect when unset |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Falls back to `https://starspring.example`. **Set this before launch** — it drives canonical URLs, Open Graph, sitemap and robots. |

**Runtime (Worker)** — read at request time by `src/app/api/audit/route.ts`. Set in the Cloudflare
dashboard under the Worker's *Settings → Variables and Secrets*, and locally in an untracked
`.dev.vars` file.

| Variable | Effect when unset |
| --- | --- |
| `LEAD_WEBHOOK_URL` | **The route returns a 503** and tells the visitor to email instead. It never fakes success. |
| `LEAD_WEBHOOK_TOKEN` | No `Authorization` header sent with the webhook. Store as a **secret**. |
| `RATE_LIMIT_SALT` | A random per-isolate salt is generated. Set a fixed long value (**secret**) in production. |

Only `NEXT_PUBLIC_*` reaches the browser. The webhook URL and token stay on the server and are never
sent to the client.

> **Currency uses fixed prices, not an exchange-rate API.** Regional prices are edited by hand in
> `src/lib/currency/config.ts`, and geolocation is read server-side from Cloudflare's own
> `cf-ipcountry` request header. See [Currency](#currency).

---

## Connecting the lead form to a real destination

The form posts to `/api/audit`, a Next.js route handler (`src/app/api/audit/route.ts`) that runs
inside the Worker. Where a submitted request goes:

1. `LEAD_WEBHOOK_URL` set → the lead is POSTed as JSON. Works with HubSpot, Pipedrive, Zapier,
   Make, n8n, a Slack workflow, or your own endpoint.
2. `LEAD_WEBHOOK_URL` unset → **no destination**. The route answers `503` and the form shows an
   honest error with the contact email. It never reports success for a message nobody received.

Payload shape:

```json
{ "source": "starspring-free-audit", "lead": { "name": "…", "email": "…", "receivedAt": "…" } }
```

To add a provider, extend that one route handler. Nothing in the form needs to change.

### Form protections

Honeypot field, a 3-second time trap, server-side Zod validation (**the exact same schema the
browser uses**, from `src/lib/audit/schema.ts`), and a 5-per-10-minutes rate limit keyed by a
salted SHA-256 hash of the request address (via Web Crypto).
**Raw IP addresses are never stored or logged, and the lead itself is never logged.** Both spam
controls answer `200` with `delivered: false`, so an automated submission cannot learn which one
caught it.

The rate limiter is in-memory per Worker isolate — "basic" by design: it resets when an isolate
recycles and is not shared across the fleet, so it slows abuse rather than stopping a determined
attacker. To make it durable, swap the `Map` for a Cloudflare KV or Durable Object `INCR` on the
same key; nothing else changes.

---

## Currency

GBP is the canonical, billed price. The other currencies are **fixed, editable local equivalents**,
always labelled as such — there is **no exchange-rate API call anywhere**. Supported:

| Country | Currency |
| --- | --- |
| United Kingdom | GBP |
| India | INR |
| United Arab Emirates | AED |
| Everywhere else | GBP (safe fallback) |

Everything lives in one file, `src/lib/currency/config.ts` — the currency list, the
country → currency map, and the `PRICES` table. **To change a displayed local price, edit the number
there.** It never moves on its own.

### How it renders with no flicker

The server-rendered HTML contains *every* currency's price, each wrapped in a `[data-cur]` block.
CSS (`globals.css`) shows exactly one, based on the `data-currency` attribute on `<html>`. That
attribute is resolved **before first paint** in this order:

1. **The Worker, server-side** (`src/app/layout.tsx`) reads Cloudflare's own `cf-ipcountry` request
   header and renders the matching currency straight into the `<html>` tag. **Only the two-letter
   country code is used — no IP is read, derived, logged or forwarded.**
2. **A tiny inline script** in the layout then overrides that with a saved manual choice, if any,
   before the page paints.

Because the geo value is in the server HTML and the manual override runs before paint, the correct
price is the first and only price shown — no client fetch, no hydration swap. With JavaScript
disabled the server's geo choice still stands (and falls back to GBP). The manual choice is stored
in a `ss_currency` cookie and mirrored to `localStorage`; neither holds personal data.

Prices are formatted with `Intl` **decimal** style plus an explicit symbol from config, not
`style: "currency"`, so the server and browser output are byte-identical (currency-style output
depends on runtime ICU data and would mismatch).

To change the geolocation-to-currency mapping, edit the `COUNTRY_TO_CURRENCY` map in `config.ts`.

---

## Deploying to Cloudflare Workers (OpenNext)

The Next app is deployed to a single Cloudflare Worker by
[`@opennextjs/cloudflare`](https://opennext.js.org/cloudflare). Both `@opennextjs/cloudflare` and
`wrangler` are dev dependencies, so **nothing is installed dynamically during the deploy**.

**The Worker name and its self-reference must match.** `wrangler.jsonc` sets the Worker `name` to
`starspring-website` *and* binds `WORKER_SELF_REFERENCE` to the service `starspring-website` — the
same string. OpenNext calls the Worker back through that binding, so a mismatch (the bug that broke
the earlier deploy: name `starspring-website` vs service `starspring-site`) fails at runtime. If you
ever rename the Worker, change **both** values together. There is only ever one Worker.

### Option A — GitHub automatic deployments (recommended)

1. Push this repo to GitHub (remote: `starspring-website`).
2. Cloudflare dashboard → **Workers & Pages → Create → Workers → Import a repository**, pick the repo.
3. Set the **build configuration**:

   | Setting | Value |
   | --- | --- |
   | Framework preset | **Next.js** (OpenNext) |
   | **Build command** | `npm run cf:build` (`opennextjs-cloudflare build`) |
   | **Deploy command** | `npx opennextjs-cloudflare deploy` (or `npx wrangler deploy`) |
   | Root directory | *(leave blank / repo root)* |
   | Node version | `20` or newer (set `NODE_VERSION=20` in env if needed) |

4. Add **variables** (the Worker's *Settings → Variables and Secrets*, per environment):

   | Scope | Variable | Notes |
   | --- | --- | --- |
   | Build | `NEXT_PUBLIC_SITE_URL` | Your real origin, e.g. `https://starspring.co`. Drives canonical/OG/sitemap. |
   | Runtime | `LEAD_WEBHOOK_URL` | Where leads are delivered. **Unset ⇒ the form returns an honest 503.** |
   | Runtime | `LEAD_WEBHOOK_TOKEN` | Optional bearer token for the webhook. Store as a **secret**. |
   | Runtime | `RATE_LIMIT_SALT` | A long random string. Store as a **secret**. |

5. **Save and Deploy.** Every push to the production branch redeploys automatically.

### Option B — Deploy from your machine

```bash
npm run deploy   # opennextjs-cloudflare build && opennextjs-cloudflare deploy
```

Set runtime secrets with `npx wrangler secret put <NAME>`, or in the dashboard.

### Custom domain

1. Worker → **Settings → Domains & Routes → Add → Custom domain** → enter your domain.
2. If the domain is on Cloudflare the DNS record is added for you; otherwise add the `CNAME` it
   shows. TLS is provisioned automatically.
3. Set `NEXT_PUBLIC_SITE_URL` to the final `https://` domain and redeploy so canonical URLs, Open
   Graph, `sitemap.xml` and `robots.txt` point at it.

### What's in the repo for Cloudflare

| File | Purpose |
| --- | --- |
| `wrangler.jsonc` | Worker config: `name` + matching `WORKER_SELF_REFERENCE`, `nodejs_compat`, assets. |
| `open-next.config.ts` | OpenNext adapter config (`defineCloudflareConfig`). |
| `src/app/api/audit/route.ts` | The lead-form endpoint (`POST /api/audit`), running in the Worker. |
| `.dev.vars` | *(untracked)* local runtime variables for `npm run preview`. |

Security headers are sent from `next.config.ts` `headers()` — there is a real server at request
time, so no `_headers` file is needed.

---

## Design system

Tokens live in one `@theme` block in `src/app/globals.css`.

- **One locked theme.** Deep charcoal surfaces, warm off-white ink, one electric-lime accent. No
  section inverts to light; contrast between sections comes from the surface ladder
  (`bg` → `bg-raised` → `surface` → `surface-hi`).
- **Contrast.** Every ink and accent value was checked against every surface it sits on. The
  weakest pairing is `ink-subtle` on `surface` at **5.4:1**; most are above 10:1. Placeholder text
  uses `ink-subtle`, never anything lighter.
- **Radius, one rule.** 8px for controls, 12px for cards and rows, 18px for large panels.
- **Motion.** One strong ease-out for entrances (`cubic-bezier(0.23, 1, 0.32, 1)`), one ease-in-out
  for on-screen movement, springs only where something should feel physical. Buttons scale to 0.97
  on `:active`. Durations stay under 300ms for UI.

### Two rules worth knowing before you edit an animation

1. **`initial` must be constant.** It is written into the rendered style attribute, so it can never
   depend on `useReducedMotion()`, `typeof IntersectionObserver`, or anything else that differs
   between server and browser. That is a hydration mismatch. Reduced motion is handled in
   `transition` (never serialised) or in CSS. See `src/components/ui/reveal.tsx`.
2. **Reveals fail open.** Animated elements carry `data-reveal`, `data-draw` or `data-grow`, and a
   `<noscript>` block in the layout forces them to their resolved state. With JavaScript disabled
   all twelve section headings still render at full opacity. A reveal must never decide whether
   text exists on the page.

---

## Content

Almost all copy lives in `src/lib/content.ts`, with brand strings, contact details and navigation
in `src/lib/site.ts`. Editing those two files changes the page; the FAQ answers also flow straight
into the FAQ structured data, so the two can never drift.

### Honesty rules, enforced in the code and its comments

- No claim that StarSpring contacts customers. See the scope section above.
- No testimonials, client logos, case studies or performance figures anywhere. The results section
  is a designed empty state (`What we measure`) explaining the report a client receives.
  `src/components/sections/what-we-measure.tsx` documents how to add verified case studies later.
- Every illustration showing a rating, a count or a chart carries an `IllustrativeBadge`. The
  businesses in the comparison visual are invented.
- Nothing guarantees a rating, a ranking, or revenue.
- Structured data is deliberately conservative: `ProfessionalService`, `Service` and `FAQPage`
  only. **No `aggregateRating` and no `Review` markup** — self-serving review stars on your own
  marketing page breach Google's structured-data policy and would contradict the integrity section.

---

## Before launch

- [ ] Set `NEXT_PUBLIC_SITE_URL` (build) to the real domain.
- [ ] Replace the placeholder email, phone and domain in `src/lib/site.ts` (and `LEAD_CONTACT_EMAIL`).
- [ ] Configure `LEAD_WEBHOOK_URL` and `RATE_LIMIT_SALT` in the Cloudflare dashboard, then submit a
      real test request and confirm it lands in your CRM.
- [ ] Sanity-check the fixed regional prices in `src/lib/currency/config.ts` are what you want to
      display today.
- [ ] **Have a solicitor review all four policy pages.** They are drafts written for a UK service
      business and carry a visible draft notice. Each contains explicit
      "to complete before launch" markers (registered company details, ICO registration, named
      sub-processors and transfer safeguards, payment terms, liability cap).
- [ ] Replace the temporary logo. It is one path in `src/components/brand/logo.tsx`; update
      `src/app/icon.svg` and `src/app/opengraph-image.tsx` to match.

---

## Verified

`next build` **and** `opennextjs-cloudflare build` both succeed, then the built Worker was served on
the real Workers runtime (`wrangler dev` on `.open-next/worker.js`) and smoke-tested:

- `tsc --noEmit`, `eslint`, `next build`, and `opennextjs-cloudflare build` all clean.
- `wrangler deploy --dry-run` resolves the bindings — **`WORKER_SELF_REFERENCE → starspring-website`
  matches the Worker `name`** — and accepts the compatibility flags.
- **Currency (server-side geolocation, no flash):** the Worker renders the currency into the
  `<html>` tag from `cf-ipcountry` — verified GB → GBP, IN → INR (₹37,000 shown), AE → AED, US and
  no-header → GBP. Manual selection persists to cookie + localStorage and **beats geo** on reload.
  No IP is read at any point.
- **API route (`POST /api/audit`) on the Worker:** GET → 405; malformed body → 400; validation → 400
  with per-field errors; honeypot and time-trap → 200 `delivered:false`; and the honest **503 when
  no destination is configured** — it never fakes success.
- **Security headers** (`next.config` `headers()`) present on responses.
- **SEO:** `robots.txt`, `sitemap.xml`, canonical, Open Graph and Twitter tags, 1200×630 OG image,
  and FAQ structured data matching the visible questions exactly.
- Keyboard, mobile menu, reduced motion, no-JS and the positioning scan are unchanged from the
  earlier build — the website itself was not altered, only its deployment.

Not measured here: Lighthouse scores, which need a deployed URL to be meaningful. Zod and React Hook
Form are code-split out of first paint, there are no raster images above the fold, and fonts are
self-hosted, so the Core Web Vitals inputs are in good shape.
