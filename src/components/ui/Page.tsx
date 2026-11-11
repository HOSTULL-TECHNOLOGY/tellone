import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight, ExternalLink, Info } from "lucide-react";
import { href, type Locale } from "@/lib/i18n";
import { JsonLd } from "@/lib/seo";
import { site } from "@/config/site";

export type Crumb = { label: string; path?: string };

/** Breadcrumbs on every page (SEO-12), with BreadcrumbList structured data. */
export function Breadcrumbs({ locale, items }: { locale: Locale; items: Crumb[] }) {
  const all: Crumb[] = [{ label: "Home", path: "/" }, ...items];
  return (
    <>
      <nav aria-label="Breadcrumb" className="crumbs">
        <ol role="list">
          {all.map((c, i) => (
            <li key={i}>
              {i > 0 && <ChevronRight size={14} aria-hidden />}
              {c.path && i < all.length - 1 ? <Link href={href(locale, c.path)}>{c.label}</Link> : <span aria-current={i === all.length - 1 ? "page" : undefined}>{c.label}</span>}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: all.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.label, ...(c.path ? { item: `${site.url}${href(locale, c.path)}` } : {}) })),
        }}
      />
    </>
  );
}

/**
 * Page header: breadcrumbs, exactly one H1 naming the subject (AEO-1), the slogan as subheading,
 * and the answer-first block of 40–100 words directly below (AEO-2).
 */
export function PageHeader({
  locale,
  crumbs,
  title,
  kicker,
  answer,
  updated,
  actions,
  aside,
}: {
  locale: Locale;
  crumbs: Crumb[];
  title: string;
  kicker?: string;
  answer: ReactNode;
  updated?: string;
  actions?: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <header className="page-head pattern band-green">
      <div className="container">
        <Breadcrumbs locale={locale} items={crumbs} />
        <div className={`page-head-grid${aside ? " has-aside" : ""}`}>
          <div>
            <h1>{title}</h1>
            {kicker && <p className="page-kicker">{kicker}</p>}
            <div className="quick-answer" role="note" aria-label="Quick answer">
              {typeof answer === "string" ? <p>{answer}</p> : answer}
            </div>
            {updated && (
              <p className="small muted page-updated">
                Last updated <time dateTime={updated}>{new Date(updated).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</time>
              </p>
            )}
            {actions && <div className="page-actions">{actions}</div>}
          </div>
          {aside && <div className="page-aside">{aside}</div>}
        </div>
      </div>
    </header>
  );
}

export function Section({ id, title, intro, children, alt, action, narrow }: { id?: string; title?: string; intro?: ReactNode; children: ReactNode; alt?: boolean; action?: ReactNode; narrow?: boolean }) {
  const hid = id ? `${id}-h` : undefined;
  return (
    <section id={id} className={`section${alt ? " section-alt" : ""}`} aria-labelledby={title ? hid : undefined}>
      <div className={`container${narrow ? " container-narrow" : ""}`}>
        {title && (
          <div className="section-head">
            <div>
              <h2 id={hid}>{title}</h2>
              {intro && <p>{intro}</p>}
            </div>
            {action}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

/** Reusable FAQ: each question is an H3 summary with its answer directly beneath (FAQPage markup). */
export function Faq({ items, title = "Frequently asked questions", id = "faq" }: { items: { q: string; a: string }[]; title?: string; id?: string }) {
  return (
    <div className="faq" id={id}>
      {title && <h2 className="faq-title">{title}</h2>}
      {items.map((f, i) => (
        <details key={i} className="faq-item">
          <summary>
            <h3>{f.q}</h3>
          </summary>
          <p>{f.a}</p>
        </details>
      ))}
      <JsonLd data={{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }} />
    </div>
  );
}

export type Source = { label: string; url?: string; date?: string };
/** Sources block on every factual page (SEO-17). */
export function Sources({ items }: { items: Source[] }) {
  if (!items.length) return null;
  return (
    <aside className="sources" aria-labelledby="sources-h">
      <h2 id="sources-h" className="sources-title">
        Sources
      </h2>
      <ol>
        {items.map((s, i) => (
          <li key={i}>
            {s.url ? (
              <a href={s.url} rel="noopener" target="_blank">
                {s.label} <ExternalLink size={12} aria-hidden />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            ) : (
              s.label
            )}
            {s.date && <span className="muted"> — {s.date}</span>}
          </li>
        ))}
      </ol>
    </aside>
  );
}

export function Notice({ tone = "info", title, children }: { tone?: "info" | "warn" | "ok" | "danger"; title?: string; children: ReactNode }) {
  return (
    <div className={`notice notice-${tone}`} role={tone === "danger" ? "alert" : "note"}>
      <Info size={18} aria-hidden />
      <div>
        {title && <strong>{title}</strong>}
        <div>{children}</div>
      </div>
    </div>
  );
}

/** "Prototype" marker for anything that needs a backend before production. */
export function PrototypeNote({ children }: { children: ReactNode }) {
  return (
    <p className="proto-note">
      <span className="chip chip-demo">Prototype</span> {children}
    </p>
  );
}

export function CtaBand({ title, text, actions }: { title: string; text?: string; actions: ReactNode }) {
  return (
    <section className="cta-band band-red">
      <div className="container cta-band-inner">
        <div>
          <h2>{title}</h2>
          {text && <p>{text}</p>}
        </div>
        <div className="cta-band-actions">{actions}</div>
      </div>
    </section>
  );
}

/** Key facts as a definition list — extractable for search and AI answers. */
export function FactList({ items, cols = 2 }: { items: { label: string; value: ReactNode }[]; cols?: 1 | 2 | 3 }) {
  return (
    <dl className={`facts facts-${cols}`}>
      {items.map((f, i) => (
        <div key={i}>
          <dt>{f.label}</dt>
          <dd>{f.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Prose({ children }: { children: ReactNode }) {
  return <div className="prose">{children}</div>;
}

export function CardGrid({ children, min = 260 }: { children: ReactNode; min?: number }) {
  return (
    <div className="card-grid" style={{ ["--min" as string]: `${min}px` }}>
      {children}
    </div>
  );
}

export function LinkCard({ locale, path, title, text, icon, meta }: { locale: Locale; path: string; title: string; text?: string; icon?: ReactNode; meta?: ReactNode }) {
  return (
    <Link href={href(locale, path)} className="link-card">
      {icon && <span className="link-card-icon">{icon}</span>}
      <span className="link-card-title">{title}</span>
      {text && <span className="link-card-text">{text}</span>}
      {meta && <span className="link-card-meta">{meta}</span>}
    </Link>
  );
}

export function EmptyState({ icon, title, text, action }: { icon?: ReactNode; title: string; text?: string; action?: ReactNode }) {
  return (
    <div className="empty">
      {icon && <div className="empty-icon">{icon}</div>}
      <p className="empty-title">{title}</p>
      {text && <p className="muted">{text}</p>}
      {action}
    </div>
  );
}
