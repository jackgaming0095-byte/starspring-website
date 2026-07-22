# StarSpring

Marketing site for StarSpring, a done-for-you reputation growth service for local businesses.

> **StarSpring helps local businesses improve their Google presence, make it easier for genuine
> customers to leave reviews, manage their reputation and get chosen more often, completely done
> for them.**

Single landing page plus four policy pages. Dark, one accent, no stock photography: every
illustration is built from HTML, CSS and SVG in `src/components/visuals`.

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
npm run dev                    # http://localhost:3000
```

```bash
npm run typecheck              # tsc --noEmit
npm run lint                   # eslint
npm run build && npm run start # production
```

---

## Stack

| Piece | Choice |
| --- | --- |
| Framework | Next.js 15, App Router, React 19 |
| Language | TypeScript, strict |
| Styling | Tailwind CSS v4 (`@theme` tokens in `src/app/globals.css`) |
| Motion | Motion (`motion/react`, the current package name for Framer Motion) |
| Icons | `lucide-react` |
| Forms | React Hook Form + Zod v4 |
| Fonts | Geist Sans + Geist Mono, self-hosted via the `geist` package |

Server Components by default. `"use client"` appears only where an interaction genuinely needs
it: the header, the mobile menu, the currency provider and selector, the inclusions master/detail,
the pricing prices, the audit form, and the animated visuals.

---

## Environment variables

None are required to run the site. Every one has a safe fallback. See `.env.example`.

| Variable | Effect when unset |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Falls back to `https://starspring.example`. **Set this before launch** — it drives canonical URLs, Open Graph, sitemap and robots. |
| `LEAD_WEBHOOK_URL` | Development writes leads to `.data/leads.jsonl`. **Production returns a 503** and tells the visitor to email instead. |
| `LEAD_WEBHOOK_TOKEN` | No `Authorization` header sent with the webhook. |
| `EXCHANGE_RATE_API_KEY` | Uses the keyless `open.er-api.com` endpoint. |
| `RATE_LIMIT_SALT` | A random per-process salt is generated. Set a fixed one in production. |
| `GEO_COUNTRY_OVERRIDE` | Real platform geo headers are used. Set to `IN`, `AE`, `US`, `DE`… to test currency locally. |

Only `NEXT_PUBLIC_*` reaches the browser. The FX key and webhook token stay server-side.

---

## Connecting the lead form to a real destination

`src/lib/audit/destinations.ts` resolves where a submitted audit request goes:

1. `LEAD_WEBHOOK_URL` set → the lead is POSTed as JSON. Works with HubSpot, Pipedrive, Zapier,
   Make, n8n, a Slack workflow, or your own endpoint.
2. Development with no webhook → appended to `.data/leads.jsonl` (gitignored).
3. Production with no webhook → **no destination**. The route answers `503` and the form shows an
   honest error with the contact email. It never reports success for a message nobody received.

Payload shape:

```json
{ "source": "starspring-free-audit", "lead": { "name": "…", "email": "…", "receivedAt": "…" } }
```

To add a provider, write another `LeadDestination` in that file and return it from
`resolveDestination()`. Nothing in the route or the form needs to change.

### Form protections

Honeypot field, a 3-second time trap, server-side Zod validation (the same schema the browser
uses), and a 5-per-10-minutes rate limit keyed by a salted SHA-256 hash of the request address.
**Raw IP addresses are never stored or logged.** Both spam controls answer `200` with
`delivered: false`, so an automated submission cannot learn which one caught it.

The rate limiter (`src/lib/rate-limit.ts`) is in-process, so it resets on cold start and is not
shared between serverless instances. Swap `hit()` for a Redis `INCR` + `EXPIRE` on the same key to
make it durable; nothing else changes.

---

## Currency

GBP is the canonical price. Everything else is an approximate conversion, always labelled as such,
and invoices are stated as issued in GBP.

```
src/lib/currency/
  config.ts   supported currencies, country -> currency map, rounding steps
  geo.ts      country detection, provider-abstracted
  rates.ts    FX retrieval, provider-abstracted, cached, degrades to GBP
  format.ts   safe formatting
  server.ts   resolves the currency for a request
```

**Resolution order:** explicit user choice (cookie) → coarse geo → GBP.

