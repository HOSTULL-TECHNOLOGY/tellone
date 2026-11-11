import "@/styles/participate.css";
import { Tv } from "lucide-react";
import { localeParams } from "@/lib/meta";
import { localeOf, metaFor } from "@/components/participate/pageKit";
import { Notice, PageHeader, PrototypeNote, Section } from "@/components/ui/Page";
import { VideoSlot } from "@/components/participate/Media";
import { VideoCard } from "@/components/home/VideoCard";
import { videos } from "@/data/videos";

export const generateStaticParams = localeParams;
export const generateMetadata = metaFor(
  "/media/tv",
  "TBH One TV — schedule and videos",
  "TBH One TV streams explainers, community project updates, voter education and the theme songs. See the programme schedule and watch videos with transcripts.",
);

const SCHEDULE = [
  ["07:00", "Morning briefing", "Today's news in five languages"],
  ["09:00", "Projects in focus", "Funded community projects and their proof of delivery"],
  ["12:00", "Voter clinic", "PVC, polling units and how to vote, step by step"],
  ["16:00", "Street stories", "Members and leaders on what they are doing"],
  ["19:00", "Evening review", "The day's campaign activity and answers to your questions"],
  ["21:00", "Music hour", "The TBH One theme songs and member performances"],
];

const VIDEOS: [string, string, string][] = [
  ["What Tell One, Bring One, Help One means", "2:40", "The three person-to-person actions explained in under three minutes, with an example of each from a market in Onitsha."],
  ["How to check your voter registration", "3:15", "Step by step on a phone: checking your PVC status on INEC's portal, finding your polling unit and what to do if your details are wrong."],
  ["Inside a funded project: borehole repair, Nsukka", "4:05", "From the request at the ward meeting to the first bucket of clean water, with the receipts shown on screen."],
  ["A day with a street leader in Surulere", "5:30", "Door-to-door conversations, the evening WhatsApp update and the safety check-in that ends every shift."],
  ["How project money is tracked", "3:50", "Where a ₦2,000 contribution goes: the project page, the supplier invoice, the delivery photos and the public ledger."],
  ["Safety at village meetings", "2:55", "How meetings are planned, who to call if something goes wrong and why nobody is ever asked how they will vote."],
];

export default async function TvPage({ params }: { params: Promise<{ lang: string }> }) {
  const locale = await localeOf(params);
  return (
    <>
      <PageHeader
        locale={locale}
        crumbs={[{ label: "Media Hub", path: "/media" }, { label: "TBH One TV" }]}
        title="TBH One TV"
        answer="TBH One TV will stream continuously from launch: morning briefings, voter clinics, updates from funded projects, street stories from members and an evening music hour. Every video has a transcript and captions in five languages. Playing a video pauses the theme song, and nothing plays with sound until you press play."
      />
      <Section title="Live stream">
        <div className="tv-live">
          <div className="tv-live-screen">
            <img src="/people/peter-obi-560.webp" alt="" className="tv-live-a" loading="lazy" />
            <img src="/people/rabiu-musa-kwankwaso-441.webp" alt="" className="tv-live-b" loading="lazy" />
            <div className="tv-live-text">
              <span className="tv-live-badge">
                <Tv size={16} aria-hidden /> TBH One TV
              </span>
              <p className="tv-live-big">On air from 9 November 2026</p>
              <p>The live stream starts at launch. Until then, watch Peter Obi&apos;s interviews and the explainers below.</p>
            </div>
          </div>
          <ol className="tv-live-next" role="list">
            {SCHEDULE.slice(0, 3).map(([t, prog]) => (
              <li key={t}>
                <span>{t}</span> {prog}
              </li>
            ))}
          </ol>
        </div>
      </Section>
      <Section alt title="Programme schedule" intro="Daily, West Africa Time. Sample schedule — confirmed at launch.">
        <span className="chip chip-demo">Demo data</span>
        <table className="rate-table" style={{ marginTop: "var(--s3)" }}>
          <caption className="sr-only">Daily TBH One TV schedule</caption>
          <thead>
            <tr>
              <th scope="col">Time</th>
              <th scope="col">Programme</th>
              <th scope="col">About</th>
            </tr>
          </thead>
          <tbody>
            {SCHEDULE.map(([t, p, a]) => (
              <tr key={t}>
                <td>{t}</td>
                <td>{p}</td>
                <td>{a}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Notice title="Campaign cut-off">From 23:59 WAT on 14 January 2027 until polls close, TBH One TV shows only neutral voter information.</Notice>
      </Section>
      <Section title="Peter Obi on video" intro="Interviews with the NDC presidential candidate, published on YouTube by the broadcasters.">
        <div className="vcard-grid">
          {videos.map((v) => (
            <VideoCard key={v.id} video={v} />
          ))}
        </div>
        <p className="small muted" style={{ marginTop: "var(--s3)" }}>
          Videos play from YouTube. TBH One does not own them; each belongs to the channel that published it.
        </p>
      </Section>
      <Section alt title="Videos">
        <div className="vgrid">
          {VIDEOS.map(([t, d, syn], i) => (
            <VideoSlot key={t} title={t} duration={d} synopsis={syn} index={i} label="TBH One TV" />
          ))}
        </div>
        <PrototypeNote>Programme titles and running times are the launch schedule; each video file replaces its cover at release.</PrototypeNote>
      </Section>
    </>
  );
}
