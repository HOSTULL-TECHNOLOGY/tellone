import Link from "next/link";
import { notFound } from "next/navigation";
import "@/styles/content.css";
import { href, isLocale, type Locale } from "@/lib/i18n";
import { localeParams, pageMeta } from "@/lib/meta";
import { getDict } from "@/i18n";
import { PageHeader, Section } from "@/components/ui/Page";
import { mainNav, footerUtility, legalLinks } from "@/data/nav";
import { answers } from "@/data/answers";
import { factChecks } from "@/data/factchecks";
import { newsArticles } from "@/data/news";
import { states } from "@/data/states";

export const generateStaticParams = localeParams;
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return pageMeta(lang as Locale, "/sitemap", "Sitemap: every TBH One page", "A complete list of TBH One pages: the movement, Campaign Hub, getting involved, the Party, Shop, Media Hub, resources, states and policies.");
}

export default async function SitemapPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDict(lang);
  const L = (p: string) => href(lang, p);
  const List = ({ title, links }: { title: string; links: { label: string; path: string }[] }) => (
    <div>
      <h2>{title}</h2>
      <ul role="list">
        {links.map((l) => (
          <li key={l.path}>
            <Link href={L(l.path)}>{l.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
  return (
    <>
      <PageHeader
        locale={lang}
        crumbs={[{ label: "Resources" }, { label: "Sitemap" }]}
        title="Sitemap"
        answer="This page lists every public TBH One page in one place, grouped the same way as the main menu: the movement, the Campaign Hub, ways to get involved, opportunities, the Media Hub, the Shop, the Party and resources, followed by questions answered, fact checks, news, all 37 state pages and our policies."
        updated="2026-10-23"
      />
      <Section>
        <div className="sitemap-grid">
          <List title="Home" links={[{ label: "Home", path: "/" }]} />
          {mainNav.map((m) => (
            <List key={m.key} title={t.nav[m.key] as string} links={m.groups.flatMap((g) => g.links)} />
          ))}
          <List title="Find and check" links={footerUtility} />
          <List title="Policies" links={legalLinks} />
        </div>
      </Section>
      <Section alt>
        <div className="sitemap-grid">
          <List title="Questions answered" links={answers.map((a) => ({ label: a.question, path: `/answers/${a.slug}` }))} />
          <List title="Fact checks" links={factChecks.map((f) => ({ label: f.claim, path: `/fact-check/${f.slug}` }))} />
          <List title="News" links={newsArticles.map((n) => ({ label: n.title, path: `/news/${n.slug}` }))} />
          <List title="States" links={states.map((s) => ({ label: s.name, path: `/states/${s.slug}` }))} />
        </div>
      </Section>
    </>
  );
}
