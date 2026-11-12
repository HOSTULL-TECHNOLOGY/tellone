import "@/styles/participate.css";
import "@/styles/careers.css";
import Link from "next/link";
import { localeParams } from "@/lib/meta";
import { href } from "@/lib/i18n";
import { localeOf, metaFor } from "@/components/participate/pageKit";
import { PageHeader, Section } from "@/components/ui/Page";
import { earnings, rules } from "@/data/careers";
import { site } from "@/config/site";

export const generateStaticParams = localeParams;
export const generateMetadata = metaFor("/street-activation-guide", "Street Activation Guide — recruit street leaders and run safe activations", "How TBH One ward leaders recruit street leaders and run safe street activations: the safety checklist, task types and proof, approvals within 48 hours, and what we never do.");

const tasks = earnings.filter(([w]) => /Flier|Poster|Banner|Door-to-door|Merch/.test(w));

export default async function StreetActivationGuide({ params }: { params: Promise<{ lang: string }> }) {
  const locale = await localeOf(params);
  const L = (p: string) => href(locale, p);
  return (
    <>
      <PageHeader
        locale={locale}
        crumbs={[{ label: "Careers", path: "/careers" }, { label: "Ward Leaders", path: "/careers/ward-leaders" }, { label: "Street Activation Guide" }]}
        title="Street Activation Guide"
        kicker="Read this before you start recruiting."
        answer="Street activation is how TBH One reaches every street: street leaders hand out fliers, put up posters and banners with the owner's permission, knock on doors and share the message, always in pairs and always with the app's check-in. As ward leader you recruit and endorse the street leaders in your ward, assign their tasks, check their proof and approve payment within 48 hours."
      />
      <Section narrow title="1. Recruit your street leaders">
        <ul className="cw-list">
          <li>Aim for one street leader per street: about 50 in an average ward. Wave 1 street leader places open to the public on Monday 23 November 2026.</li>
          <li>A street leader lives on the street they lead, is 18 or over, and signs the Code of Conduct.</li>
          <li>Meet each applicant in person with another leader present, check their ID, and endorse only people you know or who are vouched for locally.</li>
          <li>Never ask how anyone plans to vote, and never ask for a PVC number or polling unit.</li>
          <li>New ward leaders aim to recruit at least 10 street leaders in their first 14 days.</li>
        </ul>
      </Section>
      <Section narrow alt title="2. Plan every activation safely">
        <ul className="cw-list">
          <li>Use the app&apos;s safety checklist for every event: police notified, marshals assigned, exits mapped.</li>
          <li>No children without parents, and never paid attendance.</li>
          <li>Always work with others, never alone, and check in on the app at the start and end of every shift.</li>
          <li>Wear your verified leader ID; anyone can check its code at {site.domain}/verify.</li>
          <li>Put up posters and banners only with the owner&apos;s permission, and take them down when asked.</li>
        </ul>
      </Section>
      <Section narrow title="3. Tasks, fees and proof">
        <div className="table-wrap">
          <table className="rate-table">
            <thead>
              <tr>
                <th scope="col">Task</th>
                <th scope="col">Fee</th>
                <th scope="col">Proof</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(([w, f, p]) => (
                <tr key={w}>
                  <td>{w}</td>
                  <td>{f}</td>
                  <td>{p}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="small muted">Launch rates, reviewed every two weeks. Earnings depend on the work available in each ward.</p>
      </Section>
      <Section narrow alt title="4. Approve their work within 48 hours">
        <ul className="cw-list">
          <li>Check each proof: the photo, the location and the count must match the task.</li>
          <li>Approve or query within 48 hours so street leaders are paid on time.</li>
          <li>Approved fees are paid to the street leader&apos;s bank or mobile-money account within 24 hours.</li>
          <li>You can never approve your own fee claims; a different person approves and releases every payment.</li>
        </ul>
      </Section>
      <Section narrow title="5. Rules we never break">
        <ul className="cw-list">
          {rules.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </Section>
      <Section narrow alt title="6. If something goes wrong">
        <p>
          Stop the activation, make sure everyone is safe, and report it in one tap with <Link href={L("/report")}>Report a Concern</Link>, or call the toll-free line{" "}
          <a href={`tel:${site.contact.tollFreeTel}`}>{site.contact.tollFree}</a> (free, 24 hours). TBH One will never ask anyone to pay for a role, a uniform, training or an ID: if anyone does, report it.
        </p>
        <p>
          <Link href={L("/training/leader")} className="btn btn-primary">
            Take the ward leader training
          </Link>
        </p>
      </Section>
    </>
  );
}
