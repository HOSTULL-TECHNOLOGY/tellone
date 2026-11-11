import "@/styles/participate.css";
import { localeParams } from "@/lib/meta";
import { localeOf, metaFor } from "@/components/participate/pageKit";
import { Faq, Notice, PageHeader, Section } from "@/components/ui/Page";
import { ApplyForm } from "@/components/participate/ApplyForm";
import { stateNames } from "@/data/states";

export const generateStaticParams = localeParams;
export const generateMetadata = metaFor(
  "/vendors",
  "Become a TBH One vendor — categories and selection criteria",
  "Supply TBH One with merch, printing, logistics, media production and event services. Published categories and selection criteria, conflict-of-interest rules, and an application form.",
);

const CATS = ["Merch production (T-shirts, caps, wristbands)", "Printing (fliers, posters, banners)", "Logistics and delivery", "Media production (radio, TV, video)", "Events (sound, canopies, chairs)", "Technology and telecoms", "Call-centre services"];

export default async function VendorsPage({ params }: { params: Promise<{ lang: string }> }) {
  const locale = await localeOf(params);
  return (
    <>
      <PageHeader
        locale={locale}
        crumbs={[{ label: "Opportunities" }, { label: "Vendors" }]}
        title="Vendors"
        answer="TBH One buys goods and services in seven categories, from merch production and printing to logistics, media production and events. Vendors are chosen through open selection against published criteria — price, quality samples, delivery capacity, location and a clean record — and are paid only against approved proof of delivery. Anyone with a family or business link to a TBH One decision-maker must declare it."
      />
      <Section title="Categories">
        <ul className="channels" role="list">
          {CATS.map((c) => (
            <li key={c} className="channel">
              {c}
            </li>
          ))}
        </ul>
      </Section>
      <Section alt title="Selection criteria">
        <div className="split split-even">
          <ol className="steps">
            <li>
              <span>
                <strong>Price</strong> against the published budget for the job.
              </span>
            </li>
            <li>
              <span>
                <strong>Quality</strong>, checked on samples before any large order.
              </span>
            </li>
            <li>
              <span>
                <strong>Capacity</strong> to deliver on time, in the states needed.
              </span>
            </li>
            <li>
              <span>
                <strong>Local spread</strong>: preference for vendors close to where the work happens.
              </span>
            </li>
            <li>
              <span>
                <strong>Record</strong>: CAC registration, tax details and references.
              </span>
            </li>
          </ol>
          <Notice title="How you get paid">
            Payment is released only after the ward or state team approves proof of delivery. Two different finance staff approve and release every payment, and all vendor payments appear in the transparency reports.
          </Notice>
        </div>
      </Section>
      <Section title="Apply to be a vendor">
        <ApplyForm
          kind="vendor"
          refPrefix="VND"
          submitLabel="Submit application"
          successTitle="Vendor application received"
          successText="Procurement reviews applications against the published criteria. You may be asked for samples."
          fields={[
            { name: "company", label: "Company name", type: "text", required: true },
            { name: "cac", label: "CAC registration number", type: "text", required: true },
            { name: "contact", label: "Contact person", type: "text", required: true },
            { name: "phone", label: "Mobile number", type: "tel", required: true },
            { name: "email", label: "Email", type: "email", required: true },
            { name: "state", label: "Head office state", type: "select", options: stateNames, required: true },
            { name: "categories", label: "Categories you supply", type: "checkboxes", options: CATS, required: true, span: true },
            { name: "capacity", label: "Capacity and lead times", type: "textarea", required: true, span: true, hint: "For example: 5,000 printed T-shirts per week, delivered to 6 states." },
            { name: "coi", label: "I will declare any family or business link to TBH One staff or leaders.", type: "check", required: true, span: true },
          ]}
        />
      </Section>
      <Section alt narrow>
        <Faq items={[{ q: "Can individuals be vendors?", a: "Small jobs can go to registered sole traders. Larger contracts require a CAC-registered company." }, { q: "Do I pay to register?", a: "No. Vendor registration is free. Never pay anyone to be selected." }]} />
      </Section>
    </>
  );
}
