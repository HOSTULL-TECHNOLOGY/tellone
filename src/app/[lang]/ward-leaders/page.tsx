import "@/styles/participate.css";
import Link from "next/link";
import { localeParams } from "@/lib/meta";
import { href } from "@/lib/i18n";
import { localeOf, metaFor } from "@/components/participate/pageKit";
import { FactList, Faq, PageHeader, Section, Sources } from "@/components/ui/Page";
import { RateCard } from "@/components/participate/LeaderBits";
import { ApplyForm } from "@/components/participate/ApplyForm";
import { stateNames } from "@/data/states";

export const generateStaticParams = localeParams;
export const generateMetadata = metaFor(
  "/ward-leaders",
  "Become a TBH One ward leader — role, benefits and how to apply",
  "Ward leaders coordinate T-B-H activity, street leaders and community projects in one of Nigeria's 8,809 wards, alongside the elected councillor. Role, earnings and application.",
);

export default async function WardLeadersPage({ params }: { params: Promise<{ lang: string }> }) {
  const locale = await localeOf(params);
  const L = (p: string) => href(locale, p);
  return (
    <>
      <PageHeader
        locale={locale}
        crumbs={[{ label: "Get Involved" }, { label: "Ward Leaders" }]}
        title="Become a ward leader"
        kicker="Run your ward like a small team."
        answer="Ward leaders coordinate Tell One, Bring One and Help One activity across one of Nigeria's 8,809 electoral wards: they recruit and manage street leaders, approve their task proof, host village meetings with a safety checklist, propose community projects and track funding. TBH One aims for 10,000 ward leaders. Ward leaders earn from project management, ads management and vendor brokerage, and work alongside — not instead of — the elected councillor."
        aside={
          <FactList
            cols={1}
            items={[
              { label: "Target", value: "10,000 ward leaders across 8,809 wards" },
              { label: "Sees", value: "Own ward and its streets" },
              { label: "Reports to", value: "State coordinator" },
              { label: "Sign-in", value: "Two-factor authentication required" },
            ]}
          />
        }
      />
      <Section title="What ward leaders do">
        <div className="card-grid" style={{ ["--min" as string]: "260px" }}>
          {[
            ["Build the team", "See which streets have a leader and which are empty, then recruit and vet street leaders."],
            ["Approve proof fast", "Review photo, GPS and count for each task; approve, reject with a reason, or flag. You can never approve your own tasks or payments."],
            ["Host village meetings", "Plan meetings with a built-in safety checklist — police notice, marshals, exits. An event can't be published until every item is ticked."],
            ["Propose projects", "Propose community projects with a cost, follow funding and upload delivery proof."],
            ["Manage materials", "Receive fliers, posters and merch from the state warehouse and allocate them to streets."],
            ["Keep people safe", "See incident reports from your ward and their status. Sexual-abuse reports go straight to the national lead."],
          ].map(([t, d]) => (
            <div key={t} className="card">
              <h3>{t}</h3>
              <p className="muted">{d}</p>
            </div>
          ))}
        </div>
        <p style={{ marginTop: "var(--s4)" }}>
          <Link href="/dashboard/ward-leader" className="btn btn-outline btn-sm">
            Preview the ward leader dashboard
          </Link>
        </p>
      </Section>
      <Section alt title="How ward leaders earn" intro="Ward and street leaders earn from real work delivered in their area: delivery earnings, vendor brokerage income, flier and poster distribution fees, ads buying and management, and project management. Field task rates at launch:">
        <RateCard />
      </Section>
      <Section title="Apply to be a ward leader">
        <div className="split">
          <ApplyForm
            kind="ward-leader"
            refPrefix="WLA"
            submitLabel="Send application"
            successTitle="Application received"
            successText="Your state coordinator vets ward leader applications. Expect a call within a week."
            fields={[
              { name: "name", label: "Full name", type: "text", required: true },
              { name: "phone", label: "Mobile number", type: "tel", required: true },
              { name: "email", label: "Email", type: "email" },
              { name: "state", label: "State", type: "select", options: stateNames, required: true },
              { name: "lga", label: "LGA", type: "text", required: true },
              { name: "ward", label: "Ward", type: "text", required: true },
              { name: "experience", label: "Community or organising experience", type: "textarea", required: true, hint: "Associations, faith groups, unions, volunteering, campaigns." },
              { name: "streets", label: "Roughly how many streets in your ward do you already know people on?", type: "select", options: ["1–5", "6–15", "16–30", "More than 30"] },
              { name: "conduct", label: "I agree to the Code of Conduct, safeguarding training and the conflict-of-interest rules.", type: "check", required: true },
            ]}
          />
          <div className="card">
            <h3>Already leading a street?</h3>
            <p className="muted">Strong street leaders are often promoted to ward leader. Keep your approval rate high and your training up to date.</p>
            <Link href={L("/street-leaders")} className="btn btn-sm btn-ghost">
              Street leader role
            </Link>
          </div>
        </div>
      </Section>
      <Section alt narrow>
        <Faq
          items={[
            { q: "What happens if an approval waits too long?", a: "Task approvals older than 48 hours escalate automatically to the state coordinator, so street leaders are not left waiting for payment." },
            { q: "Can I hold more than one role?", a: "Yes. One account can be a member, funder and ward leader at once and switch views from one menu." },
            { q: "Is this paid like a salary?", a: "No. Leaders are paid per project or task delivered, not a salary, and payments are always separate from referral rewards." },
          ]}
        />
        <Sources items={[{ label: "TBH One Concept Note, §9 Ground Structure & Leadership", date: "October 2026" }, { label: "TBH One Stakeholder Dashboards PRD, §7 Ward Leader Dashboard", date: "21 October 2026" }]} />
      </Section>
    </>
  );
}
