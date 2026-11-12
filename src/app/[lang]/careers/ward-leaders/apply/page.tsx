import "@/styles/participate.css";
import "@/styles/careers.css";
import { localeParams } from "@/lib/meta";
import { href } from "@/lib/i18n";
import { localeOf, metaFor } from "@/components/participate/pageKit";
import { PageHeader, Section } from "@/components/ui/Page";
import { ApplyFlow } from "@/components/careers/ApplyFlow";
import { steps, whyRegister } from "@/data/careers";

export const generateStaticParams = localeParams;
export const generateMetadata = metaFor(
  "/careers/ward-leaders/apply",
  "Apply to be a TBH One ward leader — register free, then apply",
  "Register free as a TBH One member, then complete the ward leader application in 10 minutes: your ward, endorsement, ID and payment details.",
  { noindex: true },
);

export default async function ApplyPage({ params }: { params: Promise<{ lang: string }> }) {
  const locale = await localeOf(params);
  const L = (p: string) => href(locale, p);
  return (
    <>
      <PageHeader
        locale={locale}
        crumbs={[{ label: "Careers", path: "/careers" }, { label: "Ward Leaders", path: "/careers/ward-leaders" }, { label: "Apply" }]}
        title="Apply to be a ward leader"
        kicker={`${steps[0].step} (${steps[0].time}) → ${steps[1].step} (${steps[1].time})`}
        answer={`Register free as a member first, then complete the application inside your member account. ${whyRegister}`}
      />
      <Section narrow>
        <ApplyFlow
          hrefs={{
            careers: L("/careers/ward-leaders"),
            street: L("/street-leaders"),
            diaspora: L("/diaspora"),
            dashboard: L("/dashboard"),
            boost: L("/careers/ward-leaders#boost"),
            terms: L("/terms"),
            privacy: L("/privacy"),
            conduct: L("/code-of-conduct"),
            login: L(`/login?next=${encodeURIComponent("/careers/ward-leaders/apply")}`),
          }}
        />
      </Section>
    </>
  );
}
