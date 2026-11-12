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
/** Street leader recruitment opens to the public on Monday 23 November 2026 (Careers document); until then: waiting list. */
const STREET_OPEN = Date.now() >= Date.parse("2026-11-23T00:00:00+01:00");
export const generateMetadata = metaFor(
  "/street-leaders",
  "Become a TBH One street leader — role, earnings and how to apply",
  "Street leaders run door-to-door outreach, flier and poster distribution and village meetings on their own street, and earn from verified work at a published rate card.",
);

export default async function StreetLeadersPage({ params }: { params: Promise<{ lang: string }> }) {
  const locale = await localeOf(params);
  const L = (p: string) => href(locale, p);
  return (
    <>
      <PageHeader
        locale={locale}
        crumbs={[{ label: "Get Involved" }, { label: "Street Leaders" }]}
        title="Become a street leader"
        kicker="Your street, your neighbours, paid for real work."
        answer="Street leaders are TBH One's front line: they lead door-to-door outreach, distribute fliers, posters and merch, and help host village meetings on their own street. TBH One aims for 800,000 street leaders. You are paid per verified task at a published rate — for example ₦500 per 100 fliers dropped — once your photo proof is approved by your ward leader. Training comes first."
        aside={
          <FactList
            cols={1}
            items={[
              { label: "Target", value: "800,000+ street leaders" },
              { label: "Reports to", value: "Your ward leader" },
              { label: "Paid for", value: "Verified tasks with photo proof" },
              { label: "Before your first task", value: "Safety and conduct training" },
            ]}
          />
        }
      />
      <Section title="What you do">
        <div className="split split-even">
          <ul className="ticks">
            <li>Drop fliers and put up posters on your street, with permission</li>
            <li>Talk to neighbours door to door about why Nigeria needs leaders who will not steal its money</li>
            <li>Distribute merch and record every hand-over</li>
            <li>Help organise village meetings with your ward leader</li>
            <li>Invite neighbours to join TBH One with your referral link</li>
            <li>Report any safety problem in one tap</li>
          </ul>
          <div className="card">
            <h3>Built for basic phones</h3>
            <p className="muted">Your dashboard works on a low-end Android phone and without signal: take a GPS- and time-stamped photo, enter the count, and it syncs when signal returns.</p>
            <Link href="/dashboard/street-leader" className="btn btn-outline btn-sm">
              Preview the street leader dashboard
            </Link>
          </div>
        </div>
      </Section>
      <Section alt title="What you earn" intro="Launch rate card, reviewed every two weeks by the National Coordinator and Finance Controller. Payment status updates within 24 hours of your ward leader approving your proof.">
        <RateCard />
        <p className="small muted" style={{ marginTop: "var(--s3)" }}>
          Leaders also earn delivery fees for Shop orders handed over at pickup points, and Impact Points. Referral rewards are paid only for verified work, never for sign-ups alone.
        </p>
      </Section>
      {!STREET_OPEN && (
        <Section id="waitlist" title="Street leaders: join the waiting list" intro="Street leader places (440,450, one per street) open to the public on Monday 23 November 2026, once wave 1 ward leaders are trained. Register as a member and join the waiting list so you are first in line.">
          <div className="split">
            <ApplyForm
              kind="street-leader-waitlist"
              refPrefix="SLW"
              submitLabel="Join the waiting list"
              successTitle="You’re on the waiting list"
              successText="You’re first in line: we’ll text you on Monday 23 November 2026 when street leader applications open. Your ward leader then reviews your application."
              fields={[
                { name: "name", label: "Full name", type: "text", required: true },
                { name: "phone", label: "Mobile number", type: "tel", required: true },
                { name: "state", label: "State", type: "select", options: stateNames, required: true },
                { name: "street", label: "Your street", type: "text", required: true, hint: "You lead the street you live on." },
              ]}
            />
            <div className="stack">
              <p>Want to lead a whole ward instead? Wave 1 recruits one ward leader for each of the 8,809 wards.</p>
              <Link href={L("/careers/ward-leaders")} className="btn btn-primary">
                Become a ward leader
              </Link>
            </div>
          </div>
        </Section>
      )}
      <Section id={STREET_OPEN ? "waitlist" : "apply"} title="Apply to be a street leader" intro={STREET_OPEN ? "Applications are vetted before the role is added to your account. You must be a TBH One member." : "Applications open on Monday 23 November 2026. You can prepare now: applications are vetted before the role is added to your account, and you must be a TBH One member."}>
        <div className="split">
          <ApplyForm
            kind="street-leader"
            refPrefix="SLA"
            submitLabel="Send application"
            successTitle="Application received"
            successText="Your ward leader reviews street leader applications and contacts you within a week. Complete the safety training while you wait."
            fields={[
              { name: "name", label: "Full name", type: "text", required: true },
              { name: "phone", label: "Mobile number", type: "tel", required: true },
              { name: "state", label: "State", type: "select", options: stateNames, required: true },
              { name: "lga", label: "LGA", type: "text", required: true },
              { name: "ward", label: "Ward", type: "text", required: true },
              { name: "street", label: "Your street", type: "text", required: true, hint: "You lead the street you live on." },
              { name: "languages", label: "Languages you speak", type: "checkboxes", options: ["English", "Pidgin", "Yorùbá", "Hausa", "Igbo", "Other"], required: true },
              { name: "availability", label: "When can you work?", type: "checkboxes", options: ["Weekday mornings", "Weekday evenings", "Weekends"], required: true },
              { name: "why", label: "Why do you want to lead your street? (optional)", type: "textarea" },
              { name: "conduct", label: "I agree to the Code of Conduct and to complete safety training before my first task.", type: "check", required: true },
            ]}
          />
          <div className="card">
            <h3>Vetting</h3>
            <ol className="steps">
              <li>
                <span>Your ward leader checks your details and meets you.</span>
              </li>
              <li>
                <span>You complete the short safety, conduct and reporting modules.</span>
              </li>
              <li>
                <span>The role is added to your account and you receive a verified leader ID card with a QR code.</span>
              </li>
            </ol>
            <p className="small muted">
              Residents can check any leader&apos;s ID on <Link href={L("/verify")}>Verify Official Channels</Link>.
            </p>
          </div>
        </div>
      </Section>
      <Section alt narrow>
        <Faq
          items={[
            { q: "Is a street leader a government position?", a: "No. Street leaders are TBH One organising roles, not government offices." },
            { q: "How do I get paid?", a: "Each task ends in photo proof. When your ward leader approves it, the payment shows as approved and is paid to your bank or mobile-money account. Payments are released only against approved proof, and two different finance staff approve and release every payout." },
            { q: "What if I don't have signal?", a: "Log the task anyway. The app keeps it on your phone and sends it automatically within minutes of reconnecting." },
            { q: "Can I see my neighbours' phone numbers?", a: "No. Street leaders see members' first names and status only, to protect privacy." },
          ]}
        />
        <Sources items={[{ label: "TBH One Concept Note, §9 Ground Structure & Leadership", date: "October 2026" }, { label: "TBH One Stakeholder Dashboards PRD, §6 Street Leader Dashboard and §21 decision 3 (rate card)", date: "21 October 2026" }]} />
      </Section>
    </>
  );
}
