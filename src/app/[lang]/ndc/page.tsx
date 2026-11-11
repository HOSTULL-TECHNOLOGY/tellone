import Link from "next/link";
import { notFound } from "next/navigation";
import "@/styles/content.css";
import { href, isLocale, type Locale } from "@/lib/i18n";
import { localeParams, pageMeta, site } from "@/lib/meta";
import { CtaBand, Faq, FactList, PageHeader, Section, Sources } from "@/components/ui/Page";
import { TICKET_SOURCE, TICKET_URL } from "@/data/factsheet";

export const generateStaticParams = localeParams;
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return pageMeta(lang as Locale, "/ndc", "The NDC: Nigeria Democratic Congress", "The Nigeria Democratic Congress (NDC) is the party on whose ticket Peter Obi and Rabiu Musa Kwankwaso contest the 2027 election. How TBH One relates to it.");
}

export default async function NdcPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const L = (p: string) => href(lang, p);
  return (
    <>
      <PageHeader
        locale={lang}
        crumbs={[{ label: "The Party" }, { label: "The NDC" }]}
        title="The Nigeria Democratic Congress (NDC)"
        answer="The Nigeria Democratic Congress (NDC) is the political party on whose ticket Peter Obi and Rabiu Musa Kwankwaso are contesting the presidential election on 16 January 2027. TBH One works with the NDC to drive participation, but it is a separate, supporting initiative: joining TBH One does not make you a party member, and party membership runs through the NDC's own channels."
        updated="2026-10-23"
      />
      <Section id="facts" title="Key facts" narrow>
        <FactList
          cols={1}
          items={[
            { label: "Full name", value: "Nigeria Democratic Congress (NDC)" },
            { label: "2027 presidential ticket", value: "Peter Obi (president) and Rabiu Musa Kwankwaso (vice president)" },
            { label: "Ticket confirmed", value: "Special convention, Abuja, 30 May 2026" },
            {
              label: "Official party website",
              value: site.ndcOfficialSite ? (
                <a href={site.ndcOfficialSite} target="_blank" rel="noopener noreferrer">
                  {site.ndcOfficialSite}
                </a>
              ) : (
                <span className="chip">Pending verification</span>
              ),
            },
          ]}
        />
        <Sources items={[{ label: TICKET_SOURCE, url: TICKET_URL, date: "31 May 2026" }]} />
      </Section>
      <Section narrow>
        <Faq
          items={[
            { q: "Is TBH One part of the NDC?", a: "No. TBH One is a supporting initiative that works with the NDC. It has its own free membership, its own transparency commitments and its own leaders." },
            { q: "Does joining TBH One make me an NDC member?", a: "No. Party membership is handled only by the NDC through its official registration process." },
            { q: "I want to run for office on the NDC platform. Can TBH One help?", a: "TBH One offers a paid service line for NDC aspirants, covering photography, websites and media production. It does not decide or influence party nominations." },
          ]}
        />
      </Section>
      <CtaBand
        title="Aspiring for office on the NDC platform?"
        actions={
          <>
            <Link href={L("/aspirants")} className="btn btn-primary">Aspirant services</Link>
            <Link href={L("/candidates")} className="btn btn-outline">The candidates</Link>
          </>
        }
      />
    </>
  );
}
