import { geoSignals, siteSeo } from "@/core/seo/config";
import type { ToolDefinition } from "@/core/tools/types";

function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function WebsiteJsonLd() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: siteSeo.name,
          url: siteSeo.url,
          description: siteSeo.description,
          inLanguage: "en",
          publisher: { "@type": "Organization", name: siteSeo.name, url: siteSeo.url },
        }}
      />
      {/* Surfaces the curated entity terms and factual claims to crawlers and
          answer engines, which otherwise never saw them. */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: siteSeo.name,
          url: siteSeo.url,
          description: siteSeo.description,
          knowsAbout: [...geoSignals.entityTerms],
          areaServed: geoSignals.priorityMarkets.map((code) => ({
            "@type": "Country",
            identifier: code,
          })),
          disambiguatingDescription: geoSignals.factualClaims.join(" "),
        }}
      />
    </>
  );
}

export function ToolJsonLd({ tool, categoryLabel, categorySlug }: {
  tool: ToolDefinition;
  categoryLabel: string;
  categorySlug: string;
}) {
  const toolUrl = `${siteSeo.url}/tools/${tool.slug}`;

  const softwareApplication = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.name,
    url: toolUrl,
    description: tool.seo.description,
    applicationCategory: "UtilityApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    publisher: { "@type": "Organization", name: siteSeo.name, url: siteSeo.url },
  };

  const faqPage = tool.seo.faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: tool.seo.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  } : null;

  const howTo = tool.seo.howTo.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: tool.seo.h1,
    step: tool.seo.howTo.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      text: step,
    })),
  } : null;

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteSeo.url },
      { "@type": "ListItem", position: 2, name: categoryLabel, item: `${siteSeo.url}/${categorySlug}` },
      { "@type": "ListItem", position: 3, name: tool.name, item: toolUrl },
    ],
  };

  return (
    <>
      <JsonLd data={softwareApplication} />
      {faqPage ? <JsonLd data={faqPage} /> : null}
      {howTo ? <JsonLd data={howTo} /> : null}
      <JsonLd data={breadcrumbs} />
    </>
  );
}
