import "@/styles/participate.css";
import Link from "next/link";
import { localeParams } from "@/lib/meta";
import { href } from "@/lib/i18n";
import { localeOf, metaFor } from "@/components/participate/pageKit";
import { Faq, PageHeader, PrototypeNote, Section } from "@/components/ui/Page";
import { EventsBrowser } from "@/components/participate/Events";
import { calEvents } from "@/data/events";

export const generateStaticParams = localeParams;
export const generateMetadata = metaFor(
  "/events",
  "Events — village meetings, training, rallies and chapter calls",
  "Find TBH One, NDC, campaign and allied movement events near you. Filter by state, organiser and date, view the month calendar, and RSVP.",
);

export default async function EventsPage({ params }: { params: Promise<{ lang: string }> }) {
  const locale = await localeOf(params);
  const L = (p: string) => href(locale, p);
  return (
    <>
      <PageHeader
        locale={locale}
        crumbs={[{ label: "Events" }]}
        title="Events"
        answer="Village meetings, training sessions, rallies and diaspora chapter calls from TBH One, the NDC, the campaign and allied movements. Filter by state, organiser and dates, switch between the list and month views, and RSVP so organisers can plan seats and safety. Every in-person TBH One event must pass a safety checklist — police notice, marshals and marked exits — before it is published."
      />
      <Section>
        <span className="chip chip-demo">Demo data</span>
        <div style={{ marginTop: "var(--s3)" }}>
          <EventsBrowser items={calEvents} locale={locale} />
        </div>
        <PrototypeNote>Events shown are illustrative. Verified organisers submit real events from launch.</PrototypeNote>
      </Section>
      <Section alt narrow>
        <Faq
          items={[
            { q: "Can I list my own event?", a: "Ward leaders and verified organisers submit events from their dashboard. The state team approves them after the safety checklist is complete." },
            { q: "Are events held during the polling period?", a: "No campaign events are held from the cut-off at 23:59 WAT on 14 January 2027 until polls close." },
            { q: "What if something goes wrong at an event?", a: "Tell a marshal, and report it on the Report a problem page. In an emergency, call 112." },
          ]}
        />
        <p className="small muted">
          Want to host one? <Link href={L("/careers/ward-leaders")}>Become a ward leader</Link>.
        </p>
      </Section>
    </>
  );
}
