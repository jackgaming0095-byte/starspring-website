import { faqs } from "./content";
import { site, siteUrl } from "./site";

/**
 * Structured data.
 *
 * Deliberately conservative. There is no AggregateRating and no Review markup:
 * self-serving review stars on your own marketing page breach Google's
 * structured-data policy and would contradict everything this site says about
 * review integrity. FAQ markup mirrors the visible FAQ word for word.
 */

const ORGANISATION_ID = `${siteUrl}/#organisation`;

/**
 * ProfessionalService rather than LocalBusiness: LocalBusiness expects a
 * verified street address and opening hours. Add `address` and
 * `openingHoursSpecification` here once the registered trading address is
 * confirmed, and only then consider LocalBusiness.
 */
export function professionalServiceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": ORGANISATION_ID,
    name: site.name,
    alternateName: `${site.name} ${site.descriptor}`,
    description: site.description,
    slogan: site.tagline,
    url: siteUrl,
    logo: `${siteUrl}/icon.svg`,
    image: `${siteUrl}/opengraph-image`,
    email: site.email,
    telephone: site.phoneDisplay,
    priceRange: "££",
    areaServed: site.areaServed.map((name) => ({ "@type": "Country", name })),
    knowsAbout: [
      "Google Business Profile optimisation",
      "Review generation systems",
      "Online reputation management",
      "Local search visibility",
    ],
  };
}

export function serviceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Done-for-you Google review growth",
    serviceType: "Online reputation management",
    provider: { "@id": ORGANISATION_ID },
    description:
      "Google Business Profile audit and optimisation, branded QR review cards and direct review links, review monitoring and professional responses, negative-feedback escalation, local visibility tracking and monthly reporting for local businesses.",
    areaServed: site.areaServed.map((name) => ({ "@type": "Country", name })),
    offers: [
      {
        "@type": "Offer",
        name: "Review Launch",
        description: "One-time reputation-system setup.",
        price: "350",
        priceCurrency: "GBP",
        url: `${siteUrl}/#pricing`,
      },
      {
        "@type": "Offer",
        name: "Reputation Growth",
        description: "Monthly managed reputation growth, cancel anytime.",
        price: "300",
        priceCurrency: "GBP",
        url: `${siteUrl}/#pricing`,
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "300",
          priceCurrency: "GBP",
          billingIncrement: 1,
          unitCode: "MON",
        },
      },
    ],
  };
}

export function faqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}
