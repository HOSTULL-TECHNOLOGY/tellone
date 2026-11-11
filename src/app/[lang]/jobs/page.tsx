import "@/styles/participate.css";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { localeParams } from "@/lib/meta";
import { href } from "@/lib/i18n";
import { localeOf, metaFor } from "@/components/participate/pageKit";
import { PhotoFigure } from "@/components/PeopleMosaic";
import { peoplePhotos } from "@/data/photos";
import { Faq, PageHeader, PrototypeNote, Section } from "@/components/ui/Page";
import { jobs } from "@/data/opportunities";
import { formatDate } from "@/lib/format";

export const generateStaticParams = localeParams;
export const generateMetadata = metaFor(
  "/jobs",
  "Jobs at TBH One — paid, project-based and volunteer roles",
  "Open roles for TBH One members: call centre agents, photographers, video editors, web developers, translators, canvassing support, logistics and community volunteers.",
);

export default async function JobsPage({ params }: { params: Promise<{ lang: string }> }) {
  const locale = await localeOf(params);
  const L = (p: string) => href(locale, p);
  return (
    <>
      <PageHeader
        locale={locale}
        crumbs={[{ label: "Opportunities" }, { label: "Jobs" }]}
        title="Jobs"
        answer="TBH One creates real work for members: call-centre shifts, photography, video editing, web development, translation, canvassing, logistics and community projects. Most roles are project-based and paid per approved piece of work at published rates, funded by member-backed projects. Roles are open to TBH One members, and selection follows published criteria with conflicts of interest declared."
      />
      <Section title={`${jobs.length} open roles`} intro="Demonstration listings. Real roles are published from launch.">
        {peoplePhotos[2] && (
          <div style={{ marginBottom: "var(--s5)", maxWidth: 520 }}>
            <PhotoFigure photo={peoplePhotos[2]} sizes="(min-width: 600px) 520px, 100vw" />
          </div>
        )}
        <span className="chip chip-demo">Demo data</span>
        <ul className="rowlist" role="list" style={{ marginTop: "var(--s3)" }}>
          {jobs.map((j) => (
            <li key={j.slug}>
              <div className="rl-main">
                <Link href={L(`/jobs/${j.slug}`)}>
                  <strong>{j.title}</strong>
                </Link>
                <span className="small muted">
                  <MapPin size={14} aria-hidden style={{ display: "inline", verticalAlign: "-2px" }} /> {j.location} · {j.pay}
                </span>
              </div>
              <span className="badge badge-muted">{j.type}</span>
              <span className="small muted">Closes {formatDate(j.closes)}</span>
            </li>
          ))}
        </ul>
        <PrototypeNote>Applications in this prototype are stored in your browser only.</PrototypeNote>
      </Section>
      <Section alt narrow>
        <Faq
          items={[
            { q: "Do I need to be a member to apply?", a: "Yes. Membership is free — join first, then apply with the same phone number." },
            { q: "Will anyone ask me to pay for a job?", a: "Never. TBH One never charges application or training fees. Report anyone who asks." },
          ]}
        />
      </Section>
    </>
  );
}
