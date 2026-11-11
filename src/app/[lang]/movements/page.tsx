import { notFound } from "next/navigation";
import "@/styles/content.css";
import { isLocale, type Locale } from "@/lib/i18n";
import { localeParams, pageMeta } from "@/lib/meta";
import { CardGrid, Notice, PageHeader, Section, Sources } from "@/components/ui/Page";
import { CONCEPT_NOTE, MENU_DOC } from "@/data/factsheet";

export const generateStaticParams = localeParams;
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return pageMeta(lang as Locale, "/movements", "Supporting Movements: Obidient and Kwankwasiyya", "The Obidient Movement and the Kwankwasiyya Movement, shown on TBH One with their consent.");
}

export default async function MovementsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return (
    <>
      <PageHeader
        locale={lang}
        crumbs={[{ label: "The Movement", path: "/about" }, { label: "Supporting Movements" }]}
        title="Supporting movements"
        answer="TBH One works alongside two established support movements: the Obidient Movement, associated with Peter Obi, and the Kwankwasiyya Movement, led by Rabiu Musa Kwankwaso. They are independent of TBH One. Their pages, events and official links appear here only with each movement’s consent, and TBH One does not speak for either."
        updated="2026-10-23"
      />
      <Section id="movements">
        <Notice tone="info" title="Shown with consent">
          The Revised Website Menu requires these movements to appear only with their consent. Official links, contacts and event feeds will be added once each movement confirms them.
        </Notice>
        <div style={{ height: 16 }} />
        <CardGrid min={300}>
          <article className="card">
            <h2 style={{ fontSize: "var(--step-3)" }}>Obidient Movement</h2>
            <p>A citizen-led support movement associated with Peter Obi, the NDC presidential candidate. Listed by the Concept Note among TBH One&apos;s political partners.</p>
            <p className="small muted">Official channels: pending confirmation by the movement.</p>
          </article>
          <article className="card">
            <h2 style={{ fontSize: "var(--step-3)" }}>Kwankwasiyya Movement</h2>
            <p>The support movement led by Rabiu Musa Kwankwaso, Peter Obi&apos;s running mate on the NDC ticket. Listed by the Concept Note among TBH One&apos;s political partners.</p>
            <p className="small muted">Official channels: pending confirmation by the movement.</p>
          </article>
        </CardGrid>
        <Sources items={[{ label: CONCEPT_NOTE }, { label: MENU_DOC }]} />
      </Section>
    </>
  );
}
