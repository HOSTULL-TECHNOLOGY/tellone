import "@/styles/participate.css";
import { localeParams } from "@/lib/meta";
import { localeOf, metaFor } from "@/components/participate/pageKit";
import { PartnerPage, type PartnerConfig } from "@/components/participate/PartnerPage";

export const generateStaticParams = localeParams;
export const generateMetadata = metaFor("/partners/advertise", "Advertise with TBH One — reach members ethically", "Businesses can reach TBH One members through clearly labelled sponsorships, member offers and Shop placements, under strict advertising rules.");

const config: PartnerConfig = {
  crumb: "Advertise",
  title: "Advertise with TBH One",
  answer: "Businesses can reach TBH One members through clearly labelled sponsorships, member offers, Shop partnerships and event sponsorship. Every advert is labelled as sponsored, reviewed before it runs, and must not make political claims on behalf of the advertiser. We do not sell members’ personal data, and advertisers never receive contact details.",
  offers: [
    ["Member offers", "Feature a discount for members on the partners page and in the dashboard."],
    ["Event sponsorship", "Sponsor village meetings, training and chapter events with clear labels."],
    ["Shop partnerships", "Co-branded products and bundles in the TBH One Shop."],
    ["Media Hub placements", "Sponsored segments on TBH One TV, labelled on screen."],
  ],
  kind: "partner-advertise",
  refPrefix: "PAD",
  extraFields: [
    { name: "budget", label: "Indicative budget", type: "select", options: ["Under ₦500,000", "₦500,000–₦2,000,000", "₦2,000,000–₦10,000,000", "Over ₦10,000,000"], required: true },
    { name: "format", label: "Formats of interest", type: "checkboxes", options: ["Member offer", "Event sponsorship", "Shop partnership", "TBH One TV"], required: true },
  ],
  faq: [
    { q: "Will you share member data with us?", a: "No. Advertisers receive aggregate reach figures only, never names, phone numbers or locations." },
    { q: "What adverts are refused?", a: "Gambling, alcohol to under-18s, unverified financial schemes, and anything misleading or political on behalf of the advertiser." },
  ],
};

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const locale = await localeOf(params);
  return <PartnerPage locale={locale} c={config} />;
}
