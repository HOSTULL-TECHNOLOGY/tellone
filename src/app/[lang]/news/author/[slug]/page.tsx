import Link from "next/link";
import { notFound } from "next/navigation";
import "@/styles/content.css";
import { href, isLocale, type Locale } from "@/lib/i18n";
import { pageMeta, withLocales, site } from "@/lib/meta";
import { PageHeader, Section } from "@/components/ui/Page";
import { authorBySlug, authors, newsArticles } from "@/data/news";
import { formatDate } from "@/lib/format";
import { JsonLd } from "@/lib/seo";

export const dynamicParams = false;
export function generateStaticParams() {
  return withLocales(authors.map((a) => ({ slug: a.slug })));
}
export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  const a = authorBySlug(slug);
  if (!a) return {};
  return pageMeta(lang as Locale, `/news/author/${a.slug}`, `${a.name}: articles`, a.bio.slice(0, 160));
}

export default async function AuthorPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const a = authorBySlug(slug);
  if (!a) notFound();
  const L = (p: string) => href(lang, p);
  const list = newsArticles.filter((x) => x.author === a.name);
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "Organization", name: a.name, description: a.bio, parentOrganization: { "@type": "Organization", name: site.name, url: site.url } }} />
      <PageHeader locale={lang} crumbs={[{ label: "News", path: "/news" }, { label: a.name }]} title={a.name} kicker="Author" answer={`${a.bio} The desk is accountable to the TBH One National Coordination team and publishes corrections openly.`} />
      <Section title={`Articles by ${a.name}`} narrow>
        <ul className="q-list" role="list">
          {list.map((m) => (
            <li key={m.slug}>
              <Link href={L(`/news/${m.slug}`)}>
                <span>{m.title}</span>
                <time className="small muted" dateTime={m.date}>{formatDate(m.date)}</time>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
