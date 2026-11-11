import "@/styles/participate.css";
import Link from "next/link";
import { ArrowRight, Clapperboard, Images, Music, Share2, Tv } from "lucide-react";
import { localeParams } from "@/lib/meta";
import { href } from "@/lib/i18n";
import { localeOf, metaFor } from "@/components/participate/pageKit";
import { CardGrid, LinkCard, PageHeader, Section } from "@/components/ui/Page";
import { songs } from "@/data/songs";
import { videos } from "@/data/videos";
import { VideoCard } from "@/components/home/VideoCard";
import { ProgrammeArt } from "@/components/media/ProgrammeArt";

export const generateStaticParams = localeParams;
export const generateMetadata = metaFor(
  "/media",
  "TBH One Media Hub — TV, theme songs, movies, social and gallery",
  "The TBH One Media Hub: Peter Obi interviews, TBH One TV, the theme songs in five languages, vertical movies, official social accounts and the campaign gallery.",
);

const FILMS = ["The Missing Borehole", "Mama Put and the Ballot", "One Street, One Voice", "The Receipt"];
const POSTERS = [
  ["en", "English"],
  ["ha", "Hausa"],
  ["yo", "Yorùbá"],
  ["ig", "Igbo"],
];

export default async function MediaHubPage({ params }: { params: Promise<{ lang: string }> }) {
  const locale = await localeOf(params);
  const L = (p: string) => href(locale, p);
  return (
    <>
      <PageHeader
        locale={locale}
        crumbs={[{ label: "Media Hub" }]}
        title="Media Hub"
        answer={`Everything TBH One publishes in one place: Peter Obi interviews and TBH One TV, ${songs.length} theme songs in English, Pidgin, Yorùbá, Hausa and Igbo, short vertical movies, the official social accounts and the campaign gallery. Members can download the songs and posters and share them with credit. Nothing plays with sound until you choose.`}
      />

      <Section title="Watch" intro="Peter Obi in his own words: interviews published on YouTube by the broadcasters." action={<Link href={L("/media/tv")}>TBH One TV</Link>}>
        <div className="hub-watch">
          <VideoCard video={videos[0]} featured />
          <div className="hub-watch-side">
            {videos.slice(1).map((v) => (
              <VideoCard key={v.id} video={v} />
            ))}
          </div>
        </div>
      </Section>

      <Section alt title="Theme songs" intro="Stream, read the lyrics and download." action={<Link href={L("/media/theme-song")}>All songs and lyrics</Link>}>
        <ul className="hub-songs" role="list">
          {songs.map((s, i) => (
            <li key={s.slug}>
              <Link href={L("/media/theme-song")} className="hub-song">
                <span className={`hub-song-n ${i % 2 ? "is-g" : "is-r"}`} aria-hidden>
                  <Music size={18} />
                </span>
                <span>
                  <strong>{s.title}</strong>
                  <span className="small muted">{s.langLabel}{s.version ? ` · ${s.version}` : ""}</span>
                </span>
                <ArrowRight size={16} aria-hidden className="hub-song-go" />
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Movies" intro="Short dramas made for phones, premiering on TBH One TV." action={<Link href={L("/media/movies")}>All films</Link>}>
        <ul className="hub-films" role="list">
          {FILMS.map((t, i) => (
            <li key={t}>
              <Link href={L("/media/movies")} className="hub-film" aria-label={`${t}: coming soon`}>
                <ProgrammeArt title={t} vertical index={i + 1} label="TBH One Films" />
                <span className="chip chip-soon">Coming soon</span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section alt title="Gallery" intro="Campaign posters, people, the candidates and merch." action={<Link href={L("/media/gallery")}>Open the gallery</Link>}>
        <ul className="hub-posters" role="list">
          {POSTERS.map(([lang, label]) => (
            <li key={lang}>
              <Link href={L("/media/gallery")}>
                <picture>
                  <source type="image/webp" srcSet={`/media/poster-${lang}-480.webp`} />
                  <img src={`/media/poster-${lang}-480.jpg`} alt={`Campaign poster in ${label}`} width={480} height={580} loading="lazy" />
                </picture>
                <span className="small">{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Everything in the Media Hub">
        <CardGrid min={220}>
          <LinkCard locale={locale} path="/media/tv" icon={<Tv size={22} aria-hidden />} title="TBH One TV" text="Programme schedule, interviews and explainers." />
          <LinkCard locale={locale} path="/media/theme-song" icon={<Music size={22} aria-hidden />} title="Theme songs" text={`${songs.length} songs, lyrics and downloads.`} />
          <LinkCard locale={locale} path="/media/movies" icon={<Clapperboard size={22} aria-hidden />} title="Movies" text="Short vertical films about the message." />
          <LinkCard locale={locale} path="/media/social" icon={<Share2 size={22} aria-hidden />} title="Social" text="Instagram, X, TikTok and the hashtags." />
          <LinkCard locale={locale} path="/media/gallery" icon={<Images size={22} aria-hidden />} title="Gallery" text="Posters, people, candidates and merch." />
        </CardGrid>
      </Section>
    </>
  );
}
