import Link from "next/link";
import { notFound } from "next/navigation";
import "@/styles/content.css";
import { href, isLocale, type Locale } from "@/lib/i18n";
import { localeParams, pageMeta } from "@/lib/meta";
import { CtaBand, PageHeader, Section } from "@/components/ui/Page";
import { NewsList } from "@/components/content/NewsList";
import { newsArticles, newsCategories } from "@/data/news";

export const generateStaticParams = localeParams;
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return pageMeta(lang as Locale, "/news", "News and explainers from TBH One", "Explainers, transparency updates and campaign news from the TBH One Editorial Desk, each with sources and a corrections policy.");
}

export default async function NewsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const L = (p: string) => href(lang, p);
  return (
    <>
      <PageHeader
        locale={lang}
        crumbs={[{ label: "Resources" }, { label: "News" }]}
        title="News and explainers"
        answer="The TBH One newsroom publishes explainers on how the movement works, transparency updates on project funding and campaign news ahead of the 16 January 2027 election. Every article names its author, lists its sources and follows the Editorial and Corrections Policy. Articles marked Draft are awaiting editorial sign-off before publication."
        updated="2026-10-23"
      />
      <Section id="articles">
        <NewsList locale={lang as Locale} rows={newsArticles} categories={newsCategories} />
      </Section>
      <CtaBand
        title="For journalists"
        text="Press releases, the Fact Sheet and brand assets are in the press room."
        actions={
          <>
            <Link href={L("/press")} className="btn btn-primary">Press room</Link>
            <Link href={L("/editorial-policy")} className="btn btn-outline">Editorial policy</Link>
          </>
        }
      />
    </>
  );
}
