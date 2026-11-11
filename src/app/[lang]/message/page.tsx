import Link from "next/link";
import { notFound } from "next/navigation";
import "@/styles/content.css";
import { href, isLocale, type Locale } from "@/lib/i18n";
import { localeParams, pageMeta } from "@/lib/meta";
import { CtaBand, PageHeader, Section, Sources } from "@/components/ui/Page";
import { CorruptionChain, Hashtags, PosterGallery, TaglineList } from "@/components/content/FactSheetTable";
import { CONCEPT_NOTE } from "@/data/factsheet";

export const generateStaticParams = localeParams;
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return pageMeta(lang as Locale, "/message", "The Message: why corruption is the root cause", "TBH One’s campaign message: the corruption chain, the ad copy in five languages, the official hashtags and the campaign posters.");
}

export default async function MessagePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const L = (p: string) => href(lang, p);
  return (
    <>
      <PageHeader
        locale={lang}
        crumbs={[{ label: "Campaign Hub", path: "/message" }, { label: "The Message" }]}
        title="The Message: one root cause, one promise"
        kicker="We will not steal your money."
        answer="TBH One’s message traces Nigeria’s core problems — unemployment, insecurity, poor healthcare, weak infrastructure, unreliable power, poor water access and failing education — back to one root cause: corruption and the diversion of public funds. It sums that up in one repeatable promise, run as ad copy in five languages with two official hashtags."
        updated="2026-10-23"
      />
      <Section id="chain" title="The corruption chain" intro="No corruption leads to each of these downstream effects." narrow>
        <CorruptionChain />
      </Section>
      <Section id="ad-copy" title="Ad copy in five languages" intro="The ad copy is the tagline itself, run in each of Nigeria’s major languages." alt narrow>
        <TaglineList />
        <div style={{ marginTop: 16 }}>
          <Hashtags />
        </div>
      </Section>
      <Section id="principles" title="How we keep the message credible" narrow>
        <ul className="prose" style={{ paddingLeft: "1.4em" }}>
          <li>Pair the corruption chain with locally specific proof points — a named road, hospital or school project in each state — so the message stays concrete.</li>
          <li>Avoid direct allegations against named individuals; every claim should withstand fact-checking.</li>
          <li>Use only the two official hashtags across every channel.</li>
          <li>Translators work from a keyword brief in each language, not word-for-word translation.</li>
          <li>Label AI-generated content and declare sponsorship on every creator post.</li>
        </ul>
      </Section>
      <Section id="posters" title="Campaign posters" intro="Official tagline posters. Download them from the Download Center." alt>
        <PosterGallery />
        <Sources items={[{ label: CONCEPT_NOTE }]} />
      </Section>
      <CtaBand
        title="Share the message"
        text="Build a WhatsApp message in your language with the organiser toolkit."
        actions={
          <>
            <Link href={L("/tools")} className="btn btn-primary">
              Message composer
            </Link>
            <Link href={L("/downloads")} className="btn btn-outline">
              Download posters
            </Link>
          </>
        }
      />
    </>
  );
}
