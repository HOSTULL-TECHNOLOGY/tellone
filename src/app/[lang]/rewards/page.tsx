import "@/styles/participate.css";
import Link from "next/link";
import { localeParams } from "@/lib/meta";
import { href } from "@/lib/i18n";
import { localeOf, metaFor } from "@/components/participate/pageKit";
import { Faq, Notice, PageHeader, Section, Sources } from "@/components/ui/Page";
import { Leaderboard } from "@/components/participate/Leaderboard";
import { leaderboard } from "@/data/demo";

export const generateStaticParams = localeParams;
export const generateMetadata = metaFor(
  "/rewards",
  "Impact Points and rewards — how TBH One members earn",
  "Members earn Impact Points for verified actions such as joining, bringing a friend who verifies, completing training and verified field tasks, and redeem them for airtime, data, merch and training.",
);

const EARN = [
  ["Join and verify your phone number", "100"],
  ["Bring One: a friend you invited joins and verifies", "50 each"],
  ["Complete a training module", "100"],
  ["Attend an event (checked in at the venue)", "50"],
  ["Complete a verified field task (photo proof approved)", "25 per task"],
  ["Fund a project (any amount)", "20 per contribution"],
  ["Share an approved post with your referral link", "5, up to 50 per week"],
];

const TIERS = [
  ["500 points", "₦500 airtime, or a ₦500 Shop coupon"],
  ["1,000 points", "1 GB data, or free Shop delivery"],
  ["2,500 points", "TBH One T-shirt"],
  ["5,000 points", "Priority pass for leadership training"],
  ["Top 10 in each state each month", "Invitation to a national TBH One event"],
];

export default async function RewardsPage({ params }: { params: Promise<{ lang: string }> }) {
  const locale = await localeOf(params);
  const L = (p: string) => href(locale, p);
  return (
    <>
      <PageHeader
        locale={locale}
        crumbs={[{ label: "Get Involved" }, { label: "Rewards" }]}
        title="Impact Points and rewards"
        answer="Every verified thing you do for TBH One earns Impact Points: joining, bringing a friend who verifies, completing training, attending events and finishing field tasks with approved proof. Points unlock airtime, data, merch and training, and the most active members in each state are invited to national events. Points are never paid for sign-ups alone, never exchanged for votes, and never converted to cash."
        actions={
          <Link href={L("/join")} className="btn btn-primary">
            Join and earn 100 points
          </Link>
        }
      />
      <Section title="How you earn">
        <table className="rate-table">
          <caption className="sr-only">Impact Points per action</caption>
          <thead>
            <tr>
              <th scope="col">Action</th>
              <th scope="col" className="num">
                Points
              </th>
            </tr>
          </thead>
          <tbody>
            {EARN.map(([a, p]) => (
              <tr key={a}>
                <td>{a}</td>
                <td className="num">{p}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="small muted" style={{ marginTop: "var(--s3)" }}>
          Point values shown are the launch proposal and may be adjusted by the National Coordinator. Points appear as &ldquo;pending&rdquo; until the action is verified.
        </p>
      </Section>
      <Section alt title="What points unlock">
        <ul className="rowlist" role="list">
          {TIERS.map(([t, r]) => (
            <li key={t}>
              <strong>{t}</strong>
              <span>{r}</span>
            </li>
          ))}
        </ul>
        <p style={{ marginTop: "var(--s4)" }}>
          <Link href={L("/shop/coupons")}>Turn points into Shop coupons</Link>
        </p>
      </Section>
      <Section title="This month's leaderboard" intro="Opt-in only. First name and state, nothing else.">
        <div className="split">
          <Leaderboard rows={leaderboard} />
          <Notice title="Fair play">
            Points from fake accounts, duplicate phone numbers or staged proof are removed, and accounts that game the system are suspended. Rewards stop being promoted at the campaign cut-off on 14 January 2027.
          </Notice>
        </div>
      </Section>
      <Section alt narrow>
        <Faq
          items={[
            { q: "Can I cash out my points?", a: "No. Points can only be redeemed for the rewards listed. They have no cash value and cannot be transferred." },
            { q: "Do points expire?", a: "Points stay on your account until 31 December 2027." },
            { q: "Are rewards linked to how I vote?", a: "Never. Your ballot is secret. TBH One never asks for proof of how you voted, and rewards are never offered in exchange for votes." },
          ]}
        />
        <Sources items={[{ label: "TBH One Concept Note, §7 Impact Points", date: "October 2026" }, { label: "TBH One Stakeholder Dashboards PRD, §21 decision 7 (reward tiers)", date: "21 October 2026" }]} />
      </Section>
    </>
  );
}
