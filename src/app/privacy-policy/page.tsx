import type { Metadata } from "next";
import Link from "next/link";

import { LegalPage } from "@/components/legal/legal-page";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "What personal data StarSpring collects, why we collect it, how long we keep it and the rights you have over it.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      summary="What we collect, why we collect it, how long we keep it, and what you can ask us to do with it."
    >
      <section>
        <h2>1. Who we are</h2>
        <p>
          StarSpring provides done-for-you reputation growth services to local businesses. For the
          personal data described in this policy, StarSpring is the data controller.
        </p>
        <p>
          <strong className="font-semibold text-ink">To complete before launch:</strong> registered
          company name, company number, registered office address, ICO registration number, and the
          name and contact details of the person responsible for data protection enquiries.
        </p>
        <p>
          Contact for any privacy question or request: <a href={`mailto:${site.email}`}>{site.email}</a>.
        </p>
      </section>

      <section>
        <h2>2. What we collect</h2>
        <h3>When you request a free audit</h3>
        <ul>
          <li>Your name</li>
          <li>Your work email address</li>
          <li>Your phone number</li>
          <li>Your business name, and optionally your website and Google Business Profile address</li>
          <li>Your business type and number of locations</li>
          <li>The description of your current challenge that you choose to write</li>
          <li>The date and time of the request, and the fact that you gave consent</li>
        </ul>

        <h3>When you become a client</h3>
        <ul>
          <li>Business and billing contact details</li>
          <li>Access credentials or delegated permissions for the platforms we manage on your behalf</li>
          <li>Correspondence between us</li>
        </ul>

        <h3>When you browse this website</h3>
        <ul>
          <li>
            A coarse country code, supplied by our hosting provider, used only to choose which
            currency to display. We do not receive, store or log your IP address for this purpose.
          </li>
          <li>
            Your manual currency choice, if you make one, stored in your own browser as a cookie and
            in local storage.
          </li>
          <li>
            Standard server and security logs kept by our hosting provider. These may include IP
            addresses and are retained under that provider&rsquo;s own retention schedule.
          </li>
        </ul>
        <p>
          This site does not run advertising trackers, social pixels or cross-site profiling. See the{" "}
          <Link href="/cookie-policy">Cookie Policy</Link> for the full list.
        </p>

        <h3>What we never collect</h3>
        <p>
          <strong className="font-semibold text-ink">
            We do not ask for, upload, store or process your customers&rsquo; personal data.
          </strong>{" "}
          StarSpring does not send messages, emails or review requests to your customers, and we do
          not operate any messaging or campaign tooling. We build the QR cards, review links,
          printed materials and website buttons that your own team puts in front of customers. That
          means we are not a processor of your customer data, and there is nothing of theirs for us
          to lose.
        </p>
      </section>

      <section>
        <h2>3. Why we process it, and on what basis</h2>
        <ul>
          <li>
            <strong className="font-semibold text-ink">To answer an audit request.</strong> Basis:
            your consent, given by ticking the consent box, and our legitimate interest in
            responding to a business enquiry.
          </li>
          <li>
            <strong className="font-semibold text-ink">To deliver the service.</strong> Basis:
            performance of our contract with you.
          </li>
          <li>
            <strong className="font-semibold text-ink">To keep records and meet tax obligations.</strong>{" "}
            Basis: legal obligation.
          </li>
          <li>
            <strong className="font-semibold text-ink">To keep the site and the enquiry form working.</strong>{" "}
            Basis: legitimate interest in security and abuse prevention. Rate limiting uses a
            one-way hash of the requesting address and never stores the address itself.
          </li>
        </ul>
      </section>

      <section>
        <h2>4. Who we share it with</h2>
        <p>
          We do not sell personal data, and we do not share it for anyone else&rsquo;s marketing. We
          share it only with the suppliers needed to run the service, each under a written agreement:
        </p>
        <ul>
          <li>Our website hosting and infrastructure provider</li>
          <li>The customer relationship or email system we use to handle enquiries</li>
          <li>Our accountants, and our professional advisers where necessary</li>
        </ul>
        <p>
          <strong className="font-semibold text-ink">To complete before launch:</strong> name each
          supplier, state where it processes data, and record the transfer safeguards where any
          processing happens outside the UK or EEA.
        </p>
      </section>

      <section>
        <h2>5. How long we keep it</h2>
        <ul>
          <li>Audit requests that do not become clients: up to 24 months, then deleted.</li>
          <li>Client records: for the engagement, then 6 years to meet accounting requirements.</li>
          <li>Your currency preference: 12 months in your browser, or until you clear it.</li>
        </ul>
      </section>

      <section>
        <h2>6. Your rights</h2>
        <p>
          Under UK data protection law you can ask us to give you a copy of your data, correct it,
          delete it, restrict how we use it, or transfer it elsewhere. You can object to processing
          based on legitimate interests, and you can withdraw consent at any time. Withdrawing
          consent does not affect anything we did before you withdrew it.
        </p>
        <p>
          Write to <a href={`mailto:${site.email}`}>{site.email}</a> and we will respond within one
          month. If you are not satisfied, you can complain to the Information Commissioner&rsquo;s
          Office at ico.org.uk.
        </p>
      </section>

      <section>
        <h2>7. Security</h2>
        <p>
          Access to client platforms and enquiry data is limited to the people who need it, protected
          by individual accounts and multi-factor authentication where the platform supports it. We
          review that access when someone joins or leaves.
        </p>
        <p>
          No system is perfect. If a breach occurs that is likely to risk your rights, we will notify
          the ICO within 72 hours and tell you directly where the law requires it.
        </p>
      </section>

      <section>
        <h2>8. Changes</h2>
        <p>
          We will update this page when our processing changes and revise the date at the top.
          Material changes will be sent to active clients directly.
        </p>
      </section>
    </LegalPage>
  );
}
