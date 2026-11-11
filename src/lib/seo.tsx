import { site } from "@/config/site";

/** Structured data helpers (SEO-8, GEO-4). TBH One is never presented as the candidates' official site. */
export function organizationLd() {
  const sameAs = Object.values(site.social).filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${site.url}/#organization`,
    name: "TBH One",
    alternateName: [...site.alternateNames],
    url: site.url,
    logo: `${site.url}/brand/tbh-one-logo.png`,
    slogan: "We will not steal your money.",
    description: site.description,
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    name: "TBH One",
    url: site.url,
    inLanguage: ["en-NG", "pcm", "yo", "ha", "ig"],
    publisher: { "@id": `${site.url}/#organization` },
    potentialAction: { "@type": "SearchAction", target: `${site.url}/search?q={query}`, "query-input": "required name=query" },
  };
}

export function JsonLd({ data }: { data: object | object[] }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
