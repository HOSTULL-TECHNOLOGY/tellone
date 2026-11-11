import "@/styles/participate.css";
import { localeParams } from "@/lib/meta";
import { localeOf, metaFor } from "@/components/participate/pageKit";
import { PartnerPage, type PartnerConfig } from "@/components/participate/PartnerPage";

export const generateStaticParams = localeParams;
export const generateMetadata = metaFor("/partners/services", "Service partners — supply services to TBH One", "Telecoms, payments, logistics, printing and technology companies can partner with TBH One as service providers under published, audited terms.");

const config: PartnerConfig = {
  crumb: "Services",
  title: "Service partners",
  answer: "TBH One needs reliable partners for telecoms (SMS, USSD, voice and data), payments, logistics, printing, call-centre operations and technology. Service partners are selected on published criteria and paid only against delivered, verified work. If your company can serve millions of members across all 36 states and the FCT, we would like to hear from you.",
  offers: [
    ["Telecoms", "SMS broadcast, USSD short codes, voice lines and bulk data or airtime for rewards."],
    ["Payments", "Licensed card, bank transfer and USSD collection with clear receipts."],
    ["Logistics", "Nationwide delivery and pickup networks for the Shop and campaign materials."],
    ["Technology", "Hosting, security, call-centre software and data protection support."],
  ],
  kind: "partner-services",
  refPrefix: "PSV",
  extraFields: [{ name: "service", label: "Service area", type: "select", options: ["Telecoms", "Payments", "Logistics", "Printing", "Call centre", "Technology", "Other"], required: true }],
  faq: [{ q: "Is there a tender?", a: "Large contracts are awarded through a documented selection with at least three quotes, reviewed by finance and audit." }],
};

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const locale = await localeOf(params);
  return <PartnerPage locale={locale} c={config} />;
}
