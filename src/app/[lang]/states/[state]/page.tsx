import Link from "next/link";
import { notFound } from "next/navigation";
import "@/styles/content.css";
import { href, isLocale, type Locale } from "@/lib/i18n";
import { pageMeta, withLocales } from "@/lib/meta";
import { CtaBand, FactList, PageHeader, PrototypeNote, Section, Sources } from "@/components/ui/Page";
import { stateBySlug, states } from "@/data/states";
import { lgasOf } from "@/data/lgas";
import { presenceOf } from "@/data/presence";
import { projects } from "@/data/demo";
import { calEvents } from "@/data/events";
import { CONCEPT_NOTE } from "@/data/factsheet";
import { formatDate } from "@/lib/format";

export const dynamicParams = false;
export function generateStaticParams() {
  return withLocales(states.map((s) => ({ state: s.slug })));
}
const label = (name: string) => (name === "FCT" ? "the Federal Capital Territory" : `${name} State`);
export async function generateMetadata({ params }: { params: Promise<{ lang: string; state: string }> }) {
  const { lang, state } = await params;
  const s = stateBySlug(state);
  if (!s) return {};
  return pageMeta(lang as Locale, `/states/${s.slug}`, `TBH One in ${label(s.name)}`, `TBH One in ${label(s.name)}: ${s.lgas} LGAs, ward and street leaders, projects open for funding and upcoming events.`);
}

export default async function StatePage({ params }: { params: Promise<{ lang: string; state: string }> }) {
  const { lang, state } = await params;
  if (!isLocale(lang)) notFound();
  const s = stateBySlug(state);
  if (!s) notFound();
  const L = (p: string) => href(lang, p);
  const p = presenceOf(s.slug);
  const lgas = lgasOf(s.slug);
  const stateProjects = projects.filter((x) => x.state === s.name);
  const stateEvents = calEvents.filter((e) => e.state === s.name);
  return (
    <>
      <PageHeader
        locale={lang}
        crumbs={[{ label: "Campaign Hub", path: "/message" }, { label: "Your State", path: "/states" }, { label: s.name }]}
        title={`TBH One in ${label(s.name)}`}
        answer={`${label(s.name)[0].toUpperCase()}${label(s.name).slice(1)} is in the ${s.zone} zone, with ${s.capital} as its capital and ${s.lgas} Local Government Areas. TBH One organises here through ward and street leaders who run Tell One, Bring One and Help One activity, community projects and village meetings. Join free to connect with the team in your LGA and ward.`}
        updated="2026-10-23"
        actions={
          <>
            <Link href={L("/join")} className="btn btn-primary">
              Join in {s.name}
            </Link>
            <Link href={L("/projects")} className="btn btn-outline">
              Projects to fund
            </Link>
          </>
        }
      />
      <Section id="facts" title="At a glance">
        <FactList
          cols={3}
          items={[
            { label: "Capital", value: s.capital },
            { label: "Geopolitical zone", value: s.zone },
            { label: "Local Government Areas", value: s.lgas },
            { label: "Registered members", value: <>{p.members.toLocaleString("en-NG")} <span className="chip chip-demo">Demo data</span></> },
            { label: "Ward leaders", value: <>{p.wardLeaders.toLocaleString("en-NG")} <span className="chip chip-demo">Demo data</span></> },
            { label: "Street leaders", value: <>{p.streetLeaders.toLocaleString("en-NG")} <span className="chip chip-demo">Demo data</span></> },
          ]}
        />
        <PrototypeNote>Member and leader counts are demonstration figures until live records are connected.</PrototypeNote>
      </Section>
      <Section id="projects" title={`Projects in ${s.name}`} alt>
        {stateProjects.length ? (
          <ul className="updates" role="list">
            {stateProjects.map((x) => (
              <li key={x.slug}>
                <Link href={L(`/projects/${x.slug}`)}>
                  <strong>{x.title}</strong>
                </Link>
                <span className="small muted">
                  {x.lga} · {x.category} · <span className="chip chip-demo">Demo data</span>
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p>
            No projects are published for {s.name} yet. Ward leaders can propose one. <Link href={L("/ward-leaders")}>Become a ward leader</Link>.
          </p>
        )}
      </Section>
      <Section id="events" title={`Events in ${s.name}`}>
        {stateEvents.length ? (
          <ul className="updates" role="list">
            {stateEvents.map((e) => (
              <li key={e.slug}>
                <time dateTime={e.start}>{formatDate(e.start, true)} WAT</time>
                <Link href={L(`/events/${e.slug}`)}>
                  <strong>{e.title}</strong>
                </Link>
                <span className="small muted">{e.place}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>
            No upcoming events in {s.name} yet. <Link href={L("/events")}>See all events</Link>.
          </p>
        )}
      </Section>
      <Section id="lgas" title={`All ${s.lgas} LGAs in ${s.name}`} alt>
        <ul className="lga-list" role="list">
          {lgas.map((l) => (
            <li key={l.slug}>
              <Link href={L(`/states/${s.slug}/${l.slug}`)}>{l.name}</Link>
            </li>
          ))}
        </ul>
        <Sources items={[{ label: CONCEPT_NOTE }, { label: "INEC list of Local Government Areas", url: "https://inecnigeria.org/" }]} />
      </Section>
      <CtaBand
        title={`Lead TBH One in ${s.name}`}
        actions={
          <>
            <Link href={L("/ward-leaders")} className="btn btn-primary">
              Become a ward leader
            </Link>
            <Link href={L("/street-leaders")} className="btn btn-outline">
              Become a street leader
            </Link>
          </>
        }
      />
    </>
  );
}
