import "@/styles/participate.css";
import Link from "next/link";
import { localeParams } from "@/lib/meta";
import { href } from "@/lib/i18n";
import { localeOf, metaFor } from "@/components/participate/pageKit";
import { Faq, PageHeader, PrototypeNote, Section } from "@/components/ui/Page";
import { OpenChatButton, SupportDesk } from "@/components/participate/Support";

export const generateStaticParams = localeParams;
export const generateMetadata = metaFor(
  "/support",
  "Support — open a ticket or check its status",
  "Get help with membership, project funding, Shop orders, Impact Points, leader roles and events. Open a support ticket and check its status with your ticket number.",
);

export default async function SupportPage({ params }: { params: Promise<{ lang: string }> }) {
  const locale = await localeOf(params);
  const L = (p: string) => href(locale, p);
  return (
    <>
      <PageHeader
        locale={locale}
        crumbs={[{ label: "Support" }]}
        title="Support"
        answer="Open a support ticket for anything about your membership, a project contribution or receipt, a Shop order, Impact Points, a leader role or payment, or an event. You get a ticket number straight away; use it below to check progress. Most tickets are answered within two working days. For quick questions, the AI assistant answers instantly in five languages."
        actions={<OpenChatButton />}
      />
      <Section>
        <SupportDesk />
        <PrototypeNote>Tickets are stored in this browser only in the prototype.</PrototypeNote>
      </Section>
      <Section alt narrow>
        <Faq
          items={[
            { q: "Is this for safety problems?", a: "No — for harassment, threats, fraud, vote-buying or anything unsafe, use Report a problem so it reaches the safeguarding team quickly." },
            { q: "I lost my ticket number.", a: "Sign in and open your dashboard; your tickets are listed there. Or open a new ticket and mention the earlier one." },
          ]}
        />
        <p className="small muted">
          Safety concern? <Link href={L("/report")}>Report a problem</Link>
        </p>
      </Section>
    </>
  );
}
