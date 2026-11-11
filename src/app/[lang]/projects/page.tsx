import "@/styles/participate.css";
import Link from "next/link";
import { localeParams } from "@/lib/meta";
import { href } from "@/lib/i18n";
import { localeOf, metaFor } from "@/components/participate/pageKit";
import { CtaBand, FactList, Faq, PageHeader, Section, Sources } from "@/components/ui/Page";
import { ProjectsBrowser } from "@/components/participate/ProjectsBrowser";
import { projects } from "@/data/projects";
import { formatNaira } from "@/lib/format";
import { DEMO_MODE } from "@/config/site";

export const generateStaticParams = localeParams;
export const generateMetadata = metaFor(
  "/projects",
  "Fund a project — every naira tracked to delivery",
  "Choose a published TBH One project in your street, city or language — fliers, radio adverts, community repairs — and follow its target, money raised, spending and proof of delivery.",
);

export default async function ProjectsPage({ params }: { params: Promise<{ lang: string }> }) {
  const locale = await localeOf(params);
  const L = (p: string) => href(locale, p);
  const raised = projects.reduce((n, p) => n + p.raised, 0);
  const open = projects.filter((p) => p.status === "open").length;
  return (
    <>
      <PageHeader
        locale={locale}
        crumbs={[{ label: "Get Involved" }, { label: "Fund a Project" }]}
        title="Fund a TBH One project"
        kicker="Instead of dues, members fund what they can see."
        answer="TBH One publishes every funding need as a project with a cost, a target and progress updates — fliers for one street, a radio advert in one city, a community borehole repair. You choose what to fund. Each project shows money raised, money spent and proof of delivery, and a monthly spend summary is published on the Transparency page. Every contribution is recorded against a named contributor."
        aside={
          <FactList
            cols={1}
            items={[
              { label: `Projects open for funding${DEMO_MODE ? " (demo)" : ""}`, value: open },
              { label: `Raised across all projects${DEMO_MODE ? " (demo)" : ""}`, value: formatNaira(raised) },
              { label: "Minimum contribution", value: "₦500" },
            ]}
          />
        }
      />
      <Section title="All projects" intro="Filter by state, category or status. Demo projects are shown until the National team publishes the first real ones." action={DEMO_MODE ? <span className="chip chip-demo">Demo data</span> : undefined}>
        <ProjectsBrowser items={projects} locale={locale} />
      </Section>
      <Section alt title="How project funding works">
        <ol className="steps">
          <li>
            <span>
              <strong>Proposed locally.</strong> Citizens and ward leaders propose projects with an estimated cost.
            </span>
          </li>
          <li>
            <span>
              <strong>Reviewed and published.</strong> The state team reviews each proposal; approved projects are published with a target.
            </span>
          </li>
          <li>
            <span>
              <strong>Funded by members.</strong> You pay by card, bank transfer or USSD through a licensed Nigerian payment provider, and get a receipt.
            </span>
          </li>
          <li>
            <span>
              <strong>Delivered with proof.</strong> Money is released only against approved proof — photos, invoices, airing certificates — and the spend appears on the Transparency page.
            </span>
          </li>
        </ol>
      </Section>
      <Section narrow>
        <Faq
          items={[
            { q: "Can Nigerians abroad fund projects?", a: "Not with money yet. Funds from outside Nigeria need legal clearance before they can be accepted. Diaspora members can help through Tell One, skills and in-kind support until clearance is recorded." },
            { q: "What if a project isn't fully funded?", a: "The project page shows progress until the target is met. If a project is closed early, the National team explains on the project page and Transparency page how the money raised is used or returned." },
            { q: "Why do you need my full name?", a: "Every contribution must be recorded against a named contributor so the party can meet its disclosure and spending-limit obligations under the Electoral Act 2026. Your name is not shown publicly." },
            { q: "Can I propose a project for my community?", a: "Yes. Talk to your ward leader or apply to become one. Proposals include an estimated cost and are reviewed by the state team before publication." },
          ]}
        />
        <Sources items={[{ label: "TBH One Concept Note, §5 General Funding Principle and Public Transparency Commitment", date: "October 2026" }, { label: "TBH One Stakeholder Dashboards PRD, MB-8, MB-9, GR-4, decision 4", date: "21 October 2026" }]} />
      </Section>
      <CtaBand
        title="Every naira, in public"
        text="See monthly income and spending by category, and every awarded vendor contract."
        actions={
          <>
            <Link href={L("/transparency")} className="btn btn-primary">
              Transparency report
            </Link>
            <Link href={L("/ward-leaders")} className="btn btn-outline">
              Propose a project as a ward leader
            </Link>
          </>
        }
      />
    </>
  );
}
