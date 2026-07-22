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
import { faqSchema, serviceSchema } from "@/lib/structured-data";

/**
 * Fully static. Prices for every supported currency are baked into the HTML and
 * CSS reveals the right one from the `data-currency` attribute, which the
 * Cloudflare edge middleware (from `cf-ipcountry`) and the pre-paint script in
 * the layout resolve before first paint. Nothing here runs per request.
 */
export default function HomePage() {
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
      <Pricing />
      <WhatWeMeasure />
      <FreeAudit />
      <Faq />
      <FinalCta />
    </>
  );
}
