import "@/styles/participate.css";
import Link from "next/link";
import { localeParams } from "@/lib/meta";
import { href } from "@/lib/i18n";
import { localeOf, metaFor } from "@/components/participate/pageKit";
import { PhotoFigure } from "@/components/PeopleMosaic";
import { peoplePhotos } from "@/data/photos";
import { Faq, PageHeader, Section } from "@/components/ui/Page";
import { ApplyForm } from "@/components/participate/ApplyForm";
import { stateNames } from "@/data/states";

export const generateStaticParams = localeParams;
export const generateMetadata = metaFor(
  "/business",
  "Business opportunities for TBH One members",
  "Members who run businesses can list member discounts, become Shop pickup points, supply services to funded projects and reach customers through the TBH One network.",
);

const CATS = ["Printing and signage", "Tailoring and textiles", "Food and catering", "Transport and logistics", "Phones, airtime and data", "Photography and video", "Events and sound", "Retail shop or kiosk", "Professional services", "Other"];

export default async function BusinessPage({ params }: { params: Promise<{ lang: string }> }) {
  const locale = await localeOf(params);
  const L = (p: string) => href(locale, p);
  return (
    <>
      <PageHeader
        locale={locale}
        crumbs={[{ label: "Opportunities" }, { label: "Business" }]}
        title="Business opportunities"
        answer="If you run a business, TBH One's network can bring you customers and work. Offer a member discount and you're listed as a partner; host a Shop pickup point and earn a handling fee; supply printing, tailoring, transport or catering to funded community projects through open selection. Every opportunity is open to members on the same published criteria, and nobody pays to be selected."
      />
      <Section title="Ways to grow with TBH One">
        {peoplePhotos[1] && (
          <div style={{ marginBottom: "var(--s5)", maxWidth: 520 }}>
            <PhotoFigure photo={peoplePhotos[1]} sizes="(min-width: 600px) 520px, 100vw" />
          </div>
        )}
        <div className="card-grid" style={{ ["--min" as string]: "240px" }}>
          {[
            ["Member discounts", "List an offer for members and appear on the partners page in your state."],
            ["Shop pickup point", "Hold Shop orders for collection in your area and earn a fee per hand-over."],
            ["Project supplier", "Quote for printing, merch, transport and events funded by members."],
            ["Skills for growth", "Free book-keeping and digital marketing training for business owners."],
          ].map(([t, d]) => (
            <div key={t} className="card">
              <h3>{t}</h3>
              <p className="muted">{d}</p>
            </div>
          ))}
        </div>
        <p style={{ marginTop: "var(--s4)" }}>
          Want to supply at scale? See <Link href={L("/vendors")}>Vendors</Link>.
        </p>
      </Section>
      <Section alt title="Register your business">
        <ApplyForm
          kind="business"
          refPrefix="BIZ"
          submitLabel="Register business"
          successTitle="Business registered"
          successText="The partnerships desk will review your details and contact you about the opportunities you picked."
          fields={[
            { name: "name", label: "Your full name", type: "text", required: true },
            { name: "business", label: "Business name", type: "text", required: true },
            { name: "phone", label: "Mobile number", type: "tel", required: true },
            { name: "email", label: "Email", type: "email" },
            { name: "state", label: "State", type: "select", options: stateNames, required: true },
            { name: "category", label: "Category", type: "select", options: CATS, required: true },
            { name: "interest", label: "Interested in", type: "checkboxes", options: ["Member discount", "Pickup point", "Project supplier", "Training"], required: true, span: true },
            { name: "cac", label: "CAC registration number (if registered)", type: "text", hint: "Unregistered small businesses are welcome for discounts and pickup points." },
          ]}
        />
      </Section>
      <Section narrow>
        <Faq items={[{ q: "Do I need CAC registration?", a: "Not for member discounts or pickup points. Project suppliers and Shop vendors must be registered so payments can be made and audited." }]} />
      </Section>
    </>
  );
}
