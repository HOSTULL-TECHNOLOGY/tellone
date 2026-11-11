import "@/styles/participate.css";
import Link from "next/link";
import { notFound } from "next/navigation";
import { href, isLocale, type Locale } from "@/lib/i18n";
import { pageMeta, withLocales } from "@/lib/meta";
import { FactList, Notice, PageHeader, Section } from "@/components/ui/Page";
import { ApplyForm } from "@/components/participate/ApplyForm";
import { jobBySlug, jobs } from "@/data/opportunities";
import { formatDate } from "@/lib/format";
import { JsonLd } from "@/lib/seo";
import { site } from "@/config/site";

export const dynamicParams = false;
export const generateStaticParams = () => withLocales(jobs.map((j) => ({ slug: j.slug })));

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  const j = jobBySlug(slug);
  if (!j) return {};
  return pageMeta(lang as Locale, `/jobs/${slug}`, `${j.title} — TBH One jobs`, j.summary.slice(0, 160));
}

export default async function JobPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const j = jobBySlug(slug);
  if (!j) notFound();
  const L = (p: string) => href(lang, p);
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "JobPosting",
          title: j.title,
          description: `${j.summary} Duties: ${j.duties.join("; ")}. Requirements: ${j.requirements.join("; ")}.`,
          datePosted: j.posted,
          validThrough: `${j.closes}T23:59:00+01:00`,
          employmentType: j.type === "Part-time" ? "PART_TIME" : j.type === "Volunteer" ? "VOLUNTEER" : "CONTRACTOR",
          hiringOrganization: { "@type": "Organization", name: site.name, sameAs: site.url },
          ...(j.remote
            ? { jobLocationType: "TELECOMMUTE", applicantLocationRequirements: { "@type": "Country", name: "Nigeria" } }
            : { jobLocation: { "@type": "Place", address: { "@type": "PostalAddress", addressLocality: j.location, addressRegion: j.state, addressCountry: "NG" } } }),
        }}
      />
      <PageHeader
        locale={lang}
        crumbs={[{ label: "Opportunities" }, { label: "Jobs", path: "/jobs" }, { label: j.title }]}
        title={j.title}
        answer={j.summary}
        updated={j.posted}
        actions={
          <a href="#apply" className="btn btn-primary">
            Apply
          </a>
        }
        aside={
          <FactList
            cols={1}
            items={[
              { label: "Type", value: j.type },
              { label: "Location", value: j.location },
              { label: "Pay", value: j.pay },
              { label: "Closes", value: formatDate(j.closes) },
            ]}
          />
        }
      />
      <Section>
        <span className="chip chip-demo">Demo data</span>
        <div className="split split-even" style={{ marginTop: "var(--s3)" }}>
          <div>
            <h2 className="h-sub">What you&apos;ll do</h2>
            <ul className="ticks">
              {j.duties.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="h-sub">What you need</h2>
            <ul className="ticks">
              {j.requirements.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </div>
        </div>
      </Section>
      <Section alt id="apply" title="Apply for this role">
        <div className="split">
          <ApplyForm
            kind={`job:${j.slug}`}
            refPrefix="JOB"
            submitLabel="Send application"
            successTitle="Application sent"
            successText={`Thanks for applying for ${j.title}. Shortlisted applicants are contacted after the closing date.`}
            fields={[
              { name: "name", label: "Full name", type: "text", required: true },
              { name: "phone", label: "Mobile number (the one on your membership)", type: "tel", required: true },
              { name: "email", label: "Email", type: "email", required: true },
              { name: "location", label: "Where do you live?", type: "text", required: true, placeholder: "Town and state" },
              { name: "portfolio", label: "Link to CV or portfolio (optional)", type: "url", placeholder: "https://" },
              { name: "why", label: "Why are you a good fit?", type: "textarea", required: true, span: true },
              { name: "conflict", label: "I will declare any conflict of interest, such as a relative already working on this project.", type: "check", required: true, span: true },
            ]}
          />
          <Notice tone="warn" title="No fees, ever">
            TBH One never charges application, training or uniform fees. If anyone asks you to pay for a role, report it on <Link href={L("/report")}>Report a problem</Link>.
          </Notice>
        </div>
      </Section>
    </>
  );
}
