import "@/styles/participate.css";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { localeParams } from "@/lib/meta";
import { href } from "@/lib/i18n";
import { localeOf, metaFor } from "@/components/participate/pageKit";
import { Faq, Notice, PageHeader, Section } from "@/components/ui/Page";
import { stateNames } from "@/data/states";
import { site } from "@/config/site";

export const generateStaticParams = localeParams;
export const generateMetadata = metaFor(
  "/whatsapp",
  "TBH One WhatsApp — official channel and state groups",
  "Find TBH One's verified WhatsApp channel and state community links. Links are published here only once verified, so you never join a fake group.",
);

export default async function WhatsAppPage({ params }: { params: Promise<{ lang: string }> }) {
  const locale = await localeOf(params);
  const L = (p: string) => href(locale, p);
  const number = site.contact.whatsappNumber;
  return (
    <>
      <PageHeader
        locale={locale}
        crumbs={[{ label: "Get Involved" }, { label: "WhatsApp" }]}
        title="TBH One on WhatsApp"
        answer="TBH One will run one official WhatsApp channel for national updates and a community link for each of the 36 states and the FCT. Links appear on this page only after they have been verified by the National Coordination team. Until then, treat any group claiming to be official TBH One with care, and never send money or personal documents to anyone on WhatsApp."
      />
      <Section title="Official channel">
        {number ? (
          <a className="btn btn-primary" href={`https://wa.me/${number}`} rel="noopener">
            <MessageCircle size={18} aria-hidden /> Open WhatsApp
          </a>
        ) : (
          <Notice title="Coming soon">
            The official WhatsApp channel is being verified and will be published here. Check <Link href={L("/verify")}>Verify Official Channels</Link> before joining any group.
          </Notice>
        )}
      </Section>
      <Section alt title="State community links" intro="Each state's link is published once its coordinator confirms it.">
        <ul className="channels" role="list">
          {stateNames.map((s) => (
            <li key={s} className="channel">
              <span>{s}</span>
              <span className="badge badge-muted">Link pending</span>
            </li>
          ))}
        </ul>
      </Section>
      <Section narrow>
        <Faq
          items={[
            { q: "Someone added me to a TBH One group. Is it real?", a: "Only links published on this page are official. If you are unsure, leave the group and report it on the Report a problem page." },
            { q: "Will TBH One ask me for money on WhatsApp?", a: "No. Project funding happens only on the TBH One website or app through the licensed payment page — never by transfer to a personal account." },
          ]}
        />
      </Section>
    </>
  );
}
