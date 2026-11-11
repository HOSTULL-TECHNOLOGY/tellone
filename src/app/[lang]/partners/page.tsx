import "@/styles/participate.css";
import { Handshake, Megaphone, Radio, Users, Wrench } from "lucide-react";
import { localeParams } from "@/lib/meta";
import { localeOf, metaFor } from "@/components/participate/pageKit";
import { CardGrid, LinkCard, Notice, PageHeader, Section } from "@/components/ui/Page";
import { ApplyForm } from "@/components/participate/ApplyForm";

export const generateStaticParams = localeParams;
export const generateMetadata = metaFor(
  "/partners",
  "Partner with TBH One — media, services, advertisers and unions",
  "Organisations can partner with TBH One as media partners, service providers, advertisers or unions and associations. No partner details are published until agreements are signed.",
);

export default async function PartnersPage({ params }: { params: Promise<{ lang: string }> }) {
  const locale = await localeOf(params);
  return (
    <>
      <PageHeader
        locale={locale}
        crumbs={[{ label: "Partners" }]}
        title="Partner with TBH One"
        answer="Organisations can work with TBH One in four ways: as media partners, as service providers, as advertisers reaching members through labelled offers, and as unions and associations co-running voter education and training. Every partnership is agreed in writing, follows published rules on labelling and data protection, and is reported in the transparency pages. Partners are listed here only after an agreement is signed."
      />
      <Section title="Ways to partner">
        <CardGrid min={240}>
          <LinkCard locale={locale} path="/partners/media" icon={<Radio size={22} aria-hidden />} title="Media" text="Airtime, syndication and press access." />
          <LinkCard locale={locale} path="/partners/services" icon={<Wrench size={22} aria-hidden />} title="Services" text="Telecoms, payments, logistics and technology." />
          <LinkCard locale={locale} path="/partners/advertise" icon={<Megaphone size={22} aria-hidden />} title="Advertise" text="Labelled member offers and sponsorships." />
          <LinkCard locale={locale} path="/partners/unions" icon={<Users size={22} aria-hidden />} title="Unions and associations" text="Voter education, training and benefits." />
        </CardGrid>
      </Section>
      <Section alt title="Current partners">
        <Notice title="No partners listed yet">
          <Handshake size={16} aria-hidden style={{ display: "inline", verticalAlign: "-3px" }} /> Partner names and logos will appear here once agreements are signed. TBH One does not list organisations that have not agreed to be named.
        </Notice>
      </Section>
      <Section title="General enquiry" intro="Not sure which type fits? Tell us about your organisation.">
        <ApplyForm
          kind="partner-general"
          refPrefix="PTN"
          submitLabel="Send enquiry"
          successTitle="Enquiry received"
          successText="The partnerships desk replies within three working days."
          fields={[
            { name: "org", label: "Organisation", type: "text", required: true },
            { name: "name", label: "Your name", type: "text", required: true },
            { name: "email", label: "Work email", type: "email", required: true },
            { name: "phone", label: "Phone", type: "tel" },
            { name: "type", label: "Partnership type", type: "select", options: ["Media", "Services", "Advertising", "Union or association", "Not sure"], required: true },
            { name: "message", label: "Message", type: "textarea", required: true, span: true },
          ]}
        />
      </Section>
    </>
  );
}
