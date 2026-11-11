import "@/styles/participate.css";
import Link from "next/link";
import { localeParams } from "@/lib/meta";
import { href } from "@/lib/i18n";
import { localeOf, metaFor } from "@/components/participate/pageKit";
import { FactList, Faq, PageHeader, Section } from "@/components/ui/Page";
import { ApplyForm } from "@/components/participate/ApplyForm";

export const generateStaticParams = localeParams;
export const generateMetadata = metaFor(
  "/translators",
  "Translate for TBH One — Pidgin, Yorùbá, Hausa, Igbo and more",
  "Help TBH One speak every Nigerian's language. Translators review website copy, voter guides, songs and scripts in Pidgin, Yorùbá, Hausa, Igbo and other Nigerian languages.",
);

const LANGS = ["Nigerian Pidgin", "Yorùbá", "Hausa", "Igbo", "Tiv", "Kanuri", "Fulfulde", "Ibibio", "Ijaw", "Edo", "Nupe", "Urhobo", "Other"];

export default async function TranslatorsPage({ params }: { params: Promise<{ lang: string }> }) {
  const locale = await localeOf(params);
  const L = (p: string) => href(locale, p);
  return (
    <>
      <PageHeader
        locale={locale}
        crumbs={[{ label: "Get Involved" }, { label: "Translators" }]}
        title="Translate for TBH One"
        answer="TBH One launches in English, Nigerian Pidgin, Yorùbá, Hausa and Igbo, and wants to reach people in many more languages. Translators review website pages, voter guides, theme-song lyrics, radio scripts and SMS messages so they read naturally and say exactly the same thing in every language. Work is reviewed by a second speaker before it is published, and some translation projects are paid per approved piece."
        aside={
          <FactList
            cols={1}
            items={[
              { label: "Launch languages", value: "English, Pidgin, Yorùbá, Hausa, Igbo" },
              { label: "Review", value: "Every translation checked by a second speaker" },
              { label: "Paid work", value: "Per approved piece, via funded projects" },
            ]}
          />
        }
      />
      <Section title="What translators do">
        <ul className="ticks">
          <li>Translate and review pages and voter guides, keeping facts and dates exact</li>
          <li>Check song lyrics and radio scripts for meaning and tone</li>
          <li>Flag anything that could be misunderstood or offensive in your language</li>
          <li>Record short voice notes for people who prefer listening to reading</li>
        </ul>
        <p className="small muted">
          Some translator roles are funded by members, for example{" "}
          <Link href={L("/projects/adopt-a-salary-translator-igbo")}>Adopt-a-Salary: Igbo translator</Link>.
        </p>
      </Section>
      <Section alt title="Sign up as a translator">
        <ApplyForm
          kind="translator"
          refPrefix="TRN"
          submitLabel="Sign up"
          successTitle="Thank you — you're on the translator list"
          successText="We'll send you a short test passage in your languages. Once it's reviewed, you'll start receiving work."
          fields={[
            { name: "name", label: "Full name", type: "text", required: true },
            { name: "email", label: "Email", type: "email", required: true },
            { name: "phone", label: "Mobile number", type: "tel" },
            { name: "languages", label: "Languages you can translate into", type: "checkboxes", options: LANGS, required: true, span: true },
            { name: "level", label: "Your level", type: "select", options: ["Native speaker", "Fluent", "Professional translator"], required: true },
            { name: "hours", label: "Hours per week", type: "select", options: ["Up to 2", "2–5", "5–10", "More than 10"], required: true },
            { name: "samples", label: "Previous translation work (optional)", type: "textarea" },
          ]}
        />
      </Section>
      <Section narrow>
        <Faq
          items={[
            { q: "Do I need a qualification?", a: "No. Fluent native speakers are welcome. Every translation is reviewed by a second speaker before it is published." },
            { q: "Which spelling do you use for Yorùbá and Igbo?", a: "Standard orthography with tone marks where they help understanding. Your test passage includes a short style guide." },
          ]}
        />
      </Section>
    </>
  );
}
