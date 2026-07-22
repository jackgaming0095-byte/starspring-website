/**
 * All marketing copy for the landing page.
 *
 * Editing rules for whoever maintains this file:
 *  - Never promise guaranteed rankings, ratings or revenue.
 *  - Never add a testimonial, logo, client name or performance figure that
 *    has not been verified and approved by that client in writing.
 *  - Any number shown in an illustration must be labelled as illustrative.
 *
 * SCOPE (important): StarSpring is not a messaging or outreach platform. We do
 * not send review requests, run WhatsApp or SMS campaigns, operate follow-up
 * sequences, or hold customer contact data. We build the assets the business
 * uses to ask, and we manage the reputation once reviews arrive. Copy that
 * implies otherwise is wrong, not merely off-brand.
 */

export type IconKey =
  | "utensils"
  | "scissors"
  | "dumbbell"
  | "stethoscope"
  | "home"
  | "car"
  | "wrench"
  | "store"
  | "scale"
  | "hotel";

export const outcomes = [
  {
    title: "More genuine reviews",
    body: "When the review link is already in the customer's hand, on the card, the receipt or your website, far more of the people who were happy actually follow through.",
  },
  {
    title: "A stronger rating",
    body: "As recent genuine reviews accumulate, your average tends to reflect the customers you serve well, not only the ones who complained.",
  },
  {
    title: "Better local visibility",
    body: "A complete, active, well-answered profile gives search engines more accurate signals to work with. Ranking factors are set by the platform, not by us.",
  },
  {
    title: "More calls, bookings and visits",
    body: "Reputation is read at the point of decision. A stronger profile gives people fewer reasons to scroll past you.",
  },
] as const;

export const steps = [
  {
    n: "01",
    title: "Optimise the listing",
    body: "We improve your categories, descriptions, services, hours, photos and core business information so your profile is accurate, complete and consistent.",
    points: ["Categories and services", "Descriptions and business info", "Hours, photos and attributes"],
  },
  {
    n: "02",
    title: "Build the review system",
    body: "We create branded QR codes, direct review links, printable materials and website review buttons that make it easy for genuine customers to leave honest feedback.",
    points: ["Branded QR review card", "Direct Google review link", "Printed and on-site assets"],
  },
  {
    n: "03",
    title: "Manage the reputation",
    body: "We monitor new reviews, write professional responses and escalate customer issues that require the business's attention.",
    points: ["Review monitoring", "Professional responses", "Escalation to your team"],
  },
  {
    n: "04",
    title: "Report the progress",
    body: "Every month you get a plain-English report: review volume, rating trends, response coverage and local visibility.",
    points: ["Rating and volume trend", "Response coverage", "Local visibility signals"],
  },
] as const;

/** Six boundaries, all phrased as prohibitions so the grid reads consistently. */
export const integrityPrinciples = [
  {
    title: "No purchased reviews",
    body: "We never buy reviews, and we never work with vendors who sell them.",
  },
  {
    title: "No fake customer accounts",
    body: "Every review must come from a real person who genuinely used the business.",
  },
  {
    title: "No incentives for reviews",
    body: "Discounts, vouchers and gifts are never exchanged for a positive review.",
  },
  {
    title: "No review gating",
    body: "Nobody is filtered out of the public review route because of how they might rate you.",
  },
  {
    title: "No guaranteed ratings",
    body: "We never promise a rating or a ranking. Both are decided by your customers and by the platform.",
  },
  {
    title: "No customer data with us",
    body: "We never upload, hold or contact your customers. Your customers hear from you, never from StarSpring.",
  },
] as const;

export const inclusions = [
  {
    title: "Google Business Profile audit",
    body: "A structured review of your current profile: categories, completeness, photo coverage, review history, response rate and the gaps costing you visibility.",
    tier: "both",
  },
  {
    title: "Listing optimisation",
    body: "Primary and secondary categories, services, business description, hours, attributes and imagery rewritten and organised for accuracy and relevance.",
    tier: "both",
  },
  {
    title: "Review strategy",
    body: "We map the points in your customer journey where people are happiest, then decide which asset belongs at each one so asking never feels like a chore.",
    tier: "both",
  },
  {
    title: "Branded QR review cards",
    body: "A branded QR card that opens your review page directly. Sized for counters, tables, receipts, packaging and treatment rooms.",
    tier: "both",
  },
  {
    title: "Direct review links",
    body: "A short, clean link that lands a customer straight on your review form with no menu-hunting in between. Yours to put wherever it is useful.",
    tier: "both",
  },
  {
    title: "Printable in-store materials",
    body: "Counter cards, table talkers and receipt artwork, supplied print-ready so you can run them off locally or send them to your usual printer.",
    tier: "both",
  },
  {
    title: "Website review buttons",
    body: "Ready-made review-button assets and markup for your website, thank-you page or email footer, matched to your branding.",
    tier: "both",
  },
  {
    title: "Review monitoring",
    body: "We watch for new reviews as they land, so nothing sits unanswered for weeks and nothing serious goes unnoticed.",
    tier: "growth",
  },
  {
    title: "Professional review responses",
    body: "Personalised replies to positive and negative reviews, written in your voice and posted on an agreed schedule.",
    tier: "growth",
  },
  {
    title: "Negative-feedback escalation",
    body: "A defined route for serious complaints so they reach the right person in your team quickly, while the public review stays exactly where the customer put it.",
    tier: "growth",
  },
  {
    title: "Local visibility tracking",
    body: "We track the local visibility signals we can observe over time and report movement honestly, including when it is flat.",
    tier: "growth",
  },
  {
    title: "Monthly reporting",
    body: "One clear report each month covering rating, review volume, recency, response coverage and what we are changing next.",
    tier: "growth",
  },
  {
    title: "Industry-platform support",
    body: "Google Reviews is the main platform. Where it matters for your sector we also support relevant industry platforms such as TripAdvisor and Booking.com.",
    tier: "both",
  },
] as const;

