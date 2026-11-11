import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen, Briefcase, GraduationCap, HeartPulse, Landmark, ShieldCheck, Sprout, Zap } from "lucide-react";
import "@/styles/content.css";
import { href, isLocale, type Locale } from "@/lib/i18n";
import { localeParams, pageMeta } from "@/lib/meta";
import { CtaBand, Notice, PageHeader, Section } from "@/components/ui/Page";

export const generateStaticParams = localeParams;
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return pageMeta(lang as Locale, "/manifesto", "NDC manifesto: issue areas for 2027", "Where the official NDC manifesto for the 2027 election will be published, and the issue areas Nigerians are asking the candidates to address.");
}

const AREAS = [
  { icon: Landmark, t: "Governance and accountability", q: "How public money is protected, tracked and reported." },
  { icon: Briefcase, t: "Economy and jobs", q: "Cost of living, inflation, small businesses and work for young people." },
  { icon: ShieldCheck, t: "Security", q: "Safety in homes, on roads and in farming communities." },
  { icon: GraduationCap, t: "Education", q: "Out-of-school children, teachers, and university funding." },
  { icon: HeartPulse, t: "Health", q: "Primary health care, hospitals and health insurance." },
  { icon: Zap, t: "Power and infrastructure", q: "Electricity supply, roads, rail and water." },
  { icon: Sprout, t: "Agriculture and food", q: "Food prices, farm inputs and access to markets." },
  { icon: BookOpen, t: "Diaspora and inclusion", q: "Women, persons with disabilities and Nigerians abroad." },
];

export default async function ManifestoPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const L = (p: string) => href(lang, p);
  return (
    <>
      <PageHeader
        locale={lang}
        crumbs={[{ label: "The Party" }, { label: "Manifesto" }]}
        title="The NDC manifesto"
        answer="The official NDC manifesto will be published here once the party releases it. Until then, TBH One does not summarise or guess at policy positions for Peter Obi, Rabiu Musa Kwankwaso or the NDC. This page lists the issue areas Nigerians most often ask about, each with a slot that fills with the official text on publication."
        updated="2026-10-23"
      />
      <Section id="status">
        <Notice tone="warn" title="Awaiting the official manifesto">
          The official NDC manifesto will be published here. Each issue area below shows &quot;Pending official publication&quot; until the party supplies the approved text and a link to the source document.
        </Notice>
      </Section>
      <Section id="areas" title="Issue areas" alt>
        <div className="card-grid">
          {AREAS.map(({ icon: Icon, t, q }) => (
            <article key={t} className="pkg">
              <Icon size={24} aria-hidden />
              <h3>{t}</h3>
              <p className="muted" style={{ margin: 0 }}>
                What people ask: {q}
              </p>
              <p style={{ margin: 0 }}>
                <span className="chip">Pending official publication</span>
              </p>
            </article>
          ))}
        </div>
      </Section>
      <CtaBand
        title="Get the manifesto the day it is published"
        text="Members receive the official text in their language through the app and the WhatsApp Channel."
        actions={
          <>
            <Link href={L("/join")} className="btn btn-primary">Join free</Link>
            <Link href={L("/candidates")} className="btn btn-outline">The candidates</Link>
          </>
        }
      />
    </>
  );
}
