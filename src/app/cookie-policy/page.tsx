import type { Metadata } from "next";

import { LegalPage } from "@/components/legal/legal-page";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "The small number of cookies and storage items this site uses, what each one does, and how to remove them.",
  alternates: { canonical: "/cookie-policy" },
};

export default function CookiePolicyPage() {
  return (
    <LegalPage
      title="Cookie Policy"
      summary="This site uses one cookie and one local-storage item, both for the same job: remembering which currency you asked to see prices in."
    >
      <section>
        <h2>1. What we set</h2>
        <ul>
          <li>
            <strong className="font-semibold text-ink">ss_currency</strong> (cookie, 12 months).
            Stores the currency you picked from the selector, so the correct price is rendered on the
            server before the page reaches you. Without it, prices would visibly change after the
            page loaded.
          </li>
          <li>
            <strong className="font-semibold text-ink">starspring:currency</strong> (local storage).
            A mirror of the same choice, so your preference survives if the cookie is cleared.
          </li>
        </ul>
        <p>
          Both are strictly necessary to deliver a feature you explicitly asked for by using the
          selector. Neither contains personal data, and neither is readable by any other site.
        </p>
      </section>

      <section>
        <h2>2. What we do not set</h2>
        <ul>
          <li>No advertising or retargeting cookies</li>
          <li>No social media pixels</li>
          <li>No cross-site tracking or fingerprinting</li>
          <li>No third-party analytics at the time of writing</li>
        </ul>
        <p>
          Because there are no non-essential cookies, there is no consent banner. If analytics is
          ever added, this page and the consent position will be updated first, and the banner will
          appear before anything non-essential is set.
        </p>
      </section>

      <section>
        <h2>3. Currency detection</h2>
        <p>
          Before you make a choice, the site asks our hosting provider for a coarse country code
          attached to the incoming request and uses it to pick a starting currency. That code is used
          in memory to render the page and is not stored. We do not receive or log your IP address
          for this purpose, and we do not call any third-party IP lookup service.
        </p>
        <p>
          GBP is always the canonical price. Every other currency shown is an approximate conversion,
          labelled as such, and invoices are issued in GBP.
        </p>
      </section>

      <section>
        <h2>4. Hosting and security logs</h2>
        <p>
          Our hosting provider keeps standard request logs for security and reliability. These are
          the provider&rsquo;s records rather than cookies, and are covered by their retention
          policy.
        </p>
        <p>
          <strong className="font-semibold text-ink">To complete before launch:</strong> name the
          hosting provider and link to its own privacy and cookie documentation.
        </p>
      </section>

      <section>
        <h2>5. Removing them</h2>
        <p>
          Clearing site data in your browser removes both items immediately. Blocking cookies for
          this site is fine too: everything still works, and prices simply fall back to the
          automatically detected currency, or to GBP.
        </p>
        <p>
          Nothing on this site collects, stores or tracks your customers. StarSpring does not send
          messages of any kind, so there is no messaging or campaign tooling to disclose here.
        </p>
        <p>
          Questions about anything on this page: <a href={`mailto:${site.email}`}>{site.email}</a>.
        </p>
      </section>
    </LegalPage>
  );
}
