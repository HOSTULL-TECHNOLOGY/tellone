import Link from "next/link";
import { notFound } from "next/navigation";
import { Camera, Globe, BookOpen, Clapperboard, Mic, Megaphone } from "lucide-react";
import "@/styles/content.css";
import { href, isLocale, type Locale } from "@/lib/i18n";
import { localeParams, pageMeta } from "@/lib/meta";
import { Faq, Notice, PageHeader, PrototypeNote, Section } from "@/components/ui/Page";
import { AspirantRequest } from "@/components/content/AspirantRequest";
import { packages } from "@/data/mock/field";
import { formatNaira } from "@/lib/format";

export const generateStaticParams = localeParams;
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return pageMeta(lang as Locale, "/aspirants", "Aspirant Services for NDC aspirants", "Photography, personal websites, media production, PR and marketing for NDC aspirants, delivered by TBH One's vetted creative team. Request a package.");
}

const ICONS: Record<string, typeof Camera> = { "PK-PHOTO": Camera, "PK-WEB": Globe, "PK-WIKI": BookOpen, "PK-MEDIA": Clapperboard, "PK-PR": Mic, "PK-MKT": Megaphone };

export default async function AspirantsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return (
    <>
      <PageHeader
        locale={lang}
        crumbs={[{ label: "The Party" }, { label: "Aspirant Services" }]}
        title="Aspirant Services"
        answer="Aspirant Services is TBH One's service line for people seeking office on the NDC platform, from councillor to governor. Our vetted creative team delivers a free profile photoshoot and discounted websites, media production, PR and marketing campaigns. Choose your services, send a request, and track delivery and approvals in your aspirant dashboard."
        updated="2026-10-23"
      />
      <Section id="packages" title="Service packages">
        <div className="card-grid">
          {packages.map((p) => {
            const Icon = ICONS[p.id] ?? Megaphone;
            return (
              <article key={p.id} className="pkg">
                <Icon size={24} aria-hidden />
                <h3>{p.name}</h3>
                <p style={{ margin: 0, fontWeight: 700 }}>{p.price === 0 ? "Free" : `From ${formatNaira(p.price)}`}</p>
                <p className="muted" style={{ margin: 0 }}>{p.includes}</p>
                <p style={{ margin: 0 }}><span className="chip">{p.note}</span></p>
              </article>
            );
          })}
        </div>
        <PrototypeNote>Package prices are indicative prototype figures pending approval by the National Coordination team.</PrototypeNote>
      </Section>
      <Section id="request" title="Request services" alt>
        <Notice tone="info" title="Services do not affect nominations">
          TBH One does not decide or influence NDC primaries or nominations. Buying a service gives no advantage in any party process.
        </Notice>
        <div style={{ height: 24 }} />
        <AspirantRequest packages={packages.map((p) => ({ id: p.id, name: p.name }))} />
      </Section>
      <Section narrow>
        <Faq
          items={[
            { q: "Who can use Aspirant Services?", a: "Anyone seeking elective office on the NDC platform at any level. We confirm your aspiration before work starts." },
            { q: "How do I pay?", a: "After a call to confirm scope, you receive an invoice. Payment runs through the same audited channels as the rest of TBH One; we never ask for payment into a personal account." },
            { q: "Do you write Wikipedia articles?", a: "No. We offer sourcing guidance only. We never pay for, write or edit promotional Wikipedia content, which would break Wikipedia's rules." },
            { q: "How do I track my order?", a: "Every request appears in the aspirant dashboard with status, due date, deliverables to approve and invoices." },
          ]}
        />
      </Section>
      <Section narrow>
        <p>
          Already a client? <Link href="/dashboard/aspirant">Open the aspirant dashboard</Link>. Questions about the party itself? <Link href={href(lang, "/ndc")}>About the NDC</Link>.
        </p>
      </Section>
    </>
  );
}
