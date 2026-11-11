import "@/styles/participate.css";
import Link from "next/link";
import { Gift } from "lucide-react";
import { localeParams } from "@/lib/meta";
import { href } from "@/lib/i18n";
import { localeOf, metaFor } from "@/components/participate/pageKit";
import { FactList, Faq, Notice, PageHeader, PrototypeNote, Section } from "@/components/ui/Page";
import { GiveawayEntry } from "@/components/participate/Giveaway";

export const generateStaticParams = localeParams;
export const generateMetadata = metaFor(
  "/giveaway",
  "TBH One member giveaway — prize, rules and how winners are drawn",
  "Signed-in TBH One members can enter the member giveaway once a day until the campaign cut-off. Read the prize, eligibility rules and the published random draw method.",
);

export default async function GiveawayPage({ params }: { params: Promise<{ lang: string }> }) {
  const locale = await localeOf(params);
  const L = (p: string) => href(locale, p);
  return (
    <>
      <PageHeader
        locale={locale}
        crumbs={[{ label: "Opportunities" }, { label: "Giveaway" }]}
        title="Member giveaway"
        answer="Signed-in TBH One members can enter the member giveaway once a day. Entry is free and needs nothing but your membership — no purchase, no voter's card and no proof of how you vote. Entries close at 23:59 WAT on 14 January 2027, the campaign cut-off. Winners are drawn at random by a published method, checked by an independent witness, and contacted privately."
        actions={
          <>
            <a href="#enter" className="btn btn-primary">
              Enter today
            </a>
            <a href="#rules" className="btn btn-ghost">
              Read the rules
            </a>
          </>
        }
        aside={
          <div className="card">
            <span className="chip chip-demo">Demo data</span>
            <p className="h-sub" style={{ marginTop: "var(--s2)" }}>
              <Gift size={20} aria-hidden style={{ display: "inline", verticalAlign: "-4px" }} /> This month&apos;s prize
            </p>
            <FactList
              cols={1}
              items={[
                { label: "Prize", value: "20 × 10 GB data bundles and 20 TBH One T-shirts" },
                { label: "Draw", value: "Monthly, from that month's entries" },
                { label: "Entries", value: "One per member per day" },
                { label: "Closes", value: "23:59 WAT, 14 January 2027" },
              ]}
            />
          </div>
        }
      />
      <Section title="Enter the giveaway">
        <div className="split">
          <GiveawayEntry locale={locale} />
          <div className="stack-lg">
            <Notice title="No winners are published">
              To protect members&apos; privacy, winners are contacted privately and are never listed on this site. TBH One will never ask you to pay a fee to receive a prize.
            </Notice>
            <PrototypeNote>Entries are stored in this browser only. No real draw happens in the prototype.</PrototypeNote>
          </div>
        </div>
      </Section>
      <Section alt id="rules" title="Rules">
        <ol className="steps">
          <li>
            <span>Open to registered TBH One members aged 18 or over, living in Nigeria, with a verified phone number.</span>
          </li>
          <li>
            <span>One entry per member per day (West Africa Time). Duplicate accounts are removed and their entries cancelled.</span>
          </li>
          <li>
            <span>No purchase, payment, voter&apos;s card or statement about voting is needed or accepted. Prizes are never linked to how anyone votes.</span>
          </li>
          <li>
            <span>Staff in the finance, audit and safeguarding teams, and their households, cannot enter.</span>
          </li>
          <li>
            <span>Entries close at the campaign cut-off, 23:59 WAT on 14 January 2027. No giveaway runs during the polling period.</span>
          </li>
          <li>
            <span>Prizes cannot be exchanged for cash. Winners have 14 days to respond before a replacement is drawn.</span>
          </li>
        </ol>
      </Section>
      <Section title="How winners are drawn">
        <ol className="steps">
          <li>
            <span>At the end of each month, the list of valid entries is frozen and its fingerprint (a hash) is published on this page.</span>
          </li>
          <li>
            <span>Winners are picked by a random number generator in front of an independent witness, and the draw is recorded.</span>
          </li>
          <li>
            <span>Each winner is checked against the rules, then contacted privately by the call centre from a number listed on <Link href={L("/verify")}>Verify Official Channels</Link>.</span>
          </li>
        </ol>
      </Section>
      <Section alt narrow>
        <Faq
          items={[
            { q: "I got a message saying I won. Is it real?", a: "Only if it comes from an official number on the Verify Official Channels page and does not ask you for money. If in doubt, report it." },
            { q: "Can guests enter?", a: "No. Sign in or join free first, then come back to enter." },
          ]}
        />
      </Section>
    </>
  );
}
