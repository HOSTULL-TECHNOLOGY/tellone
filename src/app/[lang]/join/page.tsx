import "@/styles/participate.css";
import Link from "next/link";
import { localeParams } from "@/lib/meta";
import { href } from "@/lib/i18n";
import { localeOf, metaFor } from "@/components/participate/pageKit";
import { Faq, PageHeader, PrototypeNote, Section, Sources } from "@/components/ui/Page";
import { JoinFlow } from "@/components/participate/JoinFlow";
import { PeopleMosaic } from "@/components/PeopleMosaic";
import { peoplePhotos } from "@/data/photos";

export const generateStaticParams = localeParams;
export const generateMetadata = metaFor(
  "/join",
  "Become a TBH One member — free sign-up",
  "Join TBH One free in about two minutes with your phone number. No dues, no invitation needed. Choose Tell One, Bring One or Help One and get your member ID.",
);

export default async function JoinPage({ params }: { params: Promise<{ lang: string }> }) {
  const locale = await localeOf(params);
  const L = (p: string) => href(locale, p);
  return (
    <>
      <PageHeader
        locale={locale}
        crumbs={[{ label: "Get Involved" }, { label: "Become a Member" }]}
        title="Become a TBH One member"
        kicker="Free, open, and yours in about two minutes."
        answer="Membership of TBH One is free and open to every Nigerian aged 18 or over, at home or abroad. There are no dues and no invitation. Sign up with your mobile number, choose your state and the first action you'll take — Tell One, Bring One or Help One — and you get a member ID, a dashboard and Impact Points for everything you do. We never ask how you will vote."
      />
      <Section>
        <div className="split">
          <div>
            <JoinFlow locale={locale} dashboardHref="/dashboard/member" fundHref={L("/projects")} />
            <PrototypeNote>Sign-up is simulated: no SMS is sent and your details stay in this browser. Production uses an SMS code provider and the member CRM.</PrototypeNote>
          </div>
          <aside className="card sticky-side" aria-labelledby="why-h">
            <h2 id="why-h" className="h-sub">What members get</h2>
            <ul className="ticks">
              <li>A dashboard with one suggested action every day</li>
              <li>Impact Points for joining, referring, attending and creating</li>
              <li>Skill training, job and business opportunities</li>
              <li>Member prices and coupons in the Shop</li>
              <li>Daily giveaway entry (never tied to how you vote)</li>
              <li>The chance to become a street or ward leader</li>
            </ul>
            <p className="small muted">
              Already a member? <Link href={L("/login")}>Sign in</Link>.
            </p>
          </aside>
        </div>
      </Section>
      {peoplePhotos.length > 0 && (
        <Section title="Who TBH One is for">
          <PeopleMosaic limit={5} offset={3} />
        </Section>
      )}
      <Section alt narrow>
        <Faq
          items={[
            { q: "Does it cost anything to join TBH One?", a: "No. Membership is free and there are no dues. Instead of paying dues, members are encouraged to fund specific published projects they care about." },
            { q: "Who can join?", a: "Every Nigerian aged 18 or over, wherever they live. Nigerians abroad join a diaspora chapter and take part through Tell One and in-kind support." },
            { q: "Will you ask how I vote or for my voter's card?", a: "No. TBH One never records voting intention, how anyone voted, PVC numbers or polling-unit data, and no benefit or giveaway depends on them." },
            { q: "What happens to my data?", a: "Your name, phone, state and LGA run your membership. Every other use — SMS or WhatsApp updates, AI calls, photos — has its own consent you can switch off at any time, under the Nigeria Data Protection Act 2023." },
          ]}
        />
        <Sources items={[{ label: "TBH One Concept Note (Revised), §5 Membership & Funding Model", date: "October 2026" }, { label: "TBH One Stakeholder Dashboards PRD, §5 and guardrails GR-1, GR-2", date: "21 October 2026" }]} />
      </Section>
    </>
  );
}
