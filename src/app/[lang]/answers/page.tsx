import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import "@/styles/content.css";
import { href, isLocale, type Locale } from "@/lib/i18n";
import { localeParams, pageMeta } from "@/lib/meta";
import { CtaBand, PageHeader, Section } from "@/components/ui/Page";
import { answers, answerTopics } from "@/data/answers";

export const generateStaticParams = localeParams;
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return pageMeta(lang as Locale, "/answers", "Questions Answered: TBH One, the election and voting", "Straight answers to the questions Nigerians ask about TBH One, the 2027 election, voting, membership, projects and safety, each with sources.");
}

export default async function AnswersPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const L = (p: string) => href(lang, p);
  return (
    <>
      <PageHeader
        locale={lang}
        crumbs={[{ label: "Campaign Hub", path: "/message" }, { label: "Questions Answered" }]}
        title="Questions answered"
        answer={`This hub gives short, sourced answers to the ${answers.length} questions people ask most about TBH One, the 16 January 2027 election, voting, free membership, project funding, leaders and safety. Each answer leads with a direct reply in under 60 words, then the detail, the links you need and the sources it rests on.`}
        updated="2026-10-23"
      />
      <Section id="topics">
        <nav aria-label="Topics" className="tags" style={{ marginBottom: 24 }}>
          {answerTopics.map((t) => (
            <a key={t} href={`#${t.toLowerCase().replace(/[^a-z]+/g, "-")}`} className="chip">
              {t}
            </a>
          ))}
        </nav>
        {answerTopics.map((t) => (
          <div key={t} className="answer-topic" id={t.toLowerCase().replace(/[^a-z]+/g, "-")}>
            <h2>{t}</h2>
            <ul className="q-list" role="list">
              {answers
                .filter((a) => a.topic === t)
                .map((a) => (
                  <li key={a.slug}>
                    <Link href={L(`/answers/${a.slug}`)}>
                      <span>{a.question}</span>
                      <ChevronRight size={18} aria-hidden />
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </Section>
      <CtaBand
        title="Did not find your question?"
        text="Read the full FAQ or check a claim you have seen on the Fact Check desk."
        actions={
          <>
            <Link href={L("/faq")} className="btn btn-primary">
              Read the FAQ
            </Link>
            <Link href={L("/fact-check")} className="btn btn-outline">
              Fact Check
            </Link>
          </>
        }
      />
    </>
  );
}