/** The moment in each sector's day when a review asset does its work. */
export const industries: ReadonlyArray<{
  name: string;
  icon: IconKey;
  moment: string;
}> = [
  { name: "Restaurants and cafés", icon: "utensils", moment: "QR on the bill." },
  { name: "Salons and spas", icon: "scissors", moment: "Card at checkout." },
  { name: "Gyms and studios", icon: "dumbbell", moment: "Link at a milestone." },
  { name: "Dentists and clinics", icon: "stethoscope", moment: "Card at discharge." },
  { name: "Estate agents", icon: "home", moment: "Link on completion." },
  { name: "Car dealerships", icon: "car", moment: "QR at handover." },
  { name: "Home services and trades", icon: "wrench", moment: "QR on the invoice." },
  { name: "Retail stores", icon: "store", moment: "QR on the receipt." },
  { name: "Legal and finance firms", icon: "scale", moment: "Link at case close." },
  { name: "Hotels and travel", icon: "hotel", moment: "Card at check-out." },
];

/**
 * The metrics every client receives in their monthly report.
 *
 * TODO (verified case studies): once a client has approved publication of
 * their real results in writing, add a `caseStudies` array here with
 * { business, sector, period, startingRating, currentRating, newReviews,
 *   responseRate, permissionRef } and render it below this section. Until then
 * this section stays an honest empty state. Do not populate it with examples.
 */
export const measuredMetrics = [
  { label: "Starting rating", hint: "Where your public average sat on day one." },
  { label: "Current rating", hint: "Where it sits today, and the direction of travel." },
  { label: "New genuine reviews", hint: "Verified reviews added since we started." },
  { label: "Review response rate", hint: "Share of reviews that received a reply." },
  { label: "Review recency", hint: "How fresh your most recent reviews are." },
  { label: "Local visibility movement", hint: "Observable movement in local visibility signals." },
  { label: "Calls and booking actions", hint: "Profile actions, where they are trackable." },
] as const;

export const faqs = [
  {
    q: "Can you guarantee a five-star rating?",
    a: "No, and you should be cautious of anyone who does. Your rating is the average of what real customers choose to say. We can make it far easier for satisfied customers to leave honest feedback, and we can make sure your profile is complete and well managed. The rating itself follows the service you deliver.",
  },
  {
    q: "Do you contact my customers?",
    a: "No. StarSpring never uploads, stores or contacts your customer list, and we do not send messages of any kind on your behalf. We build the QR cards, direct review links, printed materials and website buttons that your team puts in front of customers at the right moment. The ask always comes from you, in your own premises or on your own site.",
  },
  {
    q: "Do you create or buy reviews?",
    a: "Never. We do not write reviews, buy reviews, use review vendors or create customer accounts. Fabricated reviews breach platform policies, can get a profile suspended, and damage the trust you are trying to build. Every review the system generates comes from a real customer of yours.",
  },
  {
    q: "Do customers receive rewards for reviewing?",
    a: "No. We do not offer, and we will not help you offer, discounts, vouchers, entries into prize draws or any other incentive in exchange for a review. Incentivised reviews breach most platform policies and distort the signal that makes reviews useful in the first place.",
  },
  {
    q: "Can you remove negative reviews?",
    a: "Not on request. Only reviews that violate a platform's own content policies, for example spam, hate speech, conflicts of interest or content that is clearly not about your business, can be reported for possible removal. The platform decides the outcome, and it frequently declines. What we can do reliably is respond professionally and make sure genuine positive experiences are also represented.",
  },
  {
    q: "Which review platforms do you support?",
    a: "Google Reviews is our primary platform, because for most local businesses it carries the most weight at the point of decision. Where it is relevant to your sector we also support platforms such as TripAdvisor, Booking.com and other appropriate industry services. We are independent and not affiliated with any of them.",
  },
  {
    q: "What is included in the one-time setup?",
    a: "Review Launch covers a Google Business Profile audit, complete listing optimisation, your review-generation strategy, a branded QR review card, a direct Google review link, printable counter and receipt materials, website review-button assets, review-response templates, a negative-feedback process and a 30-day progress review.",
  },
  {
    q: "What is included in monthly management?",
    a: "Reputation Growth includes the full setup, then ongoing listing optimisation, review and rating monitoring, professional responses to new reviews, negative-feedback escalation, updates to your QR and review-link assets, local visibility tracking, a monthly performance report and continuing reputation strategy.",
  },
  {
    q: "Can I cancel the monthly service?",
    a: "Yes. Reputation Growth runs month to month with no minimum term. Cancel before your next billing date and the service ends at the close of the current period. Your Google Business Profile, your reviews and your review assets remain yours.",
  },
  {
    q: "Can you support multiple locations?",
    a: "Yes. Multi-location businesses need per-location profiles, per-location review links and reporting that separates the sites, otherwise the strong branches hide the struggling ones. Tell us how many locations you run and we will scope it in your audit.",
  },
  {
    q: "How quickly can the system be launched?",
    a: "Setup typically runs over the first two to three weeks: audit and optimisation first, then your QR cards, review links and printed assets, then launch. How fast reviews arrive after that depends on your customer volume, so a busy restaurant and a specialist law firm will see very different timelines.",
  },
] as const;

export const trustRow = ["Real customers only", "No fake reviews", "Cancel anytime"] as const;
