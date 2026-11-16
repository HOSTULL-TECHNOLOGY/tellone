import "@/styles/participate.css";
import "@/styles/careers.css";
import { CPhoto } from "@/components/careers/WardLeaderInfo";
import { localeParams } from "@/lib/meta";
import { href } from "@/lib/i18n";
import { localeOf, metaFor } from "@/components/participate/pageKit";
import { PageHeader, Section } from "@/components/ui/Page";
import { ApplyFlow } from "@/components/careers/ApplyFlow";
import { WardLeaderInfo } from "@/components/careers/WardLeaderInfo";
import { finalCta } from "@/data/careers";
import { contactLine, whyRegister } from "@/data/careers";

export const generateStaticParams = localeParams;
export const generateMetadata = metaFor(
  "/careers/ward-leaders/apply",
  "Apply to be a TBH One ward leader — register free, then apply",
  "Everything about the TBH One ward leader role — duties, fees, support, dates and FAQ — and the application: follow TBH One, register free, then apply in 10 minutes: your ward, about you, your community and the hours you can give. If you are selected, the state team checks your ID, endorser and payment details with you on a call.",
  { noindex: true },
);

export default async function ApplyPage({ params }: { params: Promise<{ lang: string }> }) {
  const locale = await localeOf(params);
  const L = (p: string) => href(locale, p);
  return (
    <>
      <PageHeader
        aside={<CPhoto name="06-man-agbada-portrait" className="cw-head-photo" eager />}
        locale={locale}
        crumbs={[{ label: "Careers", path: "/careers" }, { label: "Ward Leaders", path: "/careers/ward-leaders" }, { label: "Apply" }]}
        title="Apply to be a ward leader"
        kicker="1. Follow us → 2. Register free (2 minutes) → 3. Apply (10 minutes) → 4. Boost more"
        answer={`Start by following our official accounts: it boosts your application. Then register free as a member and complete the application inside your member account. ${whyRegister}`}
        actions={
          <a href="#role-info" className="btn btn-outline">
            The role, pay, support and FAQ ↓
          </a>
        }
      />
      <Section narrow id="apply-flow">
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
      <div id="role-info">
        <WardLeaderInfo locale={locale} apply="#apply-flow" checkHref={L("/careers/ward-leaders#find-your-ward")} finalH2={finalCta.h2} />
      </div>
    </>
  );
}
