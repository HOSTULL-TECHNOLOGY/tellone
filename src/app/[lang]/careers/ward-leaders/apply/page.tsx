import "@/styles/participate.css";
import "@/styles/careers.css";
import { localeParams } from "@/lib/meta";
import { href } from "@/lib/i18n";
import { localeOf, metaFor } from "@/components/participate/pageKit";
import { PageHeader, Section } from "@/components/ui/Page";
import { ApplyFlow } from "@/components/careers/ApplyFlow";
import { contactLine, whyRegister } from "@/data/careers";

export const generateStaticParams = localeParams;
export const generateMetadata = metaFor(
  "/careers/ward-leaders/apply",
  "Apply to be a TBH One ward leader — register free, then apply",
  "Follow TBH One, register free as a member, then complete the ward leader application in 10 minutes: your ward, about you, your community and the hours you can give. If you are selected, the state team checks your ID, endorser and payment details with you on a call.",
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
        kicker="1. Follow us → 2. Register free (2 minutes) → 3. Apply (10 minutes) → 4. Boost more"
        answer={`Start by following our official accounts: it boosts your application. Then register free as a member and complete the application inside your member account. ${whyRegister}`}
      />
      <Section narrow>
        <ApplyFlow
          hrefs={{
            careers: L("/careers/ward-leaders"),
            street: L("/street-leaders"),
            diaspora: L("/diaspora"),
            dashboard: L("/dashboard"),
            boost: L("/careers/ward-leaders/apply#boost-more"),
            events: L("/events"),
            terms: L("/terms"),
            privacy: L("/privacy"),
            conduct: L("/code-of-conduct"),
            login: L(`/login?next=${encodeURIComponent("/careers/ward-leaders/apply")}`),
          }}
        />
        <p className="small muted ap-contact">
          Need help? {contactLine.tollFree} · {contactLine.whatsapp} · {contactLine.email}
        </p>
      </Section>
    </>
  );
}
