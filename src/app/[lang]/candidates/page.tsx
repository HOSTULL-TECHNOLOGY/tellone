import Link from "next/link";
import { notFound } from "next/navigation";
import "@/styles/content.css";
import { href, isLocale, type Locale } from "@/lib/i18n";
import { localeParams, pageMeta } from "@/lib/meta";
import { CtaBand, PageHeader, Section, Sources } from "@/components/ui/Page";
import { candidates } from "@/data/candidates";
import { CandidatePortrait, isCandidateSlug } from "@/components/CandidatePortrait";
import { TICKET_SOURCE, TICKET_URL } from "@/data/factsheet";

export const generateStaticParams = localeParams;
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return pageMeta(lang as Locale, "/candidates", "The NDC candidates: Peter Obi and Rabiu Musa Kwankwaso", "Peter Obi is the NDC presidential candidate for 16 January 2027 and Rabiu Musa Kwankwaso his running mate. Factual profiles with sources.");
}

export default async function CandidatesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const L = (p: string) => href(lang, p);
  return (
    <>
      <PageHeader
        locale={lang}
        crumbs={[{ label: "The Party" }, { label: "Candidates" }]}
        title="The NDC candidates for 2027"
        answer="Peter Obi is the Nigeria Democratic Congress (NDC) presidential candidate for the election on Saturday 16 January 2027, and Rabiu Musa Kwankwaso is his running mate. Obi was declared flagbearer at the NDC special convention in Abuja on 30 May 2026 and named Kwankwaso the same weekend. TBH One supports the ticket but is not the official campaign."
        updated="2026-10-23"
      />
      <Section id="ticket">
        <div className="card-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))" }}>
          {candidates.map((c) => (
            <article key={c.slug} className="card" style={{ padding: 24, display: "grid", gap: 12, alignContent: "start" }}>
              {isCandidateSlug(c.slug) && <CandidatePortrait slug={c.slug} size={260} />}
              <h2 style={{ margin: 0 }}>{c.name}</h2>
              <p className="muted" style={{ margin: 0 }}>{c.role}</p>
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                {c.facts.slice(1, 4).map((f) => (
                  <li key={f.label}>
                    {f.label}: {f.value}
                  </li>
                ))}
              </ul>
              <Link href={L(`/candidates/${c.slug}`)} className="btn btn-outline">
                Full profile of {c.name}
              </Link>
            </article>
          ))}
        </div>
        <p className="small muted" style={{ marginTop: 16 }}>Profiles summarise public records. TBH One does not publish quotes or policy positions on the candidates&apos; behalf.</p>
        <Sources items={[{ label: TICKET_SOURCE, url: TICKET_URL, date: "31 May 2026" }]} />
      </Section>
      <CtaBand
        title="Turn support into votes"
        text="Tell one person about the ticket, bring one person to register, help one community project."
        actions={
          <>
            <Link href={L("/join")} className="btn btn-primary">Join free</Link>
            <Link href={L("/manifesto")} className="btn btn-outline">Issue areas</Link>
          </>
        }
      />
    </>
  );
}
