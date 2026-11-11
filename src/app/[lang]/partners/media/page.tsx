import "@/styles/participate.css";
import { localeParams } from "@/lib/meta";
import { localeOf, metaFor } from "@/components/participate/pageKit";
import { PartnerPage, type PartnerConfig } from "@/components/participate/PartnerPage";

export const generateStaticParams = localeParams;
export const generateMetadata = metaFor("/partners/media", "Media partners — work with TBH One", "Radio, TV, print and online media can partner with TBH One on paid, declared airtime, content syndication and press access.");

const config: PartnerConfig = {
  crumb: "Media",
  title: "Media partners",
  answer: "TBH One works with radio stations, TV channels, newspapers, blogs and online platforms across Nigeria. We buy declared airtime and ad space funded by member projects, syndicate the theme songs and explainers in five languages, and give accredited journalists access to spokespeople and events. All paid placements are labelled as paid political content and stop at the campaign cut-off.",
  offers: [
    ["Airtime and ad space", "Radio and TV slots, print and online inventory, bought at published rates and labelled as paid."],
    ["Content syndication", "Theme songs, explainers and voter-education content in English, Pidgin, Yorùbá, Hausa and Igbo."],
    ["Press access", "Briefings, interviews and event accreditation for registered journalists."],
    ["Local language reach", "Community radio partnerships in every geopolitical zone."],
  ],
  kind: "partner-media",
  refPrefix: "PMD",
  extraFields: [
    { name: "outlet", label: "Outlet type", type: "select", options: ["Radio", "TV", "Newspaper or magazine", "Online publication", "Podcast", "Other"], required: true },
    { name: "reach", label: "Coverage area", type: "text", required: true, placeholder: "e.g. Kano and Jigawa" },
  ],
  faq: [
    { q: "Do you buy airtime directly?", a: "Airtime is bought through approved, member-funded projects with invoices and proof of broadcast, then reported in the transparency reports." },
    { q: "Are you the official NDC press office?", a: "No. TBH One is a supporting movement. For official party statements, contact the NDC directly." },
  ],
};

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const locale = await localeOf(params);
  return <PartnerPage locale={locale} c={config} />;
}
