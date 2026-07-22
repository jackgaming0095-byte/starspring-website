/**
 * Single source of truth for brand strings, contact details and navigation.
 * Everything an editor is likely to change lives here, not inside components.
 *
 * BEFORE LAUNCH: replace the placeholder domain and contact details below with
 * the real ones, and set NEXT_PUBLIC_SITE_URL in the deployment environment.
 */

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://starspring.example"
).replace(/\/$/, "");

export const site = {
  name: "StarSpring",
  descriptor: "Reputation Growth",
  tagline: "More reviews. Higher ratings. More customers.",
  title: "StarSpring | Done-for-You Google Review Growth",
  description:
    "StarSpring helps local businesses improve their Google presence, make it easier for genuine customers to leave reviews, manage their reputation and get chosen more often. Completely done for them.",
  shortDescription:
    "Done-for-you reputation growth for local businesses. A better Google presence, an easier route to genuine reviews, and a reputation that is actually managed.",
  /* Placeholder contact details. Replace before launch. */
  email: "hello@starspring.example",
  phoneDisplay: "+44 20 7946 0812",
  phoneHref: "+442079460812",
  areaServed: ["United Kingdom", "United Arab Emirates", "India"],
} as const;

export const navLinks = [
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Results", href: "/#what-we-measure" },
  { label: "Industries", href: "/#industries" },
  { label: "Pricing", href: "/#pricing" },
  { label: "FAQs", href: "/#faqs" },
] as const;

/** One label per intent. Used for every primary conversion action on the site. */
export const primaryCta = {
  label: "Get Your Free Reputation Audit",
  shortLabel: "Get Free Audit",
  href: "/#free-audit",
} as const;

export const legalLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Cookie Policy", href: "/cookie-policy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Review Integrity Policy", href: "/review-integrity-policy" },
] as const;

export const platformDisclaimer =
  "StarSpring is an independent reputation-growth service and is not affiliated with, endorsed by or sponsored by Google or any third-party review platform.";
