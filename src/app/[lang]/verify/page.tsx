import Link from "next/link";
import { notFound } from "next/navigation";
import "@/styles/content.css";
import { href, isLocale, type Locale } from "@/lib/i18n";
import { localeParams, pageMeta, site } from "@/lib/meta";
import { CtaBand, Notice, PageHeader, PrototypeNote, Section } from "@/components/ui/Page";
import { LeaderIdCheck } from "@/components/content/LeaderIdCheck";

export const generateStaticParams = localeParams;
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return pageMeta(lang as Locale, "/verify", "Verify official TBH One channels and leader IDs", "Check that a TBH One phone number, social account, app or leader ID is genuine before you pay, share data or meet anyone.", { noindex: true });
}

export default async function VerifyPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const L = (p: string) => href(lang, p);
  const pending = <span className="chip">Pending — not yet published</span>;
  const channels: { label: string; value: string | null; link?: (v: string) => string }[] = [
    { label: "Website", value: site.url.replace(/^https?:\/\//, ""), link: () => site.url },
    { label: "WhatsApp number", value: site.contact.whatsappNumber ? `+${site.contact.whatsappNumber}` : null, link: (v) => `https://wa.me/${v.replace("+", "")}` },
    { label: "Toll-free line", value: site.contact.tollFree, link: (v) => `tel:${v}` },
    { label: "Email", value: site.contact.email, link: (v) => `mailto:${v}` },
    { label: "Press email", value: site.contact.pressEmail, link: (v) => `mailto:${v}` },
    { label: "X (Twitter)", value: site.social.x, link: (v) => v },
    { label: "Instagram", value: site.social.instagram, link: (v) => v },
    { label: "Facebook", value: site.social.facebook, link: (v) => v },
    { label: "TikTok", value: site.social.tiktok, link: (v) => v },
    { label: "YouTube", value: site.social.youtube, link: (v) => v },
    { label: "Android app", value: site.apps.android, link: (v) => v },
    { label: "iPhone app", value: site.apps.ios, link: (v) => v },
  ];
  return (
    <>
      <PageHeader
        locale={lang}
        crumbs={[{ label: "Resources" }, { label: "Verify" }]}
        title="Verify official channels and leader IDs"
        answer="Scammers copy campaigns. Before you pay anyone, share personal details or meet someone claiming to represent TBH One, check here. This page lists every official TBH One channel; anything not on it is not us. You can also check a leader's ID. Membership is free, and no genuine leader will ask you to pay into a personal account."
        updated="2026-10-23"
      />
      <Section id="channels" title="Official channels" narrow>
        <ul className="channel-list" role="list">
          {channels.map((c) => (
            <li key={c.label}>
              <strong>{c.label}</strong>
              {c.value ? (
                <a href={c.link ? c.link(c.value) : undefined} rel="noopener noreferrer" target={c.link && c.link(c.value).startsWith("http") ? "_blank" : undefined}>
                  {c.value}
                </a>
              ) : (
                pending
              )}
            </li>
          ))}
        </ul>
        <p className="small muted" style={{ marginTop: 12 }}>
          A channel marked pending has not been launched. Any account, number or app using the TBH One name before it appears here is not official.
        </p>
      </Section>
      <Section id="leader" title="Check a leader ID" alt narrow>
        <LeaderIdCheck />
        <PrototypeNote>The register is demonstration data. Try TBH-LDR-00042 (valid), TBH-LDR-00388 (suspended) or TBH-LDR-99999 (unknown).</PrototypeNote>
      </Section>
      <Section id="rules" title="Three rules that keep you safe" narrow>
        <Notice tone="warn">
          TBH One will never ask for your PVC number, a photograph of your ballot, your bank PIN or a one-time password. We never collect cash on behalf of a project. Membership is always free.
        </Notice>
      </Section>
      <CtaBand
        title="Seen something suspicious?"
        actions={
          <>
            <Link href={L("/report")} className="btn btn-primary">Report a concern</Link>
            <Link href={L("/safeguarding")} className="btn btn-outline">Safeguarding policy</Link>
          </>
        }
      />
    </>
  );
}
