import Link from "next/link";
import { notFound } from "next/navigation";
import "@/styles/content.css";
import { href, isLocale, type Locale } from "@/lib/i18n";
import { localeParams, pageMeta } from "@/lib/meta";
import { CtaBand, PageHeader, PrototypeNote, Section } from "@/components/ui/Page";
import { PresenceMap } from "@/components/content/PresenceMap";
import { states } from "@/data/states";
import { presence, diasporaChapters } from "@/data/presence";

export const generateStaticParams = localeParams;
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return pageMeta(lang as Locale, "/map", "Presence Map: TBH One across Nigeria and the diaspora", "See where TBH One is organised across the 36 states, the FCT and diaspora chapters: members, ward leaders, projects and events by state.");
}

export default async function MapPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const L = (p: string) => href(lang, p);
  const total = presence.reduce((a, p) => a + p.members, 0);
  return (
    <>
      <PageHeader
        locale={lang}
        crumbs={[{ label: "Campaign Hub", path: "/message" }, { label: "Presence Map" }]}
        title="TBH One presence map"
        answer="The presence map shows where TBH One is organised across the 36 states, the Federal Capital Territory and diaspora chapters. Each state is shaded by strength of presence, from starting to very strong, with members, ward leaders, projects and events below. The same figures are in the table for screen-reader and keyboard users."
        updated="2026-10-23"
      />
      <Section id="map" title="States">
        <PresenceMap locale={lang as Locale} />
        <PrototypeNote>All figures on this page are demonstration data until live member and leader records are connected. Total shown: {total.toLocaleString("en-NG")} members.</PrototypeNote>
      </Section>
      <Section id="table" title="Presence by state (table)" alt>
        <div className="table-wrap">
          <table className="ctable stack-sm">
            <caption className="sr-only">TBH One presence by state, demo data</caption>
            <thead>
              <tr>
                <th scope="col">State</th>
                <th scope="col">Zone</th>
                <th scope="col">Members</th>
                <th scope="col">Ward leaders</th>
                <th scope="col">Projects</th>
                <th scope="col">Events</th>
              </tr>
            </thead>
            <tbody>
              {states.map((s) => {
                const p = presence.find((x) => x.slug === s.slug)!;
                return (
                  <tr key={s.slug}>
                    <th scope="row" data-label="State">
                      <Link href={L(`/states/${s.slug}`)}>{s.name}</Link>
                    </th>
                    <td data-label="Zone">{s.zone}</td>
                    <td data-label="Members">{p.members.toLocaleString("en-NG")}</td>
                    <td data-label="Ward leaders">{p.wardLeaders.toLocaleString("en-NG")}</td>
                    <td data-label="Projects">{p.projects}</td>
                    <td data-label="Events">{p.events}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Section>
      <Section id="diaspora" title="Diaspora chapters">
        <div className="table-wrap">
          <table className="ctable stack-sm">
            <caption className="sr-only">TBH One diaspora chapters, demo data</caption>
            <thead>
              <tr>
                <th scope="col">Country</th>
                <th scope="col">Members</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {diasporaChapters.map((d) => (
                <tr key={d.country}>
                  <th scope="row" data-label="Country">{d.country}</th>
                  <td data-label="Members">{d.members.toLocaleString("en-NG")}</td>
                  <td data-label="Status">{d.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <PrototypeNote>Diaspora figures are demonstration data.</PrototypeNote>
      </Section>
      <CtaBand
        title="Make your state stronger"
        actions={
          <>
            <Link href={L("/join")} className="btn btn-primary">Join free</Link>
            <Link href={L("/diaspora")} className="btn btn-outline">Diaspora hub</Link>
          </>
        }
      />
    </>
  );
}
