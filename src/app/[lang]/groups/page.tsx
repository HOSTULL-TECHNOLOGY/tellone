import "@/styles/participate.css";
import Link from "next/link";
import { Users } from "lucide-react";
import { localeParams } from "@/lib/meta";
import { href } from "@/lib/i18n";
import { localeOf, metaFor } from "@/components/participate/pageKit";
import { Faq, PageHeader, PrototypeNote, Section } from "@/components/ui/Page";
import { ApplyForm } from "@/components/participate/ApplyForm";
import { JoinToggle } from "@/components/participate/Toggles";
import { groups } from "@/data/opportunities";

export const generateStaticParams = localeParams;
export const generateMetadata = metaFor(
  "/groups",
  "Volunteer and support groups — find your people in TBH One",
  "Join TBH One volunteer and support groups for youth, women, traders, drivers, professionals, faith communities, disability inclusion and creatives, or propose a new group.",
);

export default async function GroupsPage({ params }: { params: Promise<{ lang: string }> }) {
  const locale = await localeOf(params);
  const L = (p: string) => href(locale, p);
  return (
    <>
      <PageHeader
        locale={locale}
        crumbs={[{ label: "Get Involved" }, { label: "Groups" }]}
        title="Volunteer and support groups"
        answer="Groups bring together members who share a trade, a background or a skill, so they can organise in the places they already gather: markets, motor parks, campuses, offices and places of worship. Join as many groups as you like; each one saves to your account and you'll get its updates. Groups are open to every member and follow the same Code of Conduct."
      />
      <Section title="Open groups" intro="Tap Join to add a group to your account. You can leave at any time.">
        <span className="chip chip-demo">Demo data</span>
        <ul className="rowlist" role="list" style={{ marginTop: "var(--s3)" }}>
          {groups.map((g) => (
            <li key={g.id}>
              <div>
                <strong>
                  <Users size={16} aria-hidden style={{ display: "inline", verticalAlign: "-3px" }} /> {g.name}
                </strong>{" "}
                <span className="badge badge-muted">{g.kind}</span>
                <p className="small muted">{g.text}</p>
              </div>
              <JoinToggle id={g.id} label={g.name} storeKey="tbh-groups" />
            </li>
          ))}
        </ul>
      </Section>
      <Section alt title="Propose a new group">
        <div className="split">
          <ApplyForm
            kind="group-proposal"
            refPrefix="GRP"
            submitLabel="Propose group"
            successTitle="Group proposal received"
            successText="The volunteer desk reviews proposals weekly and will contact you about next steps."
            fields={[
              { name: "name", label: "Your full name", type: "text", required: true },
              { name: "phone", label: "Mobile number", type: "tel", required: true },
              { name: "group", label: "Proposed group name", type: "text", required: true },
              { name: "kind", label: "Type", type: "select", options: ["Volunteer", "Support"], required: true },
              { name: "purpose", label: "Who is it for and what will it do?", type: "textarea", required: true },
            ]}
          />
          <div className="card">
            <h3>Want a bigger role?</h3>
            <p className="muted">Groups are a great start. When you are ready, lead your street or ward.</p>
            <Link href={L("/street-leaders")} className="btn btn-sm btn-ghost">
              Street leaders
            </Link>{" "}
            <Link href={L("/ward-leaders")} className="btn btn-sm btn-ghost">
              Ward leaders
            </Link>
          </div>
        </div>
        <PrototypeNote>Group memberships are saved in this browser only in the prototype.</PrototypeNote>
      </Section>
      <Section narrow>
        <Faq
          items={[
            { q: "Are groups linked to a party?", a: "Groups are part of TBH One, a movement supporting Peter Obi, Rabiu Musa Kwankwaso and the NDC. Faith and professional groups focus on respectful voter education and skills, not pressure." },
            { q: "Can I run a group in my state?", a: "Yes. State chapters of each group are set up with the state coordinator once enough members join." },
          ]}
        />
      </Section>
    </>
  );
}