Resolved on the **server**, so the first paint already shows the right price and nothing flickers
during hydration. This is why `/` is server-rendered per request while the four policy pages stay
static.

- **Geo** reads only the country code the hosting edge already resolved (`x-vercel-ip-country`,
  `cf-ipcountry`, `cloudfront-viewer-country`, Netlify's `x-nf-geo`). No IP is read, derived,
  logged or sent to a third-party lookup service.
- **Rates** come from `open.er-api.com` by default, or the keyed `exchangerate-api.com` endpoint
  when `EXCHANGE_RATE_API_KEY` is set. Cached 12 hours through Next's fetch cache plus an
  in-process last-known-good table, so a transient upstream failure serves the previous rates
  rather than collapsing to GBP mid-session. If nothing is available the site shows GBP only and
  the selector hides itself. Rates are never hard-coded.
- **The user's choice** is stored in a `ss_currency` cookie (authoritative, so the server can
  render it) and mirrored to `localStorage`. Neither holds personal data.
- Formatting uses `Intl` **decimal** style with an explicit symbol from our own config, not
  `style: "currency"`. Currency-style output depends on the runtime's ICU data, which differs
  between Node and browsers and causes hydration mismatches.

To swap either provider, implement `GeoProvider` or `RatesProvider` and return it from
`getGeoProvider()` / `getProviders()`.

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

- [ ] Set `NEXT_PUBLIC_SITE_URL` to the real domain.
- [ ] Replace the placeholder email, phone and domain in `src/lib/site.ts`.
- [ ] Configure `LEAD_WEBHOOK_URL` (and `RATE_LIMIT_SALT`), then submit a real test request.
- [ ] **Have a solicitor review all four policy pages.** They are drafts written for a UK service
      business and carry a visible draft notice. Each contains explicit
      "to complete before launch" markers (registered company details, ICO registration, named
      sub-processors and transfer safeguards, payment terms, liability cap).
- [ ] Replace the temporary logo. It is one path in `src/components/brand/logo.tsx`; update
      `src/app/icon.svg` and `src/app/opengraph-image.tsx` to match.

---

## Verified

Checked against a production build in Chromium:

- Production build, `tsc --noEmit` and `eslint` all clean.
- **No console errors and no hydration mismatches** at 360, 390, 414, 768, 1024, 1280 and 1440px.
- **No horizontal overflow** at any of those widths, on all five pages. Checked per element rather
  than by document scroll width, because `overflow-x: clip` on `body` hides real overflow.
- **Keyboard:** skip link is the first tab stop, every nav item reachable, visible focus ring.
- **Mobile menu:** opens as a dialog, focus moves in, Tab is trapped, Escape closes, focus returns
  to the trigger.
- **Reduced motion:** no errors, all in-viewport content opaque, scroll rail forced to full.
- **No JavaScript:** all twelve section headings render, nothing left faded.
- **Currency:** GB → £350, IN → ₹45,100, AE → AED 1,720, US → $470, DE → €410, unmapped (JP) →
  £350. Server HTML matches the client render. Manual selection switches instantly, persists to
  cookie and localStorage, survives reload, and is honoured server-side. An invalid cookie falls
  back to GBP. Provider chaining verified with a deliberately bad API key.
- **API:** validation, per-field errors, honeypot, time trap, rate limiting, webhook delivery with
  bearer token, dev file adapter, and the honest 503 when production has no destination configured.
- **Form:** client validation blocks empty submits, errors wired via `aria-describedby`, success
  state moves focus to the confirmation.
- **SEO:** robots, sitemap, canonical, Open Graph and Twitter tags, 1200×630 OG image, and FAQ
  structured data matching the visible questions exactly.
- No dead links or dead anchors.
- **Positioning:** an automated scan of the rendered text on all five pages finds zero unqualified
  uses of "WhatsApp", "SMS", "campaign", "follow-up sequence", "messaging cost" or "review
  request". The homepage contains none at all; the only occurrences anywhere are inside explicit
  denials in the Terms, Privacy and Cookie policies.

Not measured here: Lighthouse scores, which need a deployed URL to be meaningful. The homepage
ships ~157kB of gzipped JavaScript to a modern browser (Zod and React Hook Form are code-split out
of first paint), the HTML is fully server-rendered, there are no raster images above the fold, and
fonts are self-hosted, so the Core Web Vitals inputs are in good shape.
