import "@/styles/participate.css";
import { localeParams } from "@/lib/meta";
import { localeOf, metaFor } from "@/components/participate/pageKit";
import { Faq, Notice, PageHeader, PrototypeNote, Section } from "@/components/ui/Page";
import { ReportForm } from "@/components/participate/Support";

export const generateStaticParams = localeParams;
export const generateMetadata = metaFor(
  "/report",
  "Report a problem — safety, fraud, misconduct",
  "Report harassment, threats, violence, fraud, vote-buying, fake TBH One accounts or misconduct by a leader, anonymously if you prefer. Every report gets a reference number and a response deadline.",
);

export default async function ReportPage({ params }: { params: Promise<{ lang: string }> }) {
  const locale = await localeOf(params);
  return (
    <>
      <PageHeader
        locale={locale}
        crumbs={[{ label: "Support" }, { label: "Report a problem" }]}
        title="Report a problem"
        answer="Tell us about harassment, threats or violence, fraud or someone asking for money in TBH One's name, vote-buying, fake accounts, or misconduct by a leader. You can report anonymously. Every report gets a reference number and is triaged by the safeguarding team: critical reports within 1 hour, high within 24 hours, others within 72 hours. Sexual-abuse reports go straight to the national safeguarding lead."
      />
      <Section>
        <div className="split">
          <ReportForm />
          <div className="stack-lg">
            <Notice title="Crisis support">
              If you have experienced sexual or gender-based violence, you can get free, confidential help from a sexual assault referral centre in your state. You choose what happens next; we won&apos;t share your report without your consent unless someone is at immediate risk.
            </Notice>
            <PrototypeNote>Reports are stored in this browser only in the prototype. No report is sent anywhere.</PrototypeNote>
          </div>
        </div>
      </Section>
      <Section alt narrow>
        <Faq
          items={[
            { q: "Will the person I report find out it was me?", a: "No. Reporter identities are visible only to the safeguarding team, and anonymous reports carry no contact details at all." },
            { q: "What happens after I report?", a: "The safeguarding team triages your report by severity, investigates, and acts — from removing a leader's role to referring a crime to the police. If you left contact details, they update you." },
          ]}
        />
      </Section>
    </>
  );
}
