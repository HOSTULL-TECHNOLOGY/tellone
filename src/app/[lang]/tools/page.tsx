import Link from "next/link";
import { notFound } from "next/navigation";
import { Download } from "lucide-react";
import "@/styles/content.css";
import { href, isLocale, type Locale } from "@/lib/i18n";
import { localeParams, pageMeta } from "@/lib/meta";
import { CtaBand, Notice, PageHeader, Section } from "@/components/ui/Page";
import { MessageComposer } from "@/components/content/MessageComposer";
import { talkingPoints } from "@/data/messages";

export const generateStaticParams = localeParams;
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return pageMeta(lang as Locale, "/tools", "Campaign tools: WhatsApp messages, talking points and fliers", "Write a WhatsApp message in five languages, use this week's talking points and download flier templates to tell one, bring one and help one.");
}

const FLIERS = [
  { p: "en", t: "Tagline flier (English)" },
  { p: "ha", t: "Tagline flier (Hausa)" },
  { p: "yo", t: "Tagline flier (Yorùbá)" },
  { p: "ig", t: "Tagline flier (Igbo)" },
];

export default async function ToolsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const L = (p: string) => href(lang, p);
  return (
    <>
      <PageHeader
        locale={lang}
        crumbs={[{ label: "Resources" }, { label: "Campaign tools" }]}
        title="Campaign tools"
        answer="These tools help you do the three TBH One actions well. Write a personal WhatsApp message in English, Pidgin, Yorùbá, Hausa or Igbo and copy it in one tap, use this week's five talking points in conversation, and download print-ready flier templates for your street, market or place of worship."
        updated="2026-10-23"
      />
      <Section id="composer" title="WhatsApp message composer">
        <MessageComposer />
        <div style={{ height: 16 }} />
        <Notice tone="info">Send messages one to one, to people you know. Do not bulk-message strangers or add people to groups without asking.</Notice>
      </Section>
      <Section id="talking-points" title="This week's talking points" alt narrow>
        <ol className="prose" style={{ paddingLeft: 20 }}>
          {talkingPoints.map((t) => (
            <li key={t.h}>
              <strong>{t.h}.</strong> {t.p}
            </li>
          ))}
        </ol>
      </Section>
      <Section id="fliers" title="Flier templates">
        <div className="dl-grid">
          {FLIERS.map((f) => (
            <div className="dl-card" key={f.p}>
              <img src={`/media/poster-${f.p}-480.webp`} alt="" width={480} height={580} loading="lazy" />
              <strong>{f.t}</strong>
              <span className="dl-meta">JPG · 1320 px · prints at A5</span>
              <a className="btn btn-sm btn-outline" href={`/media/poster-${f.p}-1320.jpg`} download={`tbh-one-flier-${f.p}.jpg`}>
                <Download size={16} aria-hidden /> Download
              </a>
            </div>
          ))}
        </div>
      </Section>
      <CtaBand
        title="Log what you did"
        text="Every message, conversation and project you support earns Impact Points in your dashboard."
        actions={
          <>
            <Link href={L("/join")} className="btn btn-primary">Join free</Link>
            <Link href={L("/downloads")} className="btn btn-outline">Brand kit</Link>
          </>
        }
      />
    </>
  );
}
