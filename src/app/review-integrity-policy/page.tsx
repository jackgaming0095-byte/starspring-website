import type { Metadata } from "next";

import { LegalPage } from "@/components/legal/legal-page";
import { platformDisclaimer, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Review Integrity Policy",
  description:
    "How StarSpring generates reviews: genuine customers only, no purchased or fabricated reviews, no incentives, and no gating of the public review route.",
  alternates: { canonical: "/review-integrity-policy" },
};

export default function ReviewIntegrityPolicyPage() {
  return (
    <LegalPage
      title="Review Integrity Policy"
      summary="The rules we work to on every account, and the rules we expect clients to work to alongside us. This is the policy we will point at if we ever have to refuse a request."
    >
      <section>
        <h2>1. Reviews must come from genuine customers</h2>
        <p>
          Every review we help generate must come from a real person who genuinely used the
          client&rsquo;s product or service. We do not solicit reviews from staff, friends, family,
          suppliers, contractors or anyone else who has not been a customer.
        </p>
        <p>
          We do not operate lists. StarSpring never receives, uploads or contacts a client&rsquo;s
          customers, so a review can only ever come from someone who was physically in front of one
          of our assets: a QR card, a printed prompt, a direct link or a button on the client&rsquo;s
          own website.
        </p>
      </section>

      <section>
        <h2>2. Reviews cannot be purchased or fabricated</h2>
        <p>We do not, under any circumstances:</p>
        <ul>
          <li>Write reviews on behalf of a customer or a client</li>
          <li>Buy reviews, or work with any vendor that sells them</li>
          <li>Create, control or use customer accounts to post reviews</li>
          <li>Edit, rephrase or embellish the words a customer chooses to write</li>
        </ul>
        <p>
          Fabricated reviews breach the content policies of every major platform, expose the client
          to profile suspension and regulatory action, and destroy the trust the whole exercise
          exists to build.
        </p>
      </section>

      <section>
        <h2>3. Customers cannot be paid or rewarded for positive reviews</h2>
        <p>
          We do not offer, and we will not help a client offer, money, discounts, credit, free
          products, upgrades, prize-draw entries, loyalty points or any other benefit in exchange
          for a review, or in exchange for a review of a particular rating.
        </p>
        <p>
          A general thank-you extended to all customers regardless of whether they reviewed, and
          regardless of what they said, is not an incentive. An offer that is conditional on
          reviewing, or on reviewing favourably, is. If a client wants to run something that sits
          close to that line, we will ask them to run it past their own legal advice first, and we
          will decline to operate it if it does not clearly fall on the right side.
        </p>
      </section>

      <section>
        <h2>4. Public review access is never withheld based on sentiment</h2>
        <p>
          Review gating means showing the public review link only to customers who indicate they are
          happy, and diverting everyone else to a private form. We do not do it, and we will not
          build it.
        </p>
        <p>
          Every asset we build points at the same public review route for every customer, with no
          screening question in front of it and no branching based on how someone is expected to
          rate the business.
        </p>
      </section>

      <section>
        <h2>5. Complaints may be routed for support, but never instead of the public route</h2>
        <p>
          It is legitimate, and usually good practice, to give an unhappy customer an easy way to
          reach a manager. We will build that route where a client wants one.
        </p>
        <p>
          What we will not do is present it as an alternative to reviewing, place it in front of the
          review link as a filter, or word it so that a customer believes the private route is their
          only option. Support and public review are offered side by side, and the customer chooses.
        </p>
      </section>

      <section>
        <h2>6. Only policy-violating content may be reported for removal</h2>
        <p>
          We do not remove negative reviews, and we cannot arrange for a platform to remove one
          simply because a client dislikes it or disputes it.
        </p>
        <p>
          Where content appears to breach a platform&rsquo;s published policies, for example spam,
          content unrelated to the business, hate speech, personal information, or a review posted by
          a competitor, we will report it through that platform&rsquo;s normal process. The platform
          decides the outcome. It frequently declines, and we will tell the client when it does.
        </p>
      </section>

      <section>
        <h2>7. Clients remain responsible for service quality and factual accuracy</h2>
        <p>
          We can make it easier for satisfied customers to speak up. We cannot make customers
          satisfied. The rating a business ends up with reflects the service it actually delivers.
        </p>
        <p>
          Clients are responsible for the accuracy of the business information they give us, for the
          services and prices published on their listings, and for the substance of any reply we post
          in their name. We will raise anything that looks inaccurate, but we cannot verify it for
          them.
        </p>
      </section>

      <section>
        <h2>8. What happens when this policy is tested</h2>
        <p>
          If a client asks us to do something this policy forbids, we will explain why we are
          declining and offer the compliant alternative. If the request is repeated, we will end the
          engagement. We would rather lose the account than build something that gets a client&rsquo;s
          profile suspended.
        </p>
        <p>
          If you believe an account managed by us has breached this policy, write to{" "}
          <a href={`mailto:${site.email}`}>{site.email}</a> and we will investigate.
        </p>
      </section>

      <section>
        <h2>9. Platform independence</h2>
        <p>{platformDisclaimer}</p>
        <p>
          Platform policies change, and where they do, they take precedence over anything written
          here. We work to whichever standard is stricter.
        </p>
      </section>
    </LegalPage>
  );
}
