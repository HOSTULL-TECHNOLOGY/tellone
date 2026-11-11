import Link from "next/link";
import { NewsArt } from "@/components/NewsArt";
import { notFound } from "next/navigation";
import "@/styles/content.css";
import { href, isLocale, type Locale } from "@/lib/i18n";
import { pageMeta, withLocales, site } from "@/lib/meta";
import { CtaBand, PageHeader, Section, Sources } from "@/components/ui/Page";
import { articleBySlug, authors, newsArticles } from "@/data/news";
import { formatDate } from "@/lib/format";
import { JsonLd } from "@/lib/seo";

export const dynamicParams = false;
export function generateStaticParams() {
  return withLocales(newsArticles.map((a) => ({ slug: a.slug })));
}
export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  const a = articleBySlug(slug);
  if (!a) return {};
  return pageMeta(lang as Locale, `/news/${a.slug}`, a.title, a.excerpt, { type: "article", image: `/media/poster-${a.poster}-1320.jpg` });
}

export default async function ArticlePage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const a = articleBySlug(slug);
  if (!a) notFound();
  const L = (p: string) => href(lang, p);
  const author = authors.find((x) => x.name === a.author) ?? authors[0];
  const more = newsArticles.filter((x) => x.slug !== a.slug);
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "NewsArticle",
          headline: a.title,
          description: a.excerpt,
          datePublished: a.date,
          dateModified: a.updated,
          image: [`${site.url}/media/poster-${a.poster}-1320.jpg`],
          author: { "@type": "Organization", name: author.name, url: `${site.url}${href(lang, `/news/author/${author.slug}`)}` },
          publisher: { "@type": "Organization", name: site.name, logo: { "@type": "ImageObject", url: `${site.url}/brand/tbh-one-logo.png` } },
          mainEntityOfPage: `${site.url}${href(lang, `/news/${a.slug}`)}`,
        }}
      />
      <PageHeader locale={lang} crumbs={[{ label: "News", path: "/news" }, { label: a.category }]} title={a.title} kicker={a.category} answer={a.excerpt} updated={a.updated} />
      <Section narrow>
        <article className="article">
          <p className="article-meta">
            <span>
              By <Link href={L(`/news/author/${author.slug}`)}>{author.name}</Link>
            </span>
            <time dateTime={a.date}>Published {formatDate(a.date)}</time>
            <span className="chip chip-demo">Draft article</span>
          </p>
          <figure className="article-hero" style={{ margin: 0 }}>
            <NewsArt slug={a.slug} />
          </figure>
          <div className="prose">
            {a.body.map((b, i) =>
              b.h ? (
                <h2 key={i}>{b.h}</h2>
              ) : b.list ? (
                <ul key={i}>
                  {b.list.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              ) : b.quote ? (
                <blockquote key={i}>{b.quote}</blockquote>
              ) : (
                <p key={i}>{b.p}</p>
              ),
            )}
          </div>
          <Sources items={a.sources} />
          <p className="small muted">
            Spotted an error? Read our <Link href={L("/editorial-policy")}>corrections policy</Link> and <Link href={L("/contact")}>tell us</Link>.
          </p>
        </article>
      </Section>
      {more.length > 0 && (
        <Section title="More from the newsroom" alt narrow>
          <ul className="q-list" role="list">
            {more.map((m) => (
              <li key={m.slug}>
                <Link href={L(`/news/${m.slug}`)}>
                  <span>{m.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}
      <CtaBand title="Share this with one person today" actions={<Link href={L("/tools")} className="btn btn-primary">Message tools</Link>} />
    </>
  );
}
