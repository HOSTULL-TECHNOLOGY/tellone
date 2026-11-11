import "@/styles/participate.css";
import { localeParams } from "@/lib/meta";
import { localeOf, metaFor } from "@/components/participate/pageKit";
import { PartnerPage, type PartnerConfig } from "@/components/participate/PartnerPage";

export const generateStaticParams = localeParams;
export const generateMetadata = metaFor("/partners/unions", "Unions and associations — partner with TBH One", "Trade unions, market associations, transport unions, professional bodies and student unions can partner with TBH One on voter education and member benefits.");

const config: PartnerConfig = {
  crumb: "Unions",
  title: "Unions and associations",
  answer: "Trade unions, market and traders’ associations, transport unions, professional bodies and student unions already bring Nigerians together. TBH One partners with them on voter education, member training, discounts and community projects, while respecting each body’s own rules on political neutrality. Partnerships are voluntary, written down, and never involve payment for endorsements.",
  offers: [
    ["Voter education", "PVC drives and polling-unit information sessions for your members."],
    ["Training", "Free digital, business and safety training for association members."],
    ["Member benefits", "Shop discounts and partner offers for your members."],
    ["Community projects", "Co-designed projects in markets, parks and campuses, funded by TBH One members."],
  ],
  kind: "partner-unions",
  refPrefix: "PUN",
  extraFields: [
    { name: "type", label: "Type of body", type: "select", options: ["Trade union", "Market or traders’ association", "Transport union", "Professional body", "Student union", "Community association"], required: true },
    { name: "members", label: "Approximate membership", type: "select", options: ["Under 500", "500–5,000", "5,000–50,000", "Over 50,000"], required: true },
  ],
  faq: [{ q: "Does partnering mean we endorse a candidate?", a: "No. Partnership covers specific activities agreed in writing. Endorsements are your body’s own decision, and TBH One never pays for them." }],
};

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const locale = await localeOf(params);
  return <PartnerPage locale={locale} c={config} />;
}
