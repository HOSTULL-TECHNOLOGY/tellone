import Link from "next/link";
import { notFound } from "next/navigation";
import "@/styles/content.css";
import { href, isLocale, type Locale } from "@/lib/i18n";
import { localeParams, pageMeta } from "@/lib/meta";
import { Faq, PageHeader, Section, Sources } from "@/components/ui/Page";
import { BigCountdown, PhaseCards } from "@/components/content/ElectionLive";
import { timeline, timelineSources } from "@/data/timeline";
import { formatDate } from "@/lib/format";
import { INEC_IREV_URL } from "@/lib/campaign";
import { DEMO_MODE } from "@/config/site";
import { JsonLd } from "@/lib/seo";
import { PhotoFigure } from "@/components/PeopleMosaic";
import { electionPhoto } from "@/data/photos";

export const generateStaticParams = localeParams;
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return pageMeta(lang as Locale, "/election", "Live Election Updates & 2027 Election Timeline", "The full INEC timeline for Nigeria’s 2027 general election with today’s position marked, a countdown to Saturday 16 January 2027 and editor-approved updates.");
}

/** Editor-approved updates (WEB-1). DEMO entries until the editorial workflow is connected. */
const updates = [
  { at: "2026-10-22", headline: "TBH One membership opens nationwide on 9 November 2026", source: "TBH One Stakeholder PRD release plan" },
  { at: "2026-10-10", headline: "INEC timetable: final list of Governorship and State Assembly candidates due", source: "INEC revised timetable" },
  { at: "2026-09-12", headline: "INEC timetable: final list of Presidential and National Assembly candidates due", source: "INEC revised timetable" },
  { at: "2026-08-19", headline: "Presidential and National Assembly campaigns begin", source: "INEC revised timetable" },
];

export default async function ElectionPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const today = new Date().toISOString().slice(0, 10);
  const nextIdx = timeline.findIndex((m) => (m.end ?? m.date) >= today);
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Event",
          name: "Nigeria 2027 Presidential and National Assembly elections",
          startDate: "2027-01-16T08:00:00+01:00",
          eventStatus: "https://schema.org/EventScheduled",
          eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
          location: { "@type": "Country", name: "Nigeria" },
          organizer: { "@type": "GovernmentOrganization", name: "Independent National Electoral Commission", url: "https://inecnigeria.org/" },
        }}
      />
      <PageHeader
        locale={lang}
        crumbs={[{ label: "Campaign Hub", path: "/message" }, { label: "Live Election Updates & Timeline" }]}
        title="2027 election updates and timeline"
        answer="Nigeria’s presidential and National Assembly elections are on Saturday 16 January 2027, and governorship and State Assembly elections on Saturday 6 February 2027, under INEC’s revised timetable. Campaigning for the January polls ends at 11:59 pm on Thursday 14 January 2027. This page tracks every INEC milestone with today’s position marked."
        updated="2026-10-23"
        aside={
          <div className="counter">
            <span className="small muted">Until polls open</span>
            <BigCountdown />
            <span className="small">Saturday 16 January 2027, 8:00 am WAT</span>
          </div>
        }
      />
      <Section id="timeline" title="INEC timeline" intro="Official milestones from INEC’s revised timetable. The red marker is the next milestone.">
        <ol className="tl-full">
          {timeline.map((m, i) => {
            const done = (m.end ?? m.date) < today;
            return (
              <li key={m.date + m.title} className={`${done ? "is-done" : ""}${i === nextIdx ? " is-next" : ""}`}>
                <p className="d">
                  {m.dateLabel} {i === nextIdx && <span className="chip chip-ok">Next milestone</span>}
                </p>
                <p className="t">{m.title}</p>
                <p className="scope muted">
                  {m.scope === "national" ? "Presidential & National Assembly" : "Governorship & State Assembly"} · {done ? "Completed" : "Upcoming"}
                </p>
              </li>
            );
          })}
        </ol>
      </Section>
      <Section id="phases" title="How this site changes as the election approaches" alt>
        <div style={{ marginBottom: "var(--s5)", maxWidth: 720 }}>
          <PhotoFigure photo={electionPhoto} />
        </div>
        <PhaseCards />
      </Section>
      <Section id="updates" title="Latest updates" intro="Editor-approved updates, each with its source." action={DEMO_MODE ? <span className="chip chip-demo">Demo data</span> : undefined}>
        <ul className="updates" role="list">
          {updates.map((u) => (
            <li key={u.at + u.headline}>
              <time dateTime={u.at}>{formatDate(u.at)}</time>
              <strong>{u.headline}</strong>
              <span className="small muted">Source: {u.source}</span>
            </li>
          ))}
        </ul>
      </Section>
      <Section id="faq" alt narrow>
        <Faq
          items={[
            { q: "Where can I see official results?", a: "Only INEC announces results. On Election Day this page links to the INEC Result Viewing Portal (IReV). TBH One does not collate or tally results." },
            { q: "Why did the election date change from February?", a: "INEC revised its timetable in February 2026 after the Electoral Act 2026 came into force, moving the presidential election from 20 February to 16 January 2027." },
            { q: "How do I check my polling unit?", a: "Use INEC’s official portals or your LGA INEC office. See our Voter Information page." },
          ]}
        />
        <p style={{ marginTop: 16 }}>
          <Link href={href(lang, "/voter-info")}>Voter information</Link> ·{" "}
          <a href={INEC_IREV_URL} target="_blank" rel="noopener">
            INEC Result Viewing Portal
          </a>
        </p>
        <Sources items={timelineSources.map((s) => ({ label: s.label, url: s.url }))} />
      </Section>
    </>
  );
}
