import Link from "next/link";
import { notFound } from "next/navigation";
import { HandHeart, Megaphone, Users } from "lucide-react";
import "@/styles/content.css";
import { href, isLocale, type Locale } from "@/lib/i18n";
import { localeParams, pageMeta } from "@/lib/meta";
import { CtaBand, PageHeader, Section, Sources, Faq, CardGrid, LinkCard } from "@/components/ui/Page";
import { FactSheetTable } from "@/components/content/FactSheetTable";
import { benchmarks, CONCEPT_NOTE, TICKET_SOURCE, TICKET_URL } from "@/data/factsheet";
import { JsonLd, organizationLd } from "@/lib/seo";
import { PeopleMosaic } from "@/components/PeopleMosaic";
import { peoplePhotos } from "@/data/photos";

export const generateStaticParams = localeParams;
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return pageMeta(lang as Locale, "/about", "About TBH One: Tell One, Bring One, Help One", "TBH One is a free, people-powered initiative for Peter Obi, Rabiu Musa Kwankwaso and the NDC. Who we are, how it works, our targets and the Fact Sheet.");
}

export default async function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const L = (p: string) => href(lang, p);
  return (
    <>
      <JsonLd data={organizationLd()} />
      <PageHeader
        locale={lang}
        crumbs={[{ label: "The Movement" }, { label: "About TBH One" }]}
        title="About TBH One"
        kicker="Tell One. Bring One. Help One."
        answer="TBH One is a free, community and people-powered initiative for Peter Obi and Rabiu Musa Kwankwaso, working with the Nigeria Democratic Congress (NDC) toward the presidential election on Saturday 16 January 2027. Every Nigerian, at home or abroad, can take part through three simple actions — tell one, bring one, help one — and fund published projects they can track to delivery."
        updated="2026-10-23"
        actions={
          <>
            <Link href={L("/join")} className="btn btn-primary">
              Join TBH One — it&apos;s free
            </Link>
            <Link href={L("/framework")} className="btn btn-outline">
              How the framework works
            </Link>
          </>
        }
      />

      <Section id="who" title="Who we are" narrow>
        <div className="prose">
          <p>
            TBH One exists to mobilise a mass movement of Nigerians at home and abroad — members, project funders and volunteers — and to build the infrastructure for sustained civic participation across all 36 states and the Federal Capital
            Territory.
          </p>
          <p>
            Our design choices rest on a simple observation: Nigerians commit when they can see a credible plan to win, not just a cause to believe in. So TBH One pairs genuine public hope with a visibly structured plan — free membership,
            citizen-funded projects, a public transparency commitment, and a ground structure of ward leaders, street leaders and diaspora country coordinators.
          </p>
          <blockquote>This is not Peter Obi alone. This is all of us. TBH One is the vehicle through which millions of ordinary Nigerians make extraordinary history.</blockquote>
          <p className="small muted">— TBH One National Coordinator, as quoted in the Concept Note (October 2026).</p>
          <p>
            TBH One is a supporting initiative. It is not the candidates&apos; official campaign website and does not speak for Peter Obi, Rabiu Musa Kwankwaso or the NDC.
          </p>
        </div>
      </Section>

      {peoplePhotos.length > 0 && (
        <Section id="people" title="The Nigerians we’re working for">
          <PeopleMosaic limit={5} offset={0} />
        </Section>
      )}
      <Section id="tbh" title="Three actions every member can take" alt>
        <CardGrid min={260}>
          <LinkCard locale={lang} path="/framework#tell-one" icon={<Megaphone size={24} aria-hidden />} title="Tell One" text="Nigerians abroad who cannot vote tell their family at home who to vote for." />
          <LinkCard locale={lang} path="/framework#bring-one" icon={<Users size={24} aria-hidden />} title="Bring One" text="Bring and convince one friend who is sitting on the fence." />
          <LinkCard locale={lang} path="/framework#help-one" icon={<HandHeart size={24} aria-hidden />} title="Help One" text="Support a community or a person in need." />
        </CardGrid>
      </Section>

      <Section id="benchmarks" title="What we are aiming for" intro="These are targets from the Concept Note, not results. Progress against them is reported on the Transparency page.">
        <div className="table-wrap">
          <table className="ctable stack-sm">
            <caption>Success benchmarks (targets)</caption>
            <thead>
              <tr>
                <th scope="col">Benchmark</th>
                <th scope="col" className="num">
                  Target
                </th>
                <th scope="col">What it means</th>
              </tr>
            </thead>
            <tbody>
              {benchmarks.map((b) => (
                <tr key={b.benchmark}>
                  <th scope="row">{b.benchmark}</th>
                  <td className="num" data-label="Target">
                    {b.target}
                  </td>
                  <td data-label="What it means">{b.meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section id="fact-sheet" title="Fact Sheet" intro="One set of citeable facts, reused across the site so figures never conflict. Each fact names its source and date." alt>
        <FactSheetTable />
      </Section>

      <Section id="faq" narrow>
        <Faq
          items={[
            { q: "Is TBH One a political party?", a: "No. TBH One is a community-powered initiative supporting Peter Obi and Rabiu Musa Kwankwaso, working with the Nigeria Democratic Congress (NDC). Joining TBH One does not make you an NDC member." },
            { q: "Who can join?", a: "Every Nigerian aged 18 or over, at home or abroad. Membership is free with no invitation needed." },
            { q: "How is TBH One funded?", a: "Members, supporters and businesses fund specific published projects. Every project shows a live progress bar and a monthly spend summary is published." },
            { q: "What happens after the election?", a: "From 17 January 2027 community projects, ward and street leaders and the volunteer network transition into TBH One’s longer-term civic-participation platform across all 774 LGAs." },
          ]}
        />
        <Sources items={[{ label: CONCEPT_NOTE }, { label: TICKET_SOURCE, url: TICKET_URL, date: "31 May 2026" }]} />
      </Section>

      <CtaBand
        title="Move one more person"
        text="Join free, then pick today’s Tell One, Bring One or Help One action."
        actions={
          <>
            <Link href={L("/join")} className="btn btn-primary">
              Become a member
            </Link>
            <Link href={L("/projects")} className="btn btn-outline">
              Fund a project
            </Link>
          </>
        }
      />
    </>
  );
}
