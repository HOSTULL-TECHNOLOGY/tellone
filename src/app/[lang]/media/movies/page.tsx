import "@/styles/participate.css";
import { localeParams } from "@/lib/meta";
import { localeOf, metaFor } from "@/components/participate/pageKit";
import { PageHeader, PrototypeNote, Section } from "@/components/ui/Page";
import { VideoSlot } from "@/components/participate/Media";

export const generateStaticParams = localeParams;
export const generateMetadata = metaFor(
  "/media/movies",
  "TBH One movies — short vertical films",
  "Short vertical films from TBH One about honesty in public money, voting and community, made for phones and shared on WhatsApp.",
);

const MOVIES: [string, string, string][] = [
  ["The Missing Borehole", "6:20", "Money for a village borehole disappears for the third time. A schoolteacher and her pupils follow the receipts until the community gets its water."],
  ["Mama Put and the Ballot", "4:45", "At a busy roadside food stall, a cook persuades her regular customers to collect their PVCs, one plate of rice at a time."],
  ["One Street, One Voice", "5:10", "Neighbours who never speak find themselves organising together for a new street light, and then for election day."],
  ["The Receipt", "3:30", "A young trader asks a councillor a simple question in public: where is the receipt? A short drama about what accountability looks like."],
];

export default async function MoviesPage({ params }: { params: Promise<{ lang: string }> }) {
  const locale = await localeOf(params);
  return (
    <>
      <PageHeader
        locale={locale}
        crumbs={[{ label: "Media Hub", path: "/media" }, { label: "Movies" }]}
        title="Movies"
        answer="TBH One commissions short vertical films, made for phones, about what honest leadership looks like on an ordinary Nigerian street: public money that reaches the community, neighbours who vote together, and receipts for every naira. Films come with subtitles in five languages and can be downloaded and shared. The first four films premiere on TBH One TV after launch."
      />
      <Section title="Coming soon" intro="Short dramas made for phones. Press play to set a reminder for the premiere.">
        <span className="chip chip-demo">Demo data</span>
        <div className="vgrid vertical" style={{ marginTop: "var(--s3)" }}>
          {MOVIES.map(([t, d, syn], i) => (
            <VideoSlot key={t} title={t} duration={d} synopsis={syn} vertical index={i + 1} label="TBH One Films" premiere="on TBH One TV after launch" />
          ))}
        </div>
        <PrototypeNote>Working titles and running times from the film slate; covers are replaced by each film&apos;s artwork at release.</PrototypeNote>
      </Section>
    </>
  );
}
