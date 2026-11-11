import "@/styles/participate.css";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, UserRound } from "lucide-react";
import { href, isLocale, type Locale } from "@/lib/i18n";
import { pageMeta, withLocales } from "@/lib/meta";
import { PageHeader, Section, Sources, PrototypeNote } from "@/components/ui/Page";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { FundForm } from "@/components/participate/FundForm";
import { ProjectCard } from "@/components/participate/ProjectsBrowser";
import { projectBySlug, projects, STATUS_LABEL } from "@/data/projects";
import { formatDate, formatNaira } from "@/lib/format";
import { JsonLd } from "@/lib/seo";
import { site } from "@/config/site";

export const dynamicParams = false;
export const generateStaticParams = () => withLocales(projects.map((p) => ({ slug: p.slug })));

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  const p = projectBySlug(slug);
  if (!p) return {};
  return pageMeta(lang as Locale, `/projects/${slug}`, `${p.title} — fund this project`, `${p.summary.slice(0, 150)} Target ${formatNaira(p.target)}, raised ${formatNaira(p.raised)}.`);
}

export default async function ProjectPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const p = projectBySlug(slug);
  if (!p) notFound();
  const L = (x: string) => href(lang, x);
  const pct = Math.min(100, (p.raised / p.target) * 100);
  const related = projects.filter((x) => x.slug !== p.slug && (x.state === p.state || x.category === p.category)).slice(0, 3);
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "DonateAction",
          name: p.title,
          description: p.summary,
          recipient: { "@type": "Organization", name: "TBH One", url: site.url },
          location: { "@type": "Place", name: `${p.lga}, ${p.state}, Nigeria` },
        }}
      />
      <PageHeader
        locale={lang}
        crumbs={[{ label: "Get Involved" }, { label: "Fund a Project", path: "/projects" }, { label: p.title }]}
        title={p.title}
        answer={`${p.summary} The target is ${formatNaira(p.target)}; ${formatNaira(p.raised)} has been raised from ${p.funders} funders and ${formatNaira(p.spent)} spent so far. Follow the updates and proof of delivery on this page, or fund it below.`}
        updated={p.updates[0]?.date}
        actions={
          p.status === "open" ? (
            <a href="#fund" className="btn btn-primary btn-lg">
              Fund this project
            </a>
          ) : undefined
        }
        aside={
          <div className="pj-money">
            <span className="chip chip-demo">Demo data</span>
            <p className="big">{formatNaira(p.raised)}</p>
            <p className="muted">raised of {formatNaira(p.target)} target</p>
            <ProgressBar value={pct} label={`${Math.round(pct)}% funded`} />
            <dl className="pj-figs">
              <div>
                <dt>Spent</dt>
                <dd>{formatNaira(p.spent)}</dd>
              </div>
              <div>
                <dt>Funders</dt>
                <dd>{p.funders}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>{STATUS_LABEL[p.status]}</dd>
              </div>
            </dl>
          </div>
        }
      />
      <Section>
        <div className="split pj-detail-main">
          <div className="stack-lg">
            <div>
              <h2 className="h-sub">What the money pays for</h2>
              <ul className="ticks">
                {p.funds.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>
            <dl className="facts facts-2">
              <div>
                <dt>Where</dt>
                <dd>
                  <MapPin size={14} aria-hidden style={{ display: "inline", verticalAlign: "-2px" }} /> {p.lga}, {p.state}
                </dd>
              </div>
              <div>
                <dt>Category</dt>
                <dd>{p.category}</dd>
              </div>
              <div>
                <dt>Proposed by</dt>
                <dd>
                  <UserRound size={14} aria-hidden style={{ display: "inline", verticalAlign: "-2px" }} /> {p.proposedBy}
                </dd>
              </div>
              <div>
                <dt>Published</dt>
                <dd>{formatDate(p.published)}</dd>
              </div>
            </dl>
            <div>
              <h2 className="h-sub">Updates</h2>
              <ol className="timeline">
                {p.updates.map((u) => (
                  <li key={u.date + u.text}>
                    <time dateTime={u.date}>{formatDate(u.date)}</time>
                    {u.text}
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <h2 className="h-sub">Proof of delivery</h2>
              <ul className="proof-list" role="list">
                {p.proof.map((x) => (
                  <li key={x.label}>
                    <span>{x.label}</span>
                    <span className={`badge ${x.status === "uploaded" ? "badge-ok" : "badge-muted"}`}>{x.status === "uploaded" ? "Uploaded" : "Pending"}</span>
                  </li>
                ))}
              </ul>
              <p className="small muted">Money is released to vendors and field teams only against approved proof (PRD GR-6). Proof files open here once uploaded.</p>
            </div>
          </div>
          <div id="fund" className="sticky-side">
            <h2 className="h-sub">Fund this project</h2>
            <FundForm slug={p.slug} title={p.title} remaining={Math.max(0, p.target - p.raised)} open={p.status === "open"} />
            <PrototypeNote>Payments are simulated. Production uses one licensed Nigerian payment provider for card, bank transfer and USSD.</PrototypeNote>
          </div>
        </div>
      </Section>
      {related.length > 0 && (
        <Section alt title="Related projects">
          <ul className="pj-grid" role="list">
            {related.map((r) => (
              <li key={r.slug}>
                <ProjectCard p={r} locale={lang} />
              </li>
            ))}
          </ul>
          <p style={{ marginTop: "var(--s4)" }}>
            <Link href={L("/projects")}>All projects</Link>
          </p>
        </Section>
      )}
      <Section narrow>
        <Sources items={[{ label: "Demo project record — replace with the published project before launch" }, { label: "TBH One Concept Note, §5 Fundable Projects", date: "October 2026" }]} />
      </Section>
    </>
  );
}
