import type { Metadata } from "next";
import Link from "next/link";

import { LegalPage } from "@/components/legal/legal-page";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms on which StarSpring provides reputation growth services: what is included, what is billed, what we do not promise, and how either side ends it.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      summary="The terms we work under. Written to be readable, which does not make them any less binding once agreed."
    >
      <section>
        <h2>1. These terms</h2>
        <p>
          These terms apply between StarSpring and the business engaging us. They take effect when
          you accept a proposal, pay an invoice, or ask us to begin work, whichever happens first.
        </p>
        <p>
          <strong className="font-semibold text-ink">To complete before launch:</strong> registered
          company name and number, registered address, governing law and jurisdiction clause, and any
          terms your insurer or accountant requires.
        </p>
      </section>

      <section>
        <h2>2. The services</h2>
        <p>
          We provide the services set out in the plan you select and in any written scope we agree
          with you. Two plans are published:
        </p>
        <ul>
          <li>
            <strong className="font-semibold text-ink">Review Launch</strong>, a one-time setup
            charged at £350.
          </li>
          <li>
            <strong className="font-semibold text-ink">Reputation Growth</strong>, an ongoing managed
            service charged at £300 per month, which includes the initial setup.
          </li>
        </ul>
        <p>
          All work is carried out in line with our{" "}
          <Link href="/review-integrity-policy">Review Integrity Policy</Link>, which forms part of
          these terms.
        </p>
        <p>
          <strong className="font-semibold text-ink">Not in scope.</strong> StarSpring is not a
          messaging or outreach provider. We do not send review requests, run WhatsApp, SMS or email
          campaigns, operate follow-up sequences, or hold your customer contact data. We build the
          assets your team uses to ask for reviews, and we manage your profile and responses once
          reviews arrive.
        </p>
      </section>

      <section>
        <h2>3. Fees, currency and billing</h2>
        <ul>
          <li>
            GBP is the contractual currency. Prices shown on this site in other currencies are
            approximate conversions for guidance only, and the GBP figure is the one that binds.
          </li>
          <li>Invoices are issued and payable in GBP unless we agree otherwise in writing.</li>
          <li>Prices exclude VAT and any other applicable tax, which is added where it applies.</li>
          <li>
            Print production, paid advertising and third-party platform fees are separate and are
            either billed at cost or paid by you directly.
          </li>
          <li>
            Monthly fees are billed in advance. The one-time setup fee is billed before work begins
            unless agreed otherwise.
          </li>
        </ul>
        <p>
          <strong className="font-semibold text-ink">To complete before launch:</strong> payment terms
          in days, accepted payment methods, and your position on late payment interest under the
          Late Payment of Commercial Debts (Interest) Act 1998.
        </p>
      </section>

      <section>
        <h2>4. What we do not promise</h2>
        <p>
          We do not guarantee any particular rating, any particular number of reviews, any search
          ranking, any level of visibility, or any amount of revenue, enquiries or bookings. Anyone
          who does guarantee those things is either misreading the platforms or planning to break
          their rules.
        </p>
        <p>
          Results depend on your customer volume, your location, your competition, the quality of
          the service you deliver and decisions the platforms make without reference to either of us.
          Platform policies and algorithms change without notice.
        </p>
      </section>

      <section>
        <h2>5. Your responsibilities</h2>
        <ul>
          <li>
            Give us accurate business information, and tell us when it changes. You remain
            responsible for the factual accuracy of everything published on your listings.
          </li>
          <li>
            Give us the access we need to the platforms we manage, and keep that access active while
            the engagement runs.
          </li>
          <li>
            Present the review assets we build to your customers yourself. StarSpring does not
            contact your customers, and you should not send us their personal data.
          </li>
          <li>
            Respond to escalated complaints. We can reply publicly on your behalf, but we cannot
            resolve a service problem inside your business.
          </li>
          <li>Do not ask us to do anything the Review Integrity Policy forbids.</li>
        </ul>
      </section>

      <section>
        <h2>6. Cancellation</h2>
        <p>
          Reputation Growth runs month to month with no minimum term. Cancel at any time before your
          next billing date by writing to <a href={`mailto:${site.email}`}>{site.email}</a>, and the
          service ends at the close of the period you have paid for. We do not refund part-months.
        </p>
        <p>
          The one-time setup fee covers work delivered and is non-refundable once that work has
          begun.
        </p>
        <p>
          We may end an engagement, with notice and a pro-rata refund of any unused prepaid period,
          if we are asked to act against the Review Integrity Policy, if access needed to do the work
          is withdrawn, or if invoices go unpaid.
        </p>
      </section>

      <section>
        <h2>7. Ownership</h2>
        <p>
          Your Google Business Profile, your listings, your reviews and your customer relationships
          are yours throughout and after the engagement. On termination, and once outstanding
          invoices are settled, you keep the review assets we produced for you, including QR
          artwork, your direct review link, printed materials and website review-button assets.
        </p>
        <p>
          Our internal methods, templates, checklists and tooling remain ours. We may describe the
          type of work we did in general terms, but we will not name you as a client, publish your
          figures or use your logo without your written permission.
        </p>
      </section>

      <section>
        <h2>8. Liability</h2>
        <p>
          Nothing in these terms limits liability for death or personal injury caused by negligence,
          for fraud, or for anything else that cannot be limited by law.
        </p>
        <p>
          Subject to that, our total liability in connection with the services is limited to the fees
          you paid us in the twelve months before the claim arose, and we are not liable for lost
          profit, lost business, lost goodwill or indirect loss.
        </p>
        <p>
          We are not liable for decisions made by review platforms, including refusal to remove
          reported content, changes to ranking or display, or suspension of a profile for reasons
          outside our control.
        </p>
        <p>
          <strong className="font-semibold text-ink">To complete before launch:</strong> have your
          solicitor and insurer confirm this cap is appropriate and consistent with your professional
          indemnity cover.
        </p>
      </section>

      <section>
        <h2>9. Changes to these terms</h2>
        <p>
          We may update these terms and will give active clients at least 30 days&rsquo; written
          notice before a change affects them. If you do not accept a change, you may cancel before
          it takes effect.
        </p>
      </section>
    </LegalPage>
  );
}
