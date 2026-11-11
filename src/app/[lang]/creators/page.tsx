import "@/styles/participate.css";
import Link from "next/link";
import { localeParams } from "@/lib/meta";
import { href } from "@/lib/i18n";
import { localeOf, metaFor } from "@/components/participate/pageKit";
import { Faq, Notice, PageHeader, Section, Sources } from "@/components/ui/Page";
import { ApplyForm } from "@/components/participate/ApplyForm";
import { stateNames } from "@/data/states";
import { site } from "@/config/site";

export const generateStaticParams = localeParams;
export const generateMetadata = metaFor(
  "/creators",
  "TBH One creator programme — make content, follow the code",
  "Skit-makers, musicians, designers and influencers can join the TBH One creator programme. Clear rules for user-generated content, AI use, paid sponsorship declarations and conduct.",
);

export default async function CreatorsPage({ params }: { params: Promise<{ lang: string }> }) {
  const locale = await localeOf(params);
  const L = (p: string) => href(locale, p);
  return (
    <>
      <PageHeader
        locale={locale}
        crumbs={[{ label: "Get Involved" }, { label: "Creators" }]}
        title="Creator programme"
        kicker="Make the message travel — honestly."
        answer={`Creators — skit-makers, musicians, designers, photographers and influencers — help TBH One reach people where they already scroll. Join the programme to get briefs, approved assets and the theme songs, and to be considered for paid, declared work. Everything you post follows three rules: say when content is sponsored, label AI-generated material, and never attack, mislead or impersonate. Use ${site.hashtags[0]}.`}
        actions={
          <a href="#apply" className="btn btn-primary">
            Apply to join
          </a>
        }
      />
      <Section title="The rules everyone follows">
        <div className="card-grid" style={{ ["--min" as string]: "260px" }}>
          <div className="card">
            <h3>User-generated content</h3>
            <ul className="ticks">
              <li>Make your own original content using the approved assets and facts</li>
              <li>Get consent before filming anyone, and never film children without a parent&apos;s permission</li>
              <li>Don&apos;t use other people&apos;s music or footage without the right to</li>
            </ul>
          </div>
          <div className="card">
            <h3>AI use</h3>
            <ul className="ticks">
              <li>Label any AI-generated or AI-edited image, voice or video clearly</li>
              <li>Never make deepfakes of real people, including opponents</li>
              <li>Never put words in a real person&apos;s mouth</li>
            </ul>
          </div>
          <div className="card">
            <h3>Sponsorship</h3>
            <ul className="ticks">
              <li>If TBH One pays you or gives you anything of value, say so in the post: &ldquo;Paid partnership with TBH One&rdquo;</li>
              <li>Paid work is agreed in writing before you post</li>
              <li>Paid promotion stops at the campaign cut-off</li>
            </ul>
          </div>
        </div>
      </Section>
      <Section alt title="Code of conduct">
        <ol className="steps">
          <li>
            <span>Argue on issues and records. No insults about ethnicity, religion, gender or disability.</span>
          </li>
          <li>
            <span>Check facts against the Campaign Hub before posting. If you get something wrong, correct it publicly.</span>
          </li>
          <li>
            <span>Never claim to speak officially for Peter Obi, Rabiu Musa Kwankwaso, the NDC or TBH One unless you are authorised.</span>
          </li>
          <li>
            <span>Never offer money, gifts or inducements for votes, and never share content that does.</span>
          </li>
          <li>
            <span>Respect the cut-off: no campaign content from the end of 14 January 2027 until polls close.</span>
          </li>
        </ol>
        <Notice tone="warn" title="Breaking the code">
          Breaches lead to removal from the programme and, where content is unlawful, a report to the relevant platform or authority. See <Link href={L("/report")}>Report a problem</Link>.
        </Notice>
      </Section>
      <Section id="apply" title="Apply to the creator programme">
        <ApplyForm
          kind="creator"
          refPrefix="CRT"
          submitLabel="Send application"
          successTitle="Application received"
          successText="The media team reviews creator applications weekly. You'll get the creator brief and asset pack by email if accepted."
          fields={[
            { name: "name", label: "Full name", type: "text", required: true },
            { name: "email", label: "Email", type: "email", required: true },
            { name: "phone", label: "Mobile number", type: "tel", required: true },
            { name: "state", label: "State", type: "select", options: [...stateNames, "Outside Nigeria"], required: true },
            { name: "platforms", label: "Where do you post?", type: "checkboxes", options: ["TikTok", "Instagram", "YouTube", "X", "Facebook", "WhatsApp Status", "Radio or offline"], required: true },
            { name: "link", label: "Link to your best work", type: "url", required: true, placeholder: "https://" },
            { name: "kind", label: "Main content type", type: "select", options: ["Skits and comedy", "Music", "Explainers", "Design and graphics", "Photography", "Livestreams"], required: true },
            { name: "paid", label: "Are you interested in paid, declared work?", type: "select", options: ["Yes", "No — volunteer only"], required: true },
            { name: "code", label: "I have read and will follow the content, AI-use and sponsorship rules and the code of conduct.", type: "check", required: true, span: true },
          ]}
        />
      </Section>
      <Section alt narrow>
        <Faq
          items={[
            { q: "Can I use the theme songs?", a: "Yes. Members can download and use the TBH One theme songs in their content with credit. See the Theme Song page." },
            { q: "Will TBH One pay me?", a: "Some creator work is paid per approved piece. Paid work is always agreed in writing first and must be declared in your post." },
          ]}
        />
        <Sources items={[{ label: "TBH One Concept Note, §8 Media & Content", date: "October 2026" }]} />
      </Section>
    </>
  );
}
