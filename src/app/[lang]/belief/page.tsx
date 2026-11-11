import Link from "next/link";
import { notFound } from "next/navigation";
import "@/styles/content.css";
import { href, isLocale, type Locale } from "@/lib/i18n";
import { localeParams, pageMeta } from "@/lib/meta";
import { CtaBand, PageHeader, Section, Sources } from "@/components/ui/Page";
import { CorruptionChain, Hashtags, TaglineList } from "@/components/content/FactSheetTable";
import { CONCEPT_NOTE } from "@/data/factsheet";

export const generateStaticParams = localeParams;
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return pageMeta(lang as Locale, "/belief", "Our Belief: Nigeria’s money belongs to Nigerians", "TBH One’s core belief and the tagline “We will not steal your money” in English, Pidgin, Yorùbá, Hausa and Igbo.");
}

export default async function BeliefPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const L = (p: string) => href(lang, p);
  return (
    <>
      <PageHeader
        locale={lang}
        crumbs={[{ label: "The Movement", path: "/about" }, { label: "Our Belief" }]}
        title="Our belief: Nigeria’s money belongs to Nigerians"
        kicker="We will not steal your money."
        answer="TBH One believes that Nigeria’s money belongs to Nigerians. If politicians do not steal public money, there will be enough for development — and their focus will not be divided. That belief is carried by one promise, “We will not steal your money”, published in English, Pidgin, Yorùbá, Hausa and Igbo, with two official hashtags."
        updated="2026-10-23"
      />
      <Section id="tagline" title="The tagline in five languages" narrow>
        <TaglineList />
      </Section>
      <Section id="why" title="Why one promise" alt narrow>
        <div className="prose">
          <p>
            Nigeria&apos;s core problems — unemployment, insecurity, poor healthcare, weak infrastructure, unreliable power, poor water access and failing education — trace back to one root cause: corruption and the diversion of public
            funds. TBH One makes that causal chain simple and repeatable at the grassroots.
          </p>
        </div>
        <div style={{ marginTop: 24 }}>
          <CorruptionChain />
        </div>
      </Section>
      <Section id="hashtags" title="The only two hashtags" narrow>
        <p>These are the only hashtags used across TBH One channels and materials.</p>
        <div style={{ marginTop: 16 }}>
          <Hashtags />
        </div>
        <Sources items={[{ label: CONCEPT_NOTE }]} />
      </Section>
      <CtaBand
        title="Make the promise travel"
        text="Share the message in your language with the organiser toolkit."
        actions={
          <>
            <Link href={L("/tools")} className="btn btn-primary">
              Open the toolkit
            </Link>
            <Link href={L("/message")} className="btn btn-outline">
              Read the message
            </Link>
          </>
        }
      />
    </>
  );
}
