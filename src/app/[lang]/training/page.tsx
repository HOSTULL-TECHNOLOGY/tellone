import "@/styles/participate.css";
import { localeParams } from "@/lib/meta";
import { localeOf, metaFor } from "@/components/participate/pageKit";
import { PhotoFigure } from "@/components/PeopleMosaic";
import { peoplePhotos } from "@/data/photos";
import { Faq, PageHeader, PrototypeNote, Section } from "@/components/ui/Page";
import { TrainingCalendar } from "@/components/participate/Toggles";
import { trainings } from "@/data/opportunities";
import { JsonLd } from "@/lib/seo";
import { site } from "@/config/site";

export const generateStaticParams = localeParams;
export const generateMetadata = metaFor(
  "/training",
  "Free training for TBH One members — calendar and registration",
  "Free online and in-person courses for members: safety and conduct, digital skills, business, media and content, and organising. Filter by topic and format and register for a seat.",
);

export default async function TrainingPage({ params }: { params: Promise<{ lang: string }> }) {
  const locale = await localeOf(params);
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": trainings.map((t) => ({
            "@type": "Course",
            name: t.title,
            description: t.summary,
            provider: { "@type": "Organization", name: site.name, sameAs: site.url },
            isAccessibleForFree: true,
            hasCourseInstance: {
              "@type": "CourseInstance",
              courseMode: t.mode === "Online" ? "online" : "onsite",
              startDate: t.date,
              location: t.mode === "Online" ? { "@type": "VirtualLocation", url: site.url } : { "@type": "Place", name: t.place, address: { "@type": "PostalAddress", addressLocality: t.place, addressRegion: t.state, addressCountry: "NG" } },
            },
          })),
        }}
      />
      <PageHeader
        locale={locale}
        crumbs={[{ label: "Opportunities" }, { label: "Training" }]}
        title="Training"
        answer="TBH One runs free training for members: safety, conduct and reporting for everyone working in the field; digital skills for logging work on a basic phone; small-business skills; media and content production; and organising village meetings. Some courses are required before you start a leader role. Filter the calendar by topic and format, then register for a seat — you'll get a reminder the day before."
      />
      <Section title="Training calendar">
        {peoplePhotos[7] && (
          <div style={{ marginBottom: "var(--s5)", maxWidth: 420 }}>
            <PhotoFigure photo={peoplePhotos[7]} sizes="(min-width: 600px) 420px, 100vw" />
          </div>
        )}
        <span className="chip chip-demo">Demo data</span>
        <div style={{ marginTop: "var(--s3)" }}>
          <TrainingCalendar items={trainings} />
        </div>
        <PrototypeNote>Registrations are saved in this browser only in the prototype.</PrototypeNote>
      </Section>
      <Section alt narrow>
        <Faq
          items={[
            { q: "Is training free?", a: "Yes. All TBH One training is free for members. Nobody may charge you to attend." },
            { q: "Which courses are required?", a: "Safety, conduct and reporting is required before any field task. Ward leaders also complete Running a village meeting." },
            { q: "Do I get a certificate?", a: "Completed courses appear on your dashboard and earn Impact Points." },
          ]}
        />
      </Section>
    </>
  );
}
