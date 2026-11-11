import "@/styles/participate.css";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarPlus, Check, Clock, MapPin, UsersRound, X } from "lucide-react";
import { href, isLocale, type Locale } from "@/lib/i18n";
import { pageMeta, withLocales } from "@/lib/meta";
import { Notice, PageHeader, Section } from "@/components/ui/Page";
import { RsvpForm } from "@/components/participate/Events";
import { icsFor } from "@/components/participate/ics";
import { calEvents, eventBySlug } from "@/data/events";
import { JsonLd } from "@/lib/seo";
import { site } from "@/config/site";

export const dynamicParams = false;
export const generateStaticParams = () => withLocales(calEvents.map((e) => ({ slug: e.slug })));

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  const e = eventBySlug(slug);
  if (!e) return {};
  return pageMeta(lang as Locale, `/events/${slug}`, e.title, e.summary.slice(0, 160));
}

const when = (s: string, e: string) => {
  const d = new Date(s);
  const day = d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Africa/Lagos" });
  const t = (x: string) => new Date(x).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Africa/Lagos" });
  return `${day}, ${t(s)}–${t(e)} WAT`;
};

export default async function EventPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const e = eventBySlug(slug);
  if (!e) notFound();
  const L = (p: string) => href(lang, p);
  const ready = e.safety.every((s) => s.done);
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Event",
          name: e.title,
          description: e.summary,
          startDate: e.start,
          endDate: e.end,
          eventStatus: "https://schema.org/EventScheduled",
          eventAttendanceMode: e.online ? "https://schema.org/OnlineEventAttendanceMode" : "https://schema.org/OfflineEventAttendanceMode",
          location: e.online ? { "@type": "VirtualLocation", url: site.url } : { "@type": "Place", name: e.place, address: { "@type": "PostalAddress", addressLocality: e.place, addressRegion: e.state, addressCountry: "NG" } },
          organizer: { "@type": "Organization", name: e.organiserName },
          isAccessibleForFree: true,
        }}
      />
      <PageHeader
        locale={lang}
        crumbs={[{ label: "Events", path: "/events" }, { label: e.title }]}
        title={e.title}
        answer={e.summary}
        actions={
          <>
            <a href="#rsvp" className="btn btn-primary">
              RSVP
            </a>
            <a href={icsFor(e)} download={`${e.slug}.ics`} className="btn btn-ghost">
              <CalendarPlus size={18} aria-hidden /> Add to calendar
            </a>
          </>
        }
        aside={
          <div className="card">
            <span className="chip chip-demo">Demo data</span>
            <ul className="ev-facts" role="list" style={{ marginTop: "var(--s2)" }}>
              <li>
                <Clock size={16} aria-hidden /> {when(e.start, e.end)}
              </li>
              <li>
                <MapPin size={16} aria-hidden /> {e.online ? e.place : `${e.place}, ${e.state}`}
              </li>
              <li>
                <UsersRound size={16} aria-hidden /> {e.organiserName} ({e.organiser})
              </li>
            </ul>
          </div>
        }
      />
      <Section>
        <div className="split">
          <div className="stack-lg">
            {!e.online && (
              <div>
                <h2 className="h-sub">Safety checklist</h2>
                <ul className="checklist" role="list">
                  {e.safety.map((s) => (
                    <li key={s.item} className={s.done ? "done" : ""}>
                      {s.done ? <Check size={18} aria-hidden /> : <X size={18} aria-hidden />}
                      <span>{s.item}</span>
                      <span className="sr-only">{s.done ? " — done" : " — not yet done"}</span>
                    </li>
                  ))}
                </ul>
                {ready ? (
                  <p className="small muted">All safety items are complete for this event.</p>
                ) : (
                  <Notice tone="warn" title="Not yet confirmed">
                    This event is waiting for its safety checklist. Check back before you travel.
                  </Notice>
                )}
              </div>
            )}
            <div>
              <h2 className="h-sub">Before you go</h2>
              <ul className="ticks">
                <li>Follow the marshals&apos; instructions and note the nearest exit</li>
                <li>Do not bring weapons, and do not accept money or gifts in exchange for support</li>
                <li>In an emergency call 112. Report any incident on <Link href={L("/report")}>Report a problem</Link></li>
              </ul>
            </div>
          </div>
          <div id="rsvp" className="sticky-side">
            <h2 className="h-sub">RSVP</h2>
            <RsvpForm slug={e.slug} title={e.title} />
          </div>
        </div>
      </Section>
      <Section alt narrow>
        <p>
          <Link href={L("/events")}>All events</Link>
        </p>
      </Section>
    </>
  );
}
