import "@/styles/participate.css";
import "@/styles/careers.css";
import Link from "next/link";
import { localeParams } from "@/lib/meta";
import { href } from "@/lib/i18n";
import { localeOf, metaFor } from "@/components/participate/pageKit";
import { FactList, PageHeader, Section } from "@/components/ui/Page";
import { LeaderTraining } from "@/components/careers/LeaderTraining";
import { site } from "@/config/site";

export const generateStaticParams = localeParams;
export const generateMetadata = metaFor("/training/leader", "Ward leader training — 2 hours, online or at your state session", "The required 2-hour TBH One ward leader training: event safety, vetting street leaders, approvals and project management. Finish it to receive your verified leader ID.");

export default async function LeaderTrainingPage({ params }: { params: Promise<{ lang: string }> }) {
  const locale = await localeOf(params);
  const L = (p: string) => href(locale, p);
  return (
    <>
      <PageHeader
        locale={locale}
        crumbs={[{ label: "Careers", path: "/careers" }, { label: "Ward Leaders", path: "/careers/ward-leaders" }, { label: "Training" }]}
        title="Ward leader training"
        kicker="2 hours, online or at your state session."
        answer="Every approved ward leader completes this training and signs the Code of Conduct before receiving a verified leader ID and the ward leader dashboard. It covers event safety, vetting street leaders, approvals and project management. It is free, and you can take it online at your own pace or at your state's in-person session."
        aside={<FactList cols={1} items={[{ label: "Length", value: "2 hours (4 modules)" }, { label: "Cost", value: "Free" }, { label: "Format", value: "Online, or at your state session" }, { label: "Help", value: `${site.contact.tollFree} (free, 24 hours)` }]} />}
      />
      <Section narrow title="Your modules">
        <LeaderTraining />
        <p className="small muted" style={{ marginTop: "var(--s4)" }}>
          Before you start recruiting, read the <Link href={L("/street-activation-guide")}>Street Activation Guide</Link> and the <Link href={L("/code-of-conduct")}>Code of Conduct</Link>.
        </p>
      </Section>
    </>
  );
}
