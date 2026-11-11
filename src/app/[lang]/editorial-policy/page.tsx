import Link from "next/link";
import { notFound } from "next/navigation";
import "@/styles/content.css";
import { href, isLocale, type Locale } from "@/lib/i18n";
import { localeParams, pageMeta } from "@/lib/meta";
import { Notice, PageHeader, Section } from "@/components/ui/Page";

export const generateStaticParams = localeParams;
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return pageMeta(lang as Locale, "/editorial-policy", "Editorial and Corrections Policy", "How TBH One sources, reviews, labels and corrects what it publishes: named sources, dated facts, no invented quotes and open corrections.");
}

const SECTIONS: { h: string; p?: string; list?: string[] }[] = [
  { h: "What this policy covers", p: "Everything TBH One publishes: web pages, Questions Answered, Fact Checks, news articles, the Fact Sheet, social posts, WhatsApp Channel updates and printed materials." },
  {
    h: "Sourcing",
    list: [
      "Every factual claim is checked against a named source with a date. Official facts come from the Concept Note, INEC, or published reporting we cite.",
      "We never invent statistics, quotes, endorsements or testimonials. If a figure is a target, an estimate or demonstration data, it is labelled as such.",
      "We do not publish quotes from the candidates unless they are from a verifiable public record, cited with the source.",
      "Election results come only from INEC. We link to its IReV portal and never publish our own tallies.",
    ],
  },
  {
    h: "Review before publication",
    list: [
      "Each piece is written by the Editorial Desk and reviewed by a second editor for accuracy and tone.",
      "Translations into Pidgin, Yorùbá, Hausa and Igbo are reviewed by a native-speaker translator before they go live.",
      "Pieces about money, safety or voting rules are also reviewed by the Transparency or Safeguarding lead.",
    ],
  },
  {
    h: "Labelling",
    list: [
      "Opinion and campaign messages are labelled as TBH One's position, separate from factual explainers.",
      "AI-assisted material, such as the campaign songs, is labelled as AI-assisted.",
      "Drafts, demonstration data and pending details are labelled on the page until approved.",
    ],
  },
  {
    h: "Corrections",
    list: [
      "If we get something wrong, we correct it promptly and say so at the end of the page, with the date and what changed.",
      "Significant errors are also noted on the News page and, where we shared the error, on the same channel.",
      "We do not silently delete published content to hide mistakes.",
    ],
  },
  { h: "Fact Check standards", p: "We only check claims that can be tested against a public, dated source. Each check gives one verdict — True, False, Misleading or Outdated — explains the evidence and lists its sources. We publish fact checks on claims about TBH One as well as claims that favour it." },
  { h: "Independence", p: "TBH One supports Peter Obi, Rabiu Musa Kwankwaso and the NDC, and says so. We do not speak for them; official statements come from their own channels." },
];

export default async function EditorialPolicyPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const L = (p: string) => href(lang, p);
  return (
    <>
      <PageHeader
        locale={lang}
        crumbs={[{ label: "Policies", path: "/sitemap" }, { label: "Editorial and Corrections Policy" }]}
        title="Editorial and Corrections Policy"
        answer="TBH One publishes only facts it can source to a named, dated record, never invents quotes or figures, labels drafts and demonstration data, and corrects mistakes openly with a dated note. Every article, answer and fact check is reviewed by a second editor, and translations are checked by native speakers before they go live."
        updated="2026-10-23"
      />
      <Section narrow>
        <Notice tone="warn" title="Draft — pending legal review">
          This policy is a draft and may change once reviewed by TBH One&apos;s legal adviser.
        </Notice>
        <div className="prose" style={{ marginTop: 24 }}>
          {SECTIONS.map((s) => (
            <section key={s.h}>
              <h2>{s.h}</h2>
              {s.p && <p>{s.p}</p>}
              {s.list && (
                <ul>
                  {s.list.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
          <h2>Report an error</h2>
          <p>
            Tell us through the <Link href={L("/contact")}>contact form</Link> with the page address and what is wrong. We acknowledge reports within two working days.
          </p>
        </div>
      </Section>
    </>
  );
}
