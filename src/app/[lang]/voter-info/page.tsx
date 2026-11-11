import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import "@/styles/content.css";
import { href, isLocale, type Locale } from "@/lib/i18n";
import { localeParams, pageMeta } from "@/lib/meta";
import { Faq, FactList, Notice, PageHeader, Section, Sources } from "@/components/ui/Page";
import { INEC_CVR_URL, INEC_IREV_URL, INEC_URL } from "@/lib/campaign";
import { INEC_SOURCE, INEC_URL_REPORT, PRD } from "@/data/factsheet";
import { PhotoFigure } from "@/components/PeopleMosaic";
import { electionPhoto } from "@/data/photos";

export const generateStaticParams = localeParams;
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return pageMeta(lang as Locale, "/voter-info", "Voter Information: PVC collection, polling units and Election Day", "How to collect your PVC, find your polling unit with INEC and get ready for Election Day on Saturday 16 January 2027.");
}

export default async function VoterInfoPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return (
    <>
      <PageHeader
        locale={lang}
        crumbs={[{ label: "Campaign Hub", path: "/message" }, { label: "Voter Information" }]}
        title="Voter information for the 2027 election"
        answer="To vote on Saturday 16 January 2027 you need your own Permanent Voter Card (PVC) and to vote at the polling unit where you registered. INEC — not TBH One or any party — issues PVCs and runs polling units, so check your registration and polling unit on INEC’s official portals. Never share your PVC or its number with anyone."
        updated="2026-10-23"
      />
      <Section id="key-dates" title="Key dates" narrow>
        <FactList
          items={[
            { label: "Presidential & National Assembly elections", value: "Saturday 16 January 2027" },
            { label: "Campaigning ends", value: "11:59 pm, Thursday 14 January 2027" },
            { label: "Governorship & State Assembly elections", value: "Saturday 6 February 2027" },
            { label: "Official results", value: "INEC Result Viewing Portal (IReV) only" },
          ]}
        />
      </Section>
      <Section id="pvc" title="Collecting your PVC" alt narrow>
        <ol className="prose" style={{ paddingLeft: "1.4em" }}>
          <li>Check INEC’s announcements for the PVC collection period and locations — usually the INEC office in your Local Government Area or designated ward centres.</li>
          <li>Take your registration slip or registration details and a means of identification.</li>
          <li>Collect your card in person. PVCs are not transferable.</li>
          <li>Keep it safe. Do not sell it, lend it, photograph it for anyone or give its number to anyone.</li>
        </ol>
        <Notice tone="warn" title="TBH One never asks for your PVC">
          No TBH One form, dashboard, giveaway or reward asks for your PVC number or how you will vote. If someone claiming to be from TBH One asks, report it.
        </Notice>
      </Section>
      <Section id="polling-unit" title="Find your polling unit" narrow>
        <p>Use INEC&apos;s official Continuous Voter Registration portal to check your registration status and polling unit.</p>
        <p style={{ marginTop: 16, display: "flex", flexWrap: "wrap", gap: 12 }}>
          <a className="btn btn-primary" href={INEC_CVR_URL} target="_blank" rel="noopener">
            INEC voter portal <ExternalLink size={16} aria-hidden />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          <a className="btn btn-outline" href={INEC_URL} target="_blank" rel="noopener">
            INEC website <ExternalLink size={16} aria-hidden />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </p>
      </Section>
      <Section id="election-day" title="Election Day guide" alt narrow>
        <div style={{ marginBottom: "var(--s5)", maxWidth: 720 }}>
          <PhotoFigure photo={electionPhoto} />
        </div>
        <ul className="prose" style={{ paddingLeft: "1.4em" }}>
          <li>Go to the polling unit where you registered and take your own PVC.</li>
          <li>Arrive early and follow instructions from INEC officials.</li>
          <li>Check INEC guidance on accreditation hours and on phones and cameras in the polling area.</li>
          <li>Stay peaceful. Report violence or intimidation to the police and security agencies on duty.</li>
          <li>
            Wait for official results from INEC. TBH One links only to the{" "}
            <a href={INEC_IREV_URL} target="_blank" rel="noopener">
              INEC Result Viewing Portal
            </a>
            .
          </li>
        </ul>
      </Section>
      <Section id="faq" narrow>
        <Faq
          items={[
            { q: "Can TBH One check my registration for me?", a: "No. Only INEC can confirm your registration and polling unit. TBH One does not store polling-unit data about members." },
            { q: "Can I vote anywhere?", a: "No. You vote at the polling unit where you registered, with your own PVC." },
            { q: "I live abroad. Can I vote?", a: "Nigerians abroad cannot currently vote from abroad. You can still take part through Tell One." },
          ]}
        />
        <p style={{ marginTop: 16 }}>
          Related: <Link href={href(lang, "/election")}>Election timeline</Link> · <Link href={href(lang, "/answers/how-do-i-find-my-polling-unit")}>How do I find my polling unit?</Link>
        </p>
        <Sources items={[{ label: "Independent National Electoral Commission (INEC)", url: INEC_URL }, { label: INEC_SOURCE, url: INEC_URL_REPORT }, { label: PRD }]} />
      </Section>
    </>
  );
}
