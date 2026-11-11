import Link from "next/link";
import { notFound } from "next/navigation";
import "@/styles/content.css";
import { href, isLocale, type Locale } from "@/lib/i18n";
import { localeParams, pageMeta } from "@/lib/meta";
import { CtaBand, Faq, PageHeader, Section, Sources } from "@/components/ui/Page";
import { CONCEPT_NOTE, PRD } from "@/data/factsheet";

export const generateStaticParams = localeParams;
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return pageMeta(lang as Locale, "/framework", "The T-B-H Framework: Tell One, Bring One, Help One", "How each TBH One action works — Tell One, Bring One and Help One — with worked examples and how to earn Impact Points.");
}

const actions = [
  {
    id: "tell-one",
    title: "T-One — Tell One",
    asks: "Nigerians abroad who cannot vote tell their family back home who to vote for.",
    why: "Nigerians in Germany, the UK, the United States, Canada, Ghana, Togo and elsewhere often support family at home, and that relationship of trust carries real weight. Rather than only encouraging relatives to “vote their conscience”, T-One asks the diaspora to make a direct, personal case for Obi and Kwankwaso.",
    steps: ["Join TBH One and your country’s diaspora chapter.", "Use the weekly talking points in your family’s language.", "Call or message your family, then log the conversation — count and relative only."],
    example: { who: "Example", text: "Chika, a nurse in Manchester, sends money home to her parents in Onitsha every month. On her Sunday call she explains why “We will not steal your money” matters for her father’s clinic visits, and logs one Tell One conversation in her dashboard." },
    path: "/diaspora",
    cta: "Join a diaspora chapter",
  },
  {
    id: "bring-one",
    title: "B-One — Bring One",
    asks: "Bring and convince one friend who is sitting on the fence.",
    why: "Everyone has meaningful influence over at least one person. B-One asks you to share the vision, talk about why Nigeria needs leaders who will not steal its money, help your friend register, and go to the polls together on Election Day.",
    steps: ["Pick one friend, neighbour or colleague.", "Share the message in their language.", "Help them check their registration with INEC and plan Election Day together."],
    example: { who: "Example", text: "Musa, a trader in Kano, brings his friend Sani to a village meeting on Gama Road. Sani joins TBH One that evening and Musa earns referral points once Sani’s sign-up is verified." },
    path: "/join",
    cta: "Become a member",
  },
  {
    id: "help-one",
    title: "H-One — Help One",
    asks: "Support a community or a person in need.",
    why: "People remain loyal to those who help them, even in small ways. H-One channels TBH One’s community projects into genuine, earned loyalty at the grassroots rather than transactional or one-off engagement.",
    steps: ["Help a person directly, or fund a published community project.", "Propose a project for your ward with an estimated cost.", "Follow delivery photos and receipts to completion."],
    example: { who: "Example", text: "Funmi’s ward in Surulere proposes repairing a broken borehole. The project is published with a cost, members fund it, and the ward leader uploads repair photos when it is delivered." },
    path: "/projects",
    cta: "Fund a project",
  },
];

export default async function FrameworkPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const L = (p: string) => href(lang, p);
  return (
    <>
      <PageHeader
        locale={lang}
        crumbs={[{ label: "The Movement", path: "/about" }, { label: "The T-B-H Framework" }]}
        title="The T-B-H Framework"
        kicker="Tell One. Bring One. Help One."
        answer="TBH One’s theory of change rests on three person-to-person actions. Tell One asks Nigerians abroad to tell family at home who to vote for. Bring One asks you to convince one friend on the fence. Help One asks you to support a person or community in need. Each turns influence you already have into democratic participation."
        updated="2026-10-23"
      />
      <Section id="actions">
        <div className="tbh-big">
          {actions.map((a) => (
            <article key={a.id} id={a.id}>
              <h2>{a.title}</h2>
              <p>
                <strong>What it asks: </strong>
                {a.asks}
              </p>
              <p>{a.why}</p>
              <ol className="prose" style={{ paddingLeft: "1.4em" }}>
                {a.steps.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ol>
              <div className="example">
                <strong>{a.example.who}</strong>
                {a.example.text}
                <span className="muted small"> (Illustrative scenario, not a real member.)</span>
              </div>
              <p>
                <Link href={L(a.path)} className="btn btn-primary">
                  {a.cta}
                </Link>
              </p>
            </article>
          ))}
        </div>
      </Section>
      <Section id="faq" alt narrow>
        <Faq
          items={[
            { q: "Do I have to do all three actions?", a: "No. Pick the one that fits you. Your member dashboard suggests one action each day." },
            { q: "Does TBH One record who my friends vote for?", a: "No. TBH One never records voting intention, PVC numbers or how anyone voted. A Tell One log records only the count and the relative." },
            { q: "Do I earn anything for these actions?", a: "Verified actions earn Impact Points, which convert into rewards such as airtime, data or a T-shirt. Rewards never depend on how anyone votes." },
          ]}
        />
        <Sources items={[{ label: CONCEPT_NOTE }, { label: PRD }]} />
      </Section>
      <CtaBand
        title="Start with one"
        actions={
          <Link href={L("/join")} className="btn btn-primary">
            Join TBH One — it&apos;s free
          </Link>
        }
      />
    </>
  );
}
