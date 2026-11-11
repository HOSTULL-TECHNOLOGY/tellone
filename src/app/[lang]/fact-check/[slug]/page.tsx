import Link from "next/link";
import { notFound } from "next/navigation";
import "@/styles/content.css";
import { href, isLocale, type Locale } from "@/lib/i18n";
import { pageMeta, withLocales, site } from "@/lib/meta";
import { CtaBand, FactList, PageHeader, Section, Sources } from "@/components/ui/Page";
import { factCheckBySlug, factChecks } from "@/data/factchecks";
import { formatDate } from "@/lib/format";
import { JsonLd } from "@/lib/seo";

export const dynamicParams = false;
export function generateStaticParams() {
  return withLocales(factChecks.map((f) => ({ slug: f.slug })));
}
export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  const f = factCheckBySlug(slug);
  if (!f) return {};
  return pageMeta(lang as Locale, `/fact-check/${f.slug}`, `Fact check: ${f.claim}`, `Verdict: ${f.verdict}. ${f.summary}`.slice(0, 160), { type: "article" });
}

export default async function FactCheckPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const f = factCheckBySlug(slug);
  if (!f) notFound();
  const L = (p: string) => href(lang, p);
  const url = `${site.url}${href(lang, `/fact-check/${f.slug}`)}`;
  const others = factChecks.filter((x) => x.slug !== f.slug).slice(0, 3);
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ClaimReview",
          url,
          datePublished: f.checked,
          claimReviewed: f.claim,
          author: { "@type": "Organization", name: site.name, url: site.url },
          itemReviewed: { "@type": "Claim", appearance: { "@type": "CreativeWork", description: f.claimSeen } },
          reviewRating: { "@type": "Rating", ratingValue: f.rating, bestRating: 5, worstRating: 1, alternateName: f.verdict },
        }}
      />
      <PageHeader
        locale={lang}
        crumbs={[{ label: "Fact Check", path: "/fact-check" }, { label: f.verdict }]}
        title={`Fact check: ${f.claim}`}
        kicker="Fact Check"
        answer={f.summary}
        updated={f.checked}
      />
      <Section id="verdict" narrow>
        <p>
          <span className={`verdict verdict-${f.verdict}`}>Verdict: {f.verdict}</span>
        </p>
        <blockquote className="claim">{f.claim}</blockquote>
        <div style={{ height: 24 }} />
        <FactList
          items={[
            { label: "Where the claim appeared", value: f.claimSeen },
            { label: "Checked", value: formatDate(f.checked) },
          ]}
        />
      </Section>
      <Section id="evidence" title="The evidence" alt narrow>
        <div className="prose">
          {f.evidence.map((e, i) => (
            <p key={i}>{e}</p>
          ))}
        </div>
        <Sources items={f.sources} />
      </Section>
      <Section id="more" title="More fact checks" narrow>
        <ul className="q-list" role="list">
          {others.map((o) => (
            <li key={o.slug}>
              <Link href={L(`/fact-check/${o.slug}`)}>
                <span>{o.claim}</span>
                <span className={`chip verdict-${o.verdict}`}>{o.verdict}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
      <CtaBand
        title="Share the correction, not the rumour"
        actions={
          <>
            <Link href={L("/tools")} className="btn btn-primary">
              Message tools
            </Link>
            <Link href={L("/fact-check")} className="btn btn-outline">
              All fact checks
            </Link>
          </>
        }
      />
    </>
  );
}
