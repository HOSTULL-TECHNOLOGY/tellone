import Link from "next/link";
import { notFound } from "next/navigation";
import "@/styles/content.css";
import { href, isLocale, type Locale } from "@/lib/i18n";
import { localeParams, pageMeta } from "@/lib/meta";
import { CtaBand, PageHeader, Section } from "@/components/ui/Page";
import { JsonLd } from "@/lib/seo";

export const generateStaticParams = localeParams;
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return pageMeta(lang as Locale, "/faq", "TBH One FAQ: membership, money, voting and safety", "Answers to common questions about TBH One: free membership, project funding, leaders, the Shop, the 2027 election, privacy and staying safe.");
}

const GROUPS: { title: string; id: string; items: { q: string; a: string }[] }[] = [
  {
    title: "Membership",
    id: "membership",
    items: [
      { q: "Is TBH One membership free?", a: "Yes. Membership is free and always will be. There are no joining fees or monthly dues. Anyone asking you to pay to join is not TBH One." },
      { q: "Who can join?", a: "Any Nigerian aged 18 or over, at home or abroad. You do not need to be a member of the NDC or any party." },
      { q: "How do I join?", a: "Use the Join page on this website or, from 10 November 2026, the TBH One app. You need a phone number; an email is optional." },
      { q: "Can I leave and delete my data?", a: "Yes. You can delete your account from your dashboard settings at any time. We remove your personal data as described in the privacy notice." },
    ],
  },
  {
    title: "Money and projects",
    id: "money",
    items: [
      { q: "If membership is free, how is TBH One funded?", a: "Members and supporters fund specific, published community projects. Each project shows its budget, what has been raised and proof of delivery." },
      { q: "Where can I see how money is spent?", a: "The Transparency page publishes monthly spend reports by category, the contracts we sign and a downloadable CSV." },
      { q: "Can Nigerians abroad donate?", a: "Diaspora members can fund projects through the approved payment channels shown at checkout. Never send money to a personal account." },
      { q: "Can I propose a project for my community?", a: "Yes. Ward leaders submit project proposals with a cost. Approved projects are published for funding." },
    ],
  },
  {
    title: "Leaders and volunteering",
    id: "leaders",
    items: [
      { q: "How do I become a ward or street leader?", a: "Apply on the Ward Leaders or Street Leaders page. Applications are reviewed, and approved leaders receive a verifiable leader ID." },
      { q: "Are leaders paid?", a: "Street leaders can earn from defined, verified tasks. All payments run through controlled channels with approval steps and audit logs." },
      { q: "How do I check that someone is a real TBH One leader?", a: "Enter their leader ID on the Verify page. A real ID shows as valid; anything else should be treated with caution and reported." },
    ],
  },
  {
    title: "The election and voting",
    id: "election",
    items: [
      { q: "When is the 2027 presidential election?", a: "Saturday 16 January 2027, as set by INEC. Governorship and State Assembly elections follow on Saturday 6 February 2027." },
      { q: "Does TBH One ask how I will vote?", a: "No. TBH One never records how anyone votes or intends to vote, and never asks for your PVC number or a photograph of your ballot." },
      { q: "Does TBH One publish results?", a: "No. Official results come only from INEC, including its IReV results viewing portal. We link to it on election day." },
    ],
  },
  {
    title: "Safety and privacy",
    id: "safety",
    items: [
      { q: "How do I report a concern or a scam?", a: "Use the Report page. You can report anonymously. Safeguarding concerns involving children or vulnerable adults are handled with priority." },
      { q: "What data does TBH One keep?", a: "Only what is needed to run your membership and the features you use. The privacy notice explains what we hold, why, for how long and your rights under the NDPA and GDPR." },
      { q: "Is TBH One the candidates' official campaign?", a: "No. TBH One is a supporting initiative working with the NDC. It does not speak for Peter Obi, Rabiu Musa Kwankwaso or the party." },
    ],
  },
];

export default async function FaqPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const L = (p: string) => href(lang, p);
  const all = GROUPS.flatMap((g) => g.items);
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: all.map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a } })) }} />
      <PageHeader
        locale={lang}
        crumbs={[{ label: "Resources" }, { label: "FAQ" }]}
        title="Frequently asked questions"
        answer={`These are the ${all.length} questions members and visitors ask most about TBH One, grouped by membership, money and projects, leaders, the election and safety. Membership is free, money goes only to published projects you can track, and TBH One never asks how you vote. For deeper, sourced answers on a single question, see Questions Answered.`}
        updated="2026-10-23"
      />
      <Section narrow>
        <nav aria-label="FAQ topics" className="tags">
          {GROUPS.map((g) => (
            <a key={g.id} href={`#${g.id}`} className="chip">
              {g.title}
            </a>
          ))}
        </nav>
      </Section>
      <Section narrow>
        {GROUPS.map((g) => (
          <div className="faq" id={g.id} key={g.id}>
            <h2 className="faq-title">{g.title}</h2>
            {g.items.map((f) => (
              <details key={f.q} className="faq-item">
                <summary>
                  <h3>{f.q}</h3>
                </summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        ))}
      </Section>
      <CtaBand
        title="Still have a question?"
        actions={
          <>
            <Link href={L("/answers")} className="btn btn-primary">Questions Answered</Link>
            <Link href={L("/contact")} className="btn btn-outline">Contact us</Link>
          </>
        }
      />
    </>
  );
}
