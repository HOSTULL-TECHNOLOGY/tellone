import Link from "next/link";
import { notFound } from "next/navigation";
import { UserRound } from "lucide-react";
import "@/styles/content.css";
import { href, isLocale, type Locale } from "@/lib/i18n";
import { localeParams, pageMeta } from "@/lib/meta";
import { CardGrid, Notice, PageHeader, Section, Sources } from "@/components/ui/Page";
import { CONCEPT_NOTE, PRD } from "@/data/factsheet";

export const generateStaticParams = localeParams;
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return pageMeta(lang as Locale, "/team", "Our Team: the TBH One National Coordination team", "How the TBH One National Coordination team, state teams, country coordinators, ward leaders and street leaders are organised.");
}

const national = [
  { role: "National Coordinator", text: "Leads the movement, owns the strategy and chairs the National Coordination team." },
  { role: "Finance Controller", text: "Reconciles every contribution, gives the second signature on payouts and publishes the monthly spend report." },
  { role: "National Safeguarding Lead", text: "Triages and escalates safety incidents; receives sensitive reports directly." },
  { role: "Data Protection Officer", text: "Keeps the consent register, handles data requests within 30 days and approves new data features." },
  { role: "Tech Lead", text: "Runs the website, apps and dashboards and their security." },
  { role: "Digital & Marketing Lead", text: "Runs social media, paid ads (after political-advertiser verification) and the creator network." },
  { role: "Merch Lead", text: "Runs the TBH One Shop, vendor profit-share and delivery partners." },
  { role: "SEO Lead", text: "Keeps answers accurate in search engines and AI assistants." },
];

const field = [
  { role: "State coordinators & focal points", count: "One team per state and the FCT", text: "Oversee leaders, triage incidents and approve local projects." },
  { role: "Country coordinators", count: "Target 200+", text: "Run diaspora chapters and the Tell One campaign abroad." },
  { role: "Ward leaders", count: "Target 10,000", text: "Coordinate T-B-H activity, street leaders and projects in one of 8,809 wards." },
  { role: "Street leaders", count: "Target 800,000+", text: "Lead door-to-door outreach, distribution and village meetings on their street." },
];

export default async function TeamPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return (
    <>
      <PageHeader
        locale={lang}
        crumbs={[{ label: "The Movement", path: "/about" }, { label: "Our Team" }]}
        title="The TBH One team"
        answer="TBH One is led by a National Coordination team — including a National Coordinator, Finance Controller, Safeguarding Lead and Data Protection Officer — supported by state teams in all 36 states and the FCT, diaspora country coordinators, ward leaders and street leaders. Names and photographs are published here once each person has approved their profile."
        updated="2026-10-23"
      />
      <Section id="national" title="National Coordination team">
        <Notice tone="warn" title="Names pending approval">
          We publish real people only with their consent. Each profile below will show a name, photo and short bio once approved.
        </Notice>
        <div style={{ height: 16 }} />
        <CardGrid min={240}>
          {national.map((r) => (
            <article key={r.role} className="role-card">
              <span className="avatar-ph" aria-hidden>
                <UserRound size={28} />
              </span>
              <h3>{r.role}</h3>
              <p className="muted small">{r.text}</p>
              <p className="pending">Name and photo published after approval</p>
            </article>
          ))}
        </CardGrid>
      </Section>
      <Section id="ground" title="The ground structure" intro="TBH One’s organising structure maps onto Nigeria’s own geography. These are TBH One organising roles, not government offices." alt>
        <div className="table-wrap">
          <table className="ctable stack-sm">
            <caption>Leadership roles</caption>
            <thead>
              <tr>
                <th scope="col">Role</th>
                <th scope="col">Size</th>
                <th scope="col">What they do</th>
              </tr>
            </thead>
            <tbody>
              {field.map((f) => (
                <tr key={f.role}>
                  <th scope="row">{f.role}</th>
                  <td data-label="Size">{f.count}</td>
                  <td data-label="What they do">{f.text}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ marginTop: 16 }}>
          Want to lead? <Link href={href(lang, "/ward-leaders")}>Become a ward leader</Link> or <Link href={href(lang, "/street-leaders")}>a street leader</Link>, or check any leader&apos;s ID on the{" "}
          <Link href={href(lang, "/verify")}>Verify page</Link>.
        </p>
        <Sources items={[{ label: CONCEPT_NOTE }, { label: PRD }]} />
      </Section>
    </>
  );
}
