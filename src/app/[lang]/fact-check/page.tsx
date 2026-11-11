import Link from "next/link";
import { notFound } from "next/navigation";
import "@/styles/content.css";
import { href, isLocale, type Locale } from "@/lib/i18n";
import { localeParams, pageMeta } from "@/lib/meta";
import { CtaBand, PageHeader, Section } from "@/components/ui/Page";
import { factChecks } from "@/data/factchecks";
import { formatDate } from "@/lib/format";

export const generateStaticParams = localeParams;
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return pageMeta(lang as Locale, "/fact-check", "Fact Check: claims about TBH One and the 2027 election", "TBH One checks claims about the movement, the NDC ticket and the 2027 election against named, dated sources, and publishes a clear verdict.");
}

export default async function FactCheckIndex({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const L = (p: string) => href(lang, p);
  return (
    <>
      <PageHeader
        locale={lang}
        crumbs={[{ label: "Campaign Hub", path: "/message" }, { label: "Fact Check" }]}
        title="Fact Check"
        answer="The Fact Check desk tests claims circulating about TBH One, the NDC ticket and the 2027 election against named, dated sources. Each check states the claim, gives one verdict — True, False, Misleading or Outdated — explains the evidence in plain language and lists its sources, so you can share the correction with confidence."
        updated="2026-10-23"
      />
      <Section id="checks">
        <ul className="news-list" role="list">
          {factChecks.map((f) => (
            <li key={f.slug} className="news-row" style={{ display: "block" }}>
              <p style={{ margin: "0 0 8px" }}>
                <span className={`verdict verdict-${f.verdict}`}>{f.verdict}</span> <span className="small muted">Checked {formatDate(f.checked)}</span>
              </p>
              <h2 style={{ fontSize: "var(--step-1)", margin: "0 0 6px" }}>
                <Link href={L(`/fact-check/${f.slug}`)}>{f.claim}</Link>
              </h2>
              <p className="muted" style={{ margin: 0 }}>
                {f.summary}
              </p>
            </li>
          ))}
        </ul>
      </Section>
      <CtaBand
        title="Seen a claim we should check?"
        text="Send it through the contact form with where you saw it. We only check claims that can be tested against a public, dated source."
        actions={
          <Link href={L("/contact")} className="btn btn-primary">
            Send a claim
          </Link>
        }
      />
    </>
  );
}
