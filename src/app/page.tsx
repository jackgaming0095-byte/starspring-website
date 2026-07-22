import { CurrencyProvider } from "@/components/currency/currency-provider";
import { JsonLd } from "@/components/seo/json-ld";
import { Decision } from "@/components/sections/decision";
import { Faq } from "@/components/sections/faq";
import { FinalCta } from "@/components/sections/final-cta";
import { FreeAudit } from "@/components/sections/free-audit";
import { Hero } from "@/components/sections/hero";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Inclusions } from "@/components/sections/inclusions";
import { Industries } from "@/components/sections/industries";
import { Integrity } from "@/components/sections/integrity";
import { Outcomes } from "@/components/sections/outcomes";
import { Pricing } from "@/components/sections/pricing";
import { WhatWeMeasure } from "@/components/sections/what-we-measure";
import { getPricingContext } from "@/lib/currency/server";
import { faqSchema, serviceSchema } from "@/lib/structured-data";

/**
 * Rendered per request because pricing depends on the visitor's coarse
 * location and their saved currency choice. Resolving it here rather than in
 * the browser is what keeps the price from flickering after hydration.
 */
export default async function HomePage() {
  const pricing = await getPricingContext();

  return (
    <>
      <JsonLd data={serviceSchema()} />
      <JsonLd data={faqSchema()} />

      <Hero />
      <Decision />
      <Outcomes />
      <HowItWorks />
      <Integrity />
      <Inclusions />
      <Industries />

      <CurrencyProvider
        initialCurrency={pricing.currency}
        initialSource={pricing.source}
        table={pricing.table}
      >
        <Pricing />
      </CurrencyProvider>

      <WhatWeMeasure />
      <FreeAudit />
      <Faq />
      <FinalCta />
    </>
  );
}
