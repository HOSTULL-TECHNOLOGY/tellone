import { notFound } from "next/navigation";
import "@/styles/content.css";
import { isLocale, type Locale } from "@/lib/i18n";
import { localeParams, pageMeta } from "@/lib/meta";
import { PageHeader, Section, Sources } from "@/components/ui/Page";
import { StatesBrowser } from "@/components/content/StatesBrowser";
import { CONCEPT_NOTE } from "@/data/factsheet";

export const generateStaticParams = localeParams;
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return pageMeta(lang as Locale, "/states", "Your State: TBH One in all 36 states and the FCT", "Find TBH One in your state: leaders, projects, events and every Local Government Area across all 36 states and the FCT.");
}

export default async function StatesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return (
    <>
      <PageHeader
        locale={lang}
        crumbs={[{ label: "Campaign Hub", path: "/message" }, { label: "Your State" }]}
        title="TBH One in your state"
        answer="TBH One organises in all 36 states and the Federal Capital Territory, across 774 Local Government Areas and 8,809 electoral wards. Choose your state to see its leaders, projects open for funding, upcoming events and every LGA, then join the ward and street teams near you."
        updated="2026-10-23"
      />
      <Section id="states">
        <StatesBrowser locale={lang as Locale} />
        <Sources items={[{ label: CONCEPT_NOTE }]} />
      </Section>
    </>
  );
}
