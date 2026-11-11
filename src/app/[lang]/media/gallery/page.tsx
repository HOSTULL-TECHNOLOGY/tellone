import "@/styles/participate.css";
import { localeParams } from "@/lib/meta";
import { localeOf, metaFor } from "@/components/participate/pageKit";
import { Notice, PageHeader, Section } from "@/components/ui/Page";
import { GalleryLightbox } from "@/components/participate/Media";
import { posterItem, type GalleryItem } from "@/data/gallery";
import { peoplePhotos, electionPhoto } from "@/data/photos";
import { products } from "@/data/shop";

export const generateStaticParams = localeParams;
export const generateMetadata = metaFor(
  "/media/gallery",
  "TBH One gallery — posters, people, candidates and merch",
  "The TBH One gallery: campaign posters in four languages, photos of the Nigerians the campaign works for, the candidates and the official merch. Open any picture full size; download the posters to print or share.",
);

const POSTERS: GalleryItem[] = [
  posterItem("en", "Poster · English", "TBH One campaign poster in English: We will not steal your money."),
  posterItem("ha", "Poster · Hausa", "TBH One campaign poster in Hausa."),
  posterItem("yo", "Poster · Yorùbá", "TBH One campaign poster in Yorùbá."),
  posterItem("ig", "Poster · Igbo", "TBH One campaign poster in Igbo."),
];

const PEOPLE: GalleryItem[] = [...peoplePhotos, electionPhoto].map((p) => ({
  key: p.base,
  thumbWebp: `${p.base}-480.webp 480w, ${p.base}-960.webp 960w`,
  thumbJpg: `${p.base}.jpg`,
  fullWebp: `${p.base}-960.webp`,
  fullJpg: `${p.base}.jpg`,
  alt: p.alt,
  label: p.caption ?? p.alt,
  ratio: 4 / 5,
}));

const CANDIDATES: GalleryItem[] = [
  { key: "obi", thumbWebp: "/people/peter-obi-560.webp", thumbJpg: "/people/peter-obi.jpg", fullWebp: "/people/peter-obi-560.webp", fullJpg: "/people/peter-obi.jpg", alt: "Peter Obi, NDC presidential candidate, smiling and making a V sign in an NDC jacket", label: "Peter Obi · Presidential candidate", ratio: 4 / 5 },
  { key: "kwankwaso", thumbWebp: "/people/rabiu-musa-kwankwaso-441.webp", thumbJpg: "/people/rabiu-musa-kwankwaso.jpg", fullWebp: "/people/rabiu-musa-kwankwaso-441.webp", fullJpg: "/people/rabiu-musa-kwankwaso.jpg", alt: "Rabiu Musa Kwankwaso, NDC vice-presidential candidate, in a red cap speaking into a microphone", label: "Rabiu Musa Kwankwaso · Vice-presidential candidate", ratio: 4 / 5 },
];

const MERCH: GalleryItem[] = products
  .filter((p) => p.images?.[0]?.src.endsWith("-900.jpg") && !p.images[0].src.includes("/mockup-")) // real product photos only
  .map((p) => {
    const base = p.images![0].src.replace(/-900\.jpg$/, "");
    return { key: p.slug, thumbWebp: `${base}-480.webp 480w, ${base}-900.webp 900w`, thumbJpg: `${base}-900.jpg`, fullWebp: `${base}-900.webp`, fullJpg: `${base}-900.jpg`, alt: p.images![0].alt, label: p.name, ratio: 1 };
  });

export default async function GalleryPage({ params }: { params: Promise<{ lang: string }> }) {
  const locale = await localeOf(params);
  return (
    <>
      <PageHeader
        locale={locale}
        crumbs={[{ label: "Media Hub", path: "/media" }, { label: "Gallery" }]}
        title="Gallery"
        answer="Campaign posters in English, Hausa, Yorùbá and Igbo, photos of the Nigerians TBH One works for, the candidates and the official merch. Open any picture full size and move between them with the arrow keys; the posters download in print quality."
      />
      <Section title="Campaign posters" intro="Download, print and share with credit.">
        <GalleryLightbox items={POSTERS} />
      </Section>
      <Section alt title="The Nigerians we're working for" intro="Traders, graduates, teachers, elders and families across the country.">
        <GalleryLightbox items={PEOPLE} />
      </Section>
      <Section title="The candidates" intro="The NDC ticket for the presidential election on 16 January 2027.">
        <GalleryLightbox items={CANDIDATES} />
      </Section>
      <Section alt title="Official merch" intro={`${MERCH.length} items from the TBH One Shop.`}>
        <GalleryLightbox items={MERCH} />
        <Notice title="Consent">We publish photos of people only with their signed consent, and never photos of children without a parent&apos;s permission. To ask for a photo to be removed, use Support.</Notice>
      </Section>
    </>
  );
}
