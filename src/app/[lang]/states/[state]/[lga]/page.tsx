import Link from "next/link";
import { notFound } from "next/navigation";
import "@/styles/content.css";
import { href, isLocale, type Locale } from "@/lib/i18n";
import { pageMeta, withLocales } from "@/lib/meta";
import { CtaBand, FactList, Notice, PageHeader, Section } from "@/components/ui/Page";
import { stateBySlug } from "@/data/states";
import { allLgaParams, lgaBySlug, lgasOf } from "@/data/lgas";

export const dynamicParams = false;
export function generateStaticParams() {
  return withLocales(allLgaParams());
}
export async function generateMetadata({ params }: { params: Promise<{ lang: string; state: string; lga: string }> }) {
  const { lang, state, lga } = await params;
  const s = stateBySlug(state);
  const l = s && lgaBySlug(state, lga);
  if (!s || !l) return {};
  // SEO-9: LGA pages are noindex until they have ≥1 active ward leader, ≥1 project or event and 150+ words of unique local content.
  return pageMeta(lang as Locale, `/states/${s.slug}/${l.slug}`, `TBH One in ${l.name} LGA, ${s.name}`, `Join TBH One in ${l.name} Local Government Area, ${s.name}: ward and street leaders, projects and events.`, { noindex: true });
}

export default async function LgaPage({ params }: { params: Promise<{ lang: string; state: string; lga: string }> }) {
  const { lang, state, lga } = await params;
  if (!isLocale(lang)) notFound();
  const s = stateBySlug(state);
  const l = s && lgaBySlug(state, lga);
  if (!s || !l) notFound();
  const L = (p: string) => href(lang, p);
  const siblings = lgasOf(s.slug);
  const i = siblings.findIndex((x) => x.slug === l.slug);
  const prev = siblings[i - 1];
  const next = siblings[i + 1];
  return (
    <>
      <PageHeader
        locale={lang}
        crumbs={[{ label: "Campaign Hub", path: "/message" }, { label: "Your State", path: "/states" }, { label: s.name, path: `/states/${s.slug}` }, { label: `${l.name} LGA` }]}
        title={`TBH One in ${l.name} LGA, ${s.name}`}
        answer={`${l.name} is one of ${s.lgas} Local Government Areas in ${s.name === "FCT" ? "the Federal Capital Territory" : `${s.name} State`}. TBH One is recruiting ward and street leaders here to run Tell One, Bring One and Help One activity, village meetings and community projects. Join free and choose ${l.name} as your LGA to be connected with your ward team.`}
        actions={
          <>
            <Link href={L("/join")} className="btn btn-primary">
              Join in {l.name}
            </Link>
            <Link href={L("/ward-leaders")} className="btn btn-outline">
              Lead a ward here
            </Link>
          </>
        }
      />
      <Section id="status">
        <Notice tone="info" title="This LGA page is still growing">
          Local leaders, projects and events appear here as they are approved. Until the page has an active ward leader, a project or event and enough local information, it is kept out of search results.
        </Notice>
        <div style={{ height: 16 }} />
        <FactList
          items={[
            { label: "State", value: <Link href={L(`/states/${s.slug}`)}>{s.name}</Link> },
            { label: "Zone", value: s.zone },
            { label: "Active ward leaders", value: "None published yet" },
            { label: "Projects and events", value: "None published yet" },
          ]}
        />
      </Section>
      <Section id="nearby" title={`Other LGAs in ${s.name}`} alt>
        <p style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          {prev && (
            <Link className="btn btn-sm btn-ghost" href={L(`/states/${s.slug}/${prev.slug}`)}>
              ← {prev.name}
            </Link>
          )}
          <Link className="btn btn-sm btn-outline" href={L(`/states/${s.slug}#lgas`)}>
            All {s.lgas} LGAs
          </Link>
          {next && (
            <Link className="btn btn-sm btn-ghost" href={L(`/states/${s.slug}/${next.slug}`)}>
              {next.name} →
            </Link>
          )}
        </p>
      </Section>
      <CtaBand
        title={`Be the first ward leader in ${l.name}`}
        actions={
          <Link href={L("/ward-leaders")} className="btn btn-primary">
            Apply now
          </Link>
        }
      />
    </>
  );
}
