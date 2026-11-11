import Link from "next/link";
import { notFound } from "next/navigation";
import "@/styles/content.css";
import { href, isLocale, type Locale } from "@/lib/i18n";
import { localeParams, pageMeta, site } from "@/lib/meta";
import { CardGrid, FactList, LinkCard, PageHeader, Section } from "@/components/ui/Page";
import { FactSheetTable } from "@/components/content/FactSheetTable";
import { newsArticles } from "@/data/news";
import { formatDate } from "@/lib/format";

export const generateStaticParams = localeParams;
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return pageMeta(lang as Locale, "/press", "Press room: TBH One media centre", "Press releases, the TBH One Fact Sheet, brand assets and media contact details for journalists covering TBH One and the 2027 election.");
}

export default async function PressPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const L = (p: string) => href(lang, p);
  return (
    <>
      <PageHeader
        locale={lang}
        crumbs={[{ label: "Resources" }, { label: "Press room" }]}
        title="Press room"
        answer="The press room is the starting point for journalists covering TBH One. It holds the approved Fact Sheet with sources and dates for every figure, recent releases and explainers, downloadable logos and posters, and the media contact. TBH One speaks for itself only; for statements from the candidates or the NDC, contact them directly."
        updated="2026-10-23"
      />
      <Section id="contact" title="Media contact" narrow>
        <FactList
          cols={1}
          items={[
            { label: "Press email", value: site.contact.pressEmail ?? <><span className="chip">Pending</span> <span className="small muted">to be published by the National Coordination team</span></> },
            { label: "Response time", value: "Within one working day during the campaign" },
            { label: "Interview requests", value: "Include outlet, deadline, topic and preferred language" },
          ]}
        />
      </Section>
      <Section id="factsheet" title="Fact Sheet" alt>
        <FactSheetTable />
      </Section>
      <Section id="releases" title="Latest releases and explainers">
        <ul className="q-list" role="list">
          {newsArticles.map((a) => (
            <li key={a.slug}>
              <Link href={L(`/news/${a.slug}`)}>
                <span>{a.title}</span>
                <time className="small muted" dateTime={a.date}>{formatDate(a.date)}</time>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
      <Section id="assets" title="Assets and policies" alt>
        <CardGrid>
          <LinkCard locale={lang} path="/downloads" title="Logos, posters and songs" text="Full-resolution brand assets for publication." />
          <LinkCard locale={lang} path="/editorial-policy" title="Editorial and corrections policy" text="How we source, review and correct what we publish." />
          <LinkCard locale={lang} path="/fact-check" title="Fact Check" text="Verdicts on claims circulating about TBH One." />
          <LinkCard locale={lang} path="/transparency" title="Transparency" text="Monthly spend reports and contracts." />
        </CardGrid>
      </Section>
    </>
  );
}
