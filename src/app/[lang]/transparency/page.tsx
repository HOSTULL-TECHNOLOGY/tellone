import Link from "next/link";
import { notFound } from "next/navigation";
import "@/styles/content.css";
import { href, isLocale, type Locale } from "@/lib/i18n";
import { localeParams, pageMeta } from "@/lib/meta";
import { Faq, PageHeader, PrototypeNote, Section, Sources } from "@/components/ui/Page";
import { DownloadCsvButton, FundingCounter } from "@/components/content/TransparencyLive";
import { contracts, monthlyReports, spendCategories } from "@/data/transparency";
import { formatDate, formatNaira } from "@/lib/format";
import { JsonLd } from "@/lib/seo";
import { site } from "@/config/site";
import { CONCEPT_NOTE, PRD } from "@/data/factsheet";

export const generateStaticParams = localeParams;
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return pageMeta(lang as Locale, "/transparency", "Transparency: where TBH One’s money comes from and goes", "Live funding counter, monthly income and spend by category as tables and CSV, and every awarded vendor contract with its reason.");
}

export default async function TransparencyPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const L = (p: string) => href(lang, p);
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Dataset",
          name: "TBH One monthly income and spend by category",
          description: "Monthly public summary of income received and spend by category (team, technology, voter contact, media, street activation, community projects, rewards). Prototype dataset with demonstration figures.",
          creator: { "@id": `${site.url}/#organization` },
          license: "https://creativecommons.org/licenses/by/4.0/",
          temporalCoverage: "2026-09/2026-10",
          variableMeasured: ["Income (NGN)", ...spendCategories.map((c) => `${c} (NGN)`)],
          distribution: { "@type": "DataDownload", encodingFormat: "text/csv", contentUrl: `${site.url}${L("/transparency")}#monthly` },
        }}
      />
      <PageHeader
        locale={lang}
        crumbs={[{ label: "The Movement", path: "/about" }, { label: "Transparency" }]}
        title="Transparency: TBH One income and spend"
        answer="Every naira TBH One receives is recorded against a named contributor and a published project. This page shows a live funding counter, a monthly public summary of income and spend by category — generated from the ledger, never typed by hand — with CSV downloads, and every awarded vendor contract with its value and the reason it was awarded."
        updated="2026-10-23"
      />
      <Section id="live" title="Live funding">
        <FundingCounter />
        <PrototypeNote>All figures on this page are demonstration data until the finance ledger is connected. The first real monthly report is due by 5 December 2026.</PrototypeNote>
      </Section>

      <Section id="monthly" title="Monthly spend by category" intro="Published by the 5th of the following month (PRD FN-5, FN-6)." alt action={<DownloadCsvButton />}>
        {monthlyReports.map((r) => {
          const total = spendCategories.reduce((n, c) => n + r.spend[c], 0);
          return (
            <div key={r.month} className="table-wrap" style={{ marginBottom: 24 }}>
              <table className="ctable">
                <caption>
                  {r.label} — published {formatDate(r.published)} <span className="chip chip-demo">Demo data</span>
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Category</th>
                    <th scope="col" className="num">
                      Spend
                    </th>
                    <th scope="col" className="num">
                      Share
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {spendCategories.map((c) => (
                    <tr key={c}>
                      <th scope="row">{c}</th>
                      <td className="num">{formatNaira(r.spend[c])}</td>
                      <td className="num">{total ? Math.round((r.spend[c] / total) * 100) : 0}%</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <th scope="row">Total spend</th>
                    <td className="num">{formatNaira(total)}</td>
                    <td className="num">100%</td>
                  </tr>
                  <tr>
                    <th scope="row">Income received</th>
                    <td className="num">{formatNaira(r.income)}</td>
                    <td className="num" />
                  </tr>
                </tfoot>
              </table>
            </div>
          );
        })}
      </Section>

      <Section id="contracts" title="Awarded vendor contracts" intro="Every awarded contract is listed with the vendor’s name, value and the published reason for the award (PRD VN acceptance criteria).">
        <div className="table-wrap">
          <table className="ctable stack-sm">
            <caption>
              Contracts awarded <span className="chip chip-demo">Demo data</span>
            </caption>
            <thead>
              <tr>
                <th scope="col">Vendor</th>
                <th scope="col">Category</th>
                <th scope="col" className="num">
                  Value
                </th>
                <th scope="col">Awarded</th>
                <th scope="col">Reason</th>
              </tr>
            </thead>
            <tbody>
              {contracts.map((c) => (
                <tr key={c.vendor + c.awarded}>
                  <th scope="row">{c.vendor}</th>
                  <td data-label="Category">{c.category}</td>
                  <td className="num" data-label="Value">
                    {formatNaira(c.value)}
                  </td>
                  <td data-label="Awarded">{formatDate(c.awarded)}</td>
                  <td data-label="Reason">{c.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section id="rules" title="The controls behind these numbers" alt narrow>
        <ul className="prose" style={{ paddingLeft: "1.4em" }}>
          <li>Every contribution is linked to a named contributor so the party can meet its disclosure and spending-limit duties under the Electoral Act 2026.</li>
          <li>Contributions of ₦1,000,000 or more in one payment or one month trigger ID and source-of-funds checks; ₦5,000,000 or more needs legal review before funds are used.</li>
          <li>Funds originating outside Nigeria are held until legal clearance is recorded.</li>
          <li>Every payout needs two different people: one approves, another releases.</li>
          <li>Field payments are released only against approved proof; duplicate photos are flagged automatically.</li>
        </ul>
        <p style={{ marginTop: 16 }}>
          Want to fund something specific? <Link href={L("/projects")}>See projects open for funding</Link>.
        </p>
        <Faq
          items={[
            { q: "Why is this data marked “Demo”?", a: "The website is a prototype. Real figures will be generated from the finance ledger once payments go live on 9 November 2026." },
            { q: "Can I download the data?", a: "Yes — use Download CSV above. The same figures are published here as HTML tables so anyone can read and cite them." },
          ]}
        />
        <Sources items={[{ label: CONCEPT_NOTE }, { label: PRD }]} />
      </Section>
    </>
  );
}
