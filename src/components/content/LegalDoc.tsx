import Link from "next/link";
import { notFound } from "next/navigation";
import "@/styles/content.css";
import { href, isLocale, type Locale } from "@/lib/i18n";
import { pageMeta } from "@/lib/meta";
import { Notice, PageHeader, Section } from "@/components/ui/Page";
import { legalBySlug, legalPages } from "@/data/legal";

const anchor = (h: string) => h.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export async function legalMeta(lang: string, slug: string) {
  const p = legalBySlug(slug)!;
  return pageMeta(lang as Locale, `/${p.slug}`, `${p.title} (draft)`, p.description);
}

/** Renders one legal/policy page from src/data/legal.ts with the draft banner, a contents list and links to the other policies. */
export function LegalDoc({ lang, slug }: { lang: string; slug: string }) {
  if (!isLocale(lang)) notFound();
  const p = legalBySlug(slug);
  if (!p) notFound();
  const L = (x: string) => href(lang, x);
  return (
    <>
      <PageHeader locale={lang} crumbs={[{ label: "Policies", path: "/sitemap" }, { label: p.title }]} title={p.title} answer={p.answer} updated="2026-10-23" />
      <Section narrow>
        <div className="legal-banner">
          <Notice tone="warn" title="Draft — pending legal review">
            This policy is a draft prepared from the platform requirements. It is not yet approved by TBH One&apos;s legal adviser and Data Protection Officer and may change before launch.
          </Notice>
        </div>
        <nav className="legal-toc" aria-label="On this page">
          <h2>On this page</h2>
          <ol>
            {p.sections.map((s) => (
              <li key={s.h}>
                <a href={`#${anchor(s.h)}`}>{s.h}</a>
              </li>
            ))}
          </ol>
        </nav>
        <div className="prose">
          {p.sections.map((s) => (
            <section key={s.h} id={anchor(s.h)} aria-labelledby={`${anchor(s.h)}-h`}>
              <h2 id={`${anchor(s.h)}-h`}>{s.h}</h2>
              {s.p?.map((x, i) => <p key={i}>{x}</p>)}
              {s.list && (
                <ul>
                  {s.list.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </Section>
      <Section title="Other policies" alt narrow>
        <ul className="q-list" role="list">
          {legalPages
            .filter((x) => x.slug !== p.slug)
            .map((x) => (
              <li key={x.slug}>
                <Link href={L(`/${x.slug}`)}>
                  <span>{x.title}</span>
                </Link>
              </li>
            ))}
          <li>
            <Link href={L("/editorial-policy")}>
              <span>Editorial and Corrections Policy</span>
            </Link>
          </li>
        </ul>
      </Section>
    </>
  );
}
