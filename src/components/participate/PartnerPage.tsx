import Link from "next/link";
import { href, type Locale } from "@/lib/i18n";
import { Faq, PageHeader, Section } from "@/components/ui/Page";
import { ApplyForm, type FieldDef } from "@/components/participate/ApplyForm";

export type PartnerConfig = {
  crumb: string;
  title: string;
  answer: string;
  offers: [string, string][];
  kind: string;
  refPrefix: string;
  extraFields: FieldDef[];
  faq: { q: string; a: string }[];
};

/** Shared layout for the partner enquiry pages under /partners. */
export function PartnerPage({ locale, c }: { locale: Locale; c: PartnerConfig }) {
  return (
    <>
      <PageHeader locale={locale} crumbs={[{ label: "Partners", path: "/partners" }, { label: c.crumb }]} title={c.title} answer={c.answer} />
      <Section title="What we offer and need">
        <div className="card-grid" style={{ ["--min" as string]: "240px" }}>
          {c.offers.map(([t, d]) => (
            <div key={t} className="card">
              <h3>{t}</h3>
              <p className="muted">{d}</p>
            </div>
          ))}
        </div>
      </Section>
      <Section alt id="enquire" title="Send an enquiry">
        <ApplyForm
          kind={c.kind}
          refPrefix={c.refPrefix}
          submitLabel="Send enquiry"
          successTitle="Enquiry received"
          successText="The partnerships desk replies to enquiries within three working days."
          fields={[
            { name: "org", label: "Organisation", type: "text", required: true },
            { name: "name", label: "Your name", type: "text", required: true },
            { name: "role", label: "Your role", type: "text", required: true },
            { name: "email", label: "Work email", type: "email", required: true },
            { name: "phone", label: "Phone", type: "tel", required: true },
            ...c.extraFields,
            { name: "message", label: "Tell us what you have in mind", type: "textarea", required: true, span: true },
            { name: "consent", label: "I agree that TBH One may contact me about this enquiry.", type: "check", required: true, span: true },
          ]}
        />
      </Section>
      <Section narrow>
        <Faq items={c.faq} />
        <p className="small muted">
          <Link href={href(locale, "/partners")}>All partnership types</Link>
        </p>
      </Section>
    </>
  );
}
