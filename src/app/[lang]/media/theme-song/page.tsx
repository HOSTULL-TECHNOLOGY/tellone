import "@/styles/participate.css";
import { localeParams } from "@/lib/meta";
import { localeOf, metaFor } from "@/components/participate/pageKit";
import { PageHeader, Section } from "@/components/ui/Page";
import { SongLibrary } from "@/components/participate/Media";
import { songs, SONG_AI_NOTE, SONG_ARTIST } from "@/data/songs";

export const generateStaticParams = localeParams;
export const generateMetadata = metaFor(
  "/media/theme-song",
  "TBH One theme songs — listen, read the lyrics, download",
  "Listen to the TBH One theme songs in English, Pidgin, Yorùbá, Hausa and Igbo, read the lyrics and download 128 kbps MP3s to share.",
);

export default async function ThemeSongPage({ params }: { params: Promise<{ lang: string }> }) {
  const locale = await localeOf(params);
  return (
    <>
      <PageHeader
        locale={locale}
        crumbs={[{ label: "Media Hub", path: "/media" }, { label: "Theme Song" }]}
        title="Theme songs"
        answer={`TBH One has ${songs.length} theme songs carrying one message — "We will not steal your money" — in English, Nigerian Pidgin, Yorùbá, Hausa and Igbo. Filter by language, play a song, read its lyrics exactly as written, and download a 128 kbps MP3 to share on WhatsApp and social media. Credit: ${SONG_ARTIST}. ${SONG_AI_NOTE}.`}
      />
      <Section>
        <SongLibrary />
      </Section>
    </>
  );
}
