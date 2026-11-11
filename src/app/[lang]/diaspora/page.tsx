import "@/styles/participate.css";
import Link from "next/link";
import { Globe2 } from "lucide-react";
import { localeParams } from "@/lib/meta";
import { href } from "@/lib/i18n";
import { localeOf, metaFor } from "@/components/participate/pageKit";
import { FactList, Faq, Notice, PageHeader, PrototypeNote, Section, Sources } from "@/components/ui/Page";
import { ApplyForm } from "@/components/participate/ApplyForm";
import { JoinToggle } from "@/components/participate/Toggles";
import { chapters } from "@/data/opportunities";
import { PeopleMosaic } from "@/components/PeopleMosaic";
import { peoplePhotos } from "@/data/photos";

export const generateStaticParams = localeParams;
export const generateMetadata = metaFor(
  "/diaspora",
  "TBH One Diaspora — Tell One from abroad and join a chapter",
  "Nigerians abroad join TBH One for free, Tell One family member at home, join a country chapter, and volunteer skills. Diaspora members do not send cash contributions through TBH One.",
);

export default async function DiasporaPage({ params }: { params: Promise<{ lang: string }> }) {
  const locale = await localeOf(params);
  const L = (p: string) => href(locale, p);
  return (
    <>
      <PageHeader
        locale={locale}
        crumbs={[{ label: "Get Involved" }, { label: "Diaspora" }]}
        title="TBH One Diaspora"
        kicker="You may be abroad. Your voice at home still counts."
        answer="Nigerians abroad can join TBH One free, then do the most powerful thing they can from a distance: Tell One. Call or message one parent, sibling, cousin or friend at home, explain why Nigeria needs leaders who will not steal its money, and help them check their voter registration. Join a country chapter to meet others, run online calls and volunteer skills. TBH One does not accept cash contributions from outside Nigeria."
        aside={
          <FactList
            cols={1}
            items={[
              { label: "Membership", value: "Free" },
              { label: "Best action", value: "Tell One at home" },
              { label: "Chapters", value: `${chapters.length} countries listed (demo)` },
              { label: "Cash from abroad", value: "Not accepted" },
            ]}
          />
        }
        actions={
          <>
            <Link href={L("/join")} className="btn btn-primary">
              Join free
            </Link>
            <a href="#chapters" className="btn btn-ghost">
              Find a chapter
            </a>
          </>
        }
      />
      <Section title="Tell One, from wherever you are">
        <ol className="steps">
          <li>
            <span>
              <strong>Pick one person at home.</strong> A parent, sibling, cousin, old classmate or a former neighbour who trusts you.
            </span>
          </li>
          <li>
            <span>
              <strong>Call, don&apos;t just forward.</strong> A five-minute voice call changes more minds than ten forwarded videos. Share the theme song in their language.
            </span>
          </li>
          <li>
            <span>
              <strong>Help them check their PVC.</strong> Walk them through INEC&apos;s registration check on <Link href={L("/voter-info")}>Voter Information</Link>.
            </span>
          </li>
          <li>
            <span>
              <strong>Ask them to Bring One.</strong> Each person they bring in grows the movement on the ground, where votes are cast.
            </span>
          </li>
        </ol>
      </Section>
      {peoplePhotos.length > 0 && (
        <Section title="The people back home">
          <PeopleMosaic limit={5} offset={6} />
        </Section>
      )}
      <Section alt id="chapters" title="Country chapters" intro="Chapters meet online and, where safe and lawful, in person. Joining a chapter saves it to your account so you get its call invites.">
        <span className="chip chip-demo">Demo data</span>
        <ul className="rowlist" role="list" style={{ marginTop: "var(--s3)" }}>
          {chapters.map((c) => (
            <li key={c.country}>
              <div>
                <strong>
                  <Globe2 size={16} aria-hidden style={{ display: "inline", verticalAlign: "-3px" }} /> {c.country}
                </strong>
                <p className="small muted">{c.city}</p>
              </div>
              <JoinToggle id={c.country} label={`${c.country} chapter`} storeKey="tbh-chapters" />
            </li>
          ))}
        </ul>
        <p className="small muted" style={{ marginTop: "var(--s3)" }}>
          Chapter coordinator contacts are shared privately after you join. TBH One never publishes personal numbers.
        </p>
      </Section>
      <Section title="Start or join a chapter" intro="No chapter in your city? Tell us and we&apos;ll connect you with other members nearby.">
        <div className="split">
          <ApplyForm
            kind="diaspora-chapter"
            refPrefix="DSP"
            submitLabel="Send"
            successTitle="Thanks — we have your details"
            successText="The diaspora desk will connect you with a chapter or help you start one."
            fields={[
              { name: "name", label: "Full name", type: "text", required: true },
              { name: "email", label: "Email", type: "email", required: true },
              { name: "country", label: "Country", type: "text", required: true },
              { name: "city", label: "City", type: "text", required: true },
              { name: "homeState", label: "Home state in Nigeria", type: "text" },
              { name: "help", label: "How would you like to help?", type: "checkboxes", options: ["Tell One calls", "Run chapter calls", "Content and design", "Translation", "Professional skills (legal, finance, tech)"], required: true },
              { name: "start", label: "I would like to start a chapter in my city", type: "check" },
            ]}
          />
          <div className="stack-lg">
            <Notice tone="warn" title="No cash from abroad">
              TBH One does not accept contributions from outside Nigeria while the rules for foreign funds are reviewed. Please do not send money to anyone claiming to collect for TBH One abroad, and report it on <Link href={L("/report")}>Report a problem</Link>.
            </Notice>
            <PrototypeNote>Chapter list and sign-ups are demonstration data in this prototype.</PrototypeNote>
          </div>
        </div>
      </Section>
      <Section alt narrow>
        <Faq
          items={[
            { q: "Can I vote from abroad?", a: "Nigeria does not currently provide for diaspora voting. You can only vote in person at your registered polling unit in Nigeria. Your biggest impact from abroad is helping people at home register and vote." },
            { q: "Can I fund a project from abroad?", a: "Not yet. Contributions are limited to people in Nigeria while legal review of foreign funds is completed. You can still Tell One, volunteer and share content." },
            { q: "Can I buy from the TBH One Shop abroad?", a: "Orders are delivered within Nigeria. You can buy for family at home with a Nigerian delivery address once payments open." },
          ]}
        />
        <Sources items={[{ label: "TBH One Concept Note, §3 Tell One, Bring One, Help One", date: "October 2026" }, { label: "TBH One PRD, CC-7 and FN-4 (foreign contributions)", date: "21 October 2026" }]} />
      </Section>
    </>
  );
}
