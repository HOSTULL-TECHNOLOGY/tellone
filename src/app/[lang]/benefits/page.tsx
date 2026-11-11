import "@/styles/participate.css";
import Link from "next/link";
import { BadgePercent, Briefcase, Gift, GraduationCap, HandCoins, Shirt, Smartphone, Store, TrendingUp } from "lucide-react";
import { localeParams } from "@/lib/meta";
import { href } from "@/lib/i18n";
import { localeOf, metaFor } from "@/components/participate/pageKit";
import { PhotoFigure } from "@/components/PeopleMosaic";
import { peoplePhotos } from "@/data/photos";
import { CtaBand, Faq, Notice, PageHeader, Section, Sources } from "@/components/ui/Page";

export const generateStaticParams = localeParams;
export const generateMetadata = metaFor(
  "/benefits",
  "Member benefits — what free TBH One membership gives you",
  "Free TBH One members can access skill training, jobs, business and vendorship opportunities, giveaways, airtime and data, merch, partner discounts and referral income for verified work.",
);

export default async function BenefitsPage({ params }: { params: Promise<{ lang: string }> }) {
  const locale = await localeOf(params);
  const L = (p: string) => href(locale, p);
  const items = [
    { icon: GraduationCap, title: "Skill training", text: "Free courses in digital skills, business, media and organising — online and in person.", path: "/training" },
    { icon: Briefcase, title: "Job opportunities", text: "Paid, project-based and volunteer roles across the movement, open to members first.", path: "/jobs" },
    { icon: TrendingUp, title: "Business opportunities", text: "Grow your business through member referrals, the Shop and partner networks.", path: "/business" },
    { icon: Gift, title: "Giveaways", text: "Enter the member giveaway once a day. Winners are drawn by a published, audited method.", path: "/giveaway" },
    { icon: Smartphone, title: "Free airtime and data", text: "Redeem Impact Points for airtime and data bundles.", path: "/rewards" },
    { icon: Shirt, title: "Free merch", text: "Earn T-shirts and caps with Impact Points, or get them through funded merch projects.", path: "/rewards" },
    { icon: BadgePercent, title: "Partner discounts", text: "Member prices in the Shop and offers from partner businesses.", path: "/partners" },
    { icon: HandCoins, title: "Referral income for verified work", text: "Leaders earn for verified tasks at a published rate card — never for sign-ups alone.", path: "/street-leaders" },
    { icon: Store, title: "Vendorship opportunities", text: "Supply merch, printing, logistics and services to TBH One through open selection.", path: "/vendors" },
  ];
  return (
    <>
      <PageHeader
        locale={locale}
        crumbs={[{ label: "Opportunities" }, { label: "Member Benefits" }]}
        title="Member benefits"
        answer="TBH One membership is free, and every registered member can access nine kinds of benefit: skill training, job opportunities, business opportunities, giveaways, free airtime and data, free merch, partner discounts, referral income for verified work and vendorship opportunities. Benefits reward participation in the movement. They are never conditioned on how anyone votes, on holding a voter's card, or on the polling period."
        actions={
          <Link href={L("/join")} className="btn btn-primary">
            Join free
          </Link>
        }
      />
      <Section title="Nine benefits for every member">
        {peoplePhotos[0] && (
          <div style={{ marginBottom: "var(--s5)", maxWidth: 520 }}>
            <PhotoFigure photo={peoplePhotos[0]} sizes="(min-width: 600px) 520px, 100vw" />
          </div>
        )}
        <ul className="card-grid" role="list" style={{ ["--min" as string]: "260px" }}>
          {items.map(({ icon: Icon, title, text, path }) => (
            <li key={title}>
              <Link href={L(path)} className="link-card">
                <span className="link-card-icon">
                  <Icon size={22} aria-hidden />
                </span>
                <span className="link-card-title">{title}</span>
                <span className="link-card-text">{text}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
      <Section alt narrow title="How benefits are governed">
        <Notice title="Never in exchange for votes">
          Benefits are participation rewards. They are never conditioned on how anyone votes, on a voter&apos;s card or on the polling period. Giveaways and reward promotions stop at the campaign cut-off on 14 January 2027, and nobody will ever ask you for proof of how you voted.
        </Notice>
        <ul className="ticks" style={{ marginTop: "var(--s4)" }}>
          <li>Eligibility rules and draw methods are published before any giveaway opens</li>
          <li>Paid roles and vendor selections follow published criteria, with conflicts of interest declared</li>
          <li>Rewards, payouts and vendor payments are recorded and reviewed by finance and audit</li>
        </ul>
      </Section>
      <Section narrow>
        <Faq
          items={[
            { q: "Do I have to pay for membership?", a: "No. Membership is free and always will be." },
            { q: "When do benefits start?", a: "Membership, the website and the Shop launch on 9 November 2026. Some benefits, such as partner discounts, open as partners sign up." },
          ]}
        />
        <Sources items={[{ label: "TBH One Concept Note, §6 Member Benefits", date: "October 2026" }]} />
      </Section>
      <CtaBand
        title="Start with one action"
        text="Join, pick your pledge, and your benefits open on your dashboard."
        actions={
          <Link href={L("/join")} className="btn btn-primary btn-lg">
            Join TBH One
          </Link>
        }
      />
    </>
  );
}
