import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import "@/styles/content.css";
import { href, isLocale, type Locale } from "@/lib/i18n";
import { pageMeta, withLocales, site } from "@/lib/meta";
import { CtaBand, PageHeader, Section, Sources } from "@/components/ui/Page";
import { answerBySlug, answers } from "@/data/answers";
import { JsonLd } from "@/lib/seo";

export const dynamicParams = false;
export function generateStaticParams() {
  return withLocales(answers.map((a) => ({ slug: a.slug })));
}
export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  const a = answerBySlug(slug);
  if (!a) return {};
  return pageMeta(lang as Locale, `/answers/${a.slug}`, a.question, a.answer.length > 160 ? `${a.answer.slice(0, 157).replace(/\s\S*$/, "")}…` : a.answer, { type: "article" });
}

export default async function AnswerPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const a = answerBySlug(slug);
  if (!a) notFound();
  const L = (p: string) => href(lang, p);
  const related = a.related.map(answerBySlug).filter((x): x is NonNullable<typeof x> => !!x);
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          url: `${site.url}${href(lang, `/answers/${a.slug}`)}`,
          mainEntity: [{ "@type": "Question", name: a.question, acceptedAnswer: { "@type": "Answer", text: [a.answer, ...a.detail].join(" ") } }],
        }}
      />
      <PageHeader
        locale={lang}
        crumbs={[{ label: "Questions Answered", path: "/answers" }, { label: a.topic, path: `/answers#${a.topic.toLowerCase().replace(/[^a-z]+/g, "-")}` }, { label: a.question }]}
        title={a.question}
        kicker={a.topic}
        answer={a.answer}
        updated="2026-10-23"
      />
      <Section id="detail" narrow>
        <div className="prose">
          {a.detail.map((d, i) => (
            <p key={i}>{d}</p>
          ))}
        </div>
        {a.links.length > 0 && (
          <p style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 24 }}>
            {a.links.map((l, i) =>
              l.path.startsWith("http") ? (
                <a key={l.path} href={l.path} className={`btn ${i ? "btn-outline" : "btn-primary"}`} target="_blank" rel="noopener noreferrer">
                  {l.label} <ArrowRight size={16} aria-hidden />
                </a>
              ) : (
                <Link key={l.path} href={L(l.path)} className={`btn ${i ? "btn-outline" : "btn-primary"}`}>
                  {l.label} <ArrowRight size={16} aria-hidden />
                </Link>
              ),
            )}
          </p>
        )}
        <Sources items={a.sources} />
      </Section>
      {related.length > 0 && (
        <Section id="related" title="Related questions" alt narrow>
          <ul className="q-list" role="list">
            {related.map((r) => (
              <li key={r.slug}>
                <Link href={L(`/answers/${r.slug}`)}>
                  <span>{r.question}</span>
                  <ArrowRight size={18} aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}
      <CtaBand
        title="Tell one person what you learned"
        actions={
          <>
            <Link href={L("/join")} className="btn btn-primary">
              Join TBH One free
            </Link>
            <Link href={L("/answers")} className="btn btn-outline">
              All questions
            </Link>
          </>
        }
      />
    </>
  );
}
