import Link from "next/link";
import "@/styles/content.css";
import { href, type Locale } from "@/lib/i18n";
import { site } from "@/lib/meta";
import { CtaBand, FactList, Notice, PageHeader, Section, Sources } from "@/components/ui/Page";
import { JsonLd } from "@/lib/seo";
import type { Candidate } from "@/data/candidates";
import { candidates } from "@/data/candidates";
import { CandidatePortrait, isCandidateSlug } from "@/components/CandidatePortrait";

/** Shared layout for the two candidate profiles. Facts only; no quotes or policy claims. */
export function CandidateProfile({ locale, c }: { locale: Locale; c: Candidate }) {
  const L = (p: string) => href(locale, p);
  const other = candidates.find((x) => x.slug !== c.slug)!;
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: c.name,
          jobTitle: c.role,
          url: `${site.url}${href(locale, `/candidates/${c.slug}`)}`,
          sameAs: [c.wikipedia, c.wikidata],
          affiliation: { "@type": "PoliticalParty", name: "Nigeria Democratic Congress" },
        }}
      />
      <PageHeader locale={locale} crumbs={[{ label: "The Party" }, { label: "Candidates", path: "/candidates" }, { label: c.name }]} title={c.name} kicker={c.role} answer={c.answer} updated="2026-10-23" />
      <Section id="profile">
        <div className="cand-hero">
          {isCandidateSlug(c.slug) && <CandidatePortrait slug={c.slug} size={300} eager />}
          <div>
            <FactList items={c.facts} />
            <div style={{ height: 16 }} />
            <Notice tone="info" title="TBH One is not the official campaign">
              This profile summarises public records. For statements, policies and events, follow {c.name}&apos;s own verified channels and the NDC. TBH One does not speak for either candidate.
            </Notice>
          </div>
        </div>
      </Section>
      <Section id="career" title="Career timeline" alt narrow>
        <ol className="tl-full">
          {c.timeline.map((t) => (
            <li key={t.year + t.text}>
              <strong>{t.year}</strong>
              <span>{t.text}</span>
            </li>
          ))}
        </ol>
        <Sources items={c.sources} />
      </Section>
      <Section id="ticket" title="The ticket" narrow>
        <p>
          {c.name} is on the NDC ticket with {other.name}. <Link href={L(`/candidates/${other.slug}`)}>Read the profile of {other.name}</Link>, or see <Link href={L("/manifesto")}>the issue areas</Link> the NDC manifesto is expected to cover.
        </p>
      </Section>
      <CtaBand
        title="Back the ticket in your street"
        actions={
          <>
            <Link href={L("/join")} className="btn btn-primary">
              Join TBH One free
            </Link>
            <Link href={L("/voter-info")} className="btn btn-outline">
              Check your PVC
            </Link>
          </>
        }
      />
    </>
  );
}
