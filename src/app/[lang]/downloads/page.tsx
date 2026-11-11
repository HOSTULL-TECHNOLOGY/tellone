import Link from "next/link";
import { notFound } from "next/navigation";
import { Download } from "lucide-react";
import "@/styles/content.css";
import { href, isLocale, type Locale } from "@/lib/i18n";
import { localeParams, pageMeta } from "@/lib/meta";
import { Notice, PageHeader, Section } from "@/components/ui/Page";
import { PosterGallery } from "@/components/content/FactSheetTable";
import { songs, songLabel, SONG_AI_NOTE } from "@/data/songs";

export const generateStaticParams = localeParams;
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return pageMeta(lang as Locale, "/downloads", "Downloads: TBH One logo, posters, songs and brand kit", "Download the official TBH One logo, campaign posters in four languages, campaign songs, colours and fonts for flyers, banners and posts.");
}

// Logo palette, from the brand artwork. These are the printed brand colours, documented as content.
const SWATCHES = [
  { name: "TBH Green", hex: "#157103" },
  { name: "Deep Green", hex: "#0F4D02" },
  { name: "Signal Red", hex: "#FD0102" },
  { name: "Paper", hex: "#F4F3EE" },
  { name: "Ink", hex: "#1B1A16" },
];


export default async function DownloadsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const L = (p: string) => href(lang, p);
  return (
    <>
      <PageHeader
        locale={lang}
        crumbs={[{ label: "Resources" }, { label: "Downloads" }]}
        title="Downloads and brand kit"
        answer="Download the official TBH One logo, campaign posters in English, Hausa, Yorùbá and Igbo, the campaign songs and the colours and fonts used across the movement. Use them for flyers, banners, WhatsApp statuses and community events. Do not alter the logo or the tagline, and never add a payment number to any material."
        updated="2026-10-23"
      />
      <Section id="rules">
        <Notice tone="warn" title="Use the brand honestly">
          Do not change the logo, the tagline or the candidates&apos; names. Never add a phone number or bank account for payments; official channels are listed on the <Link href={L("/verify")}>Verify page</Link>.
        </Notice>
      </Section>
      <Section id="logo" title="Logo" alt>
        <div className="dl-grid">
          <div className="dl-card">
            <img src="/brand/tbh-one-logo.webp" alt="TBH One logo" width={360} height={233} loading="lazy" />
            <strong>TBH One logo, full colour</strong>
            <span className="dl-meta">PNG · 303 KB · transparent background</span>
            <a className="btn btn-sm btn-outline" href="/brand/tbh-one-logo.png" download="tbh-one-logo.png">
              <Download size={16} aria-hidden /> Download PNG
            </a>
          </div>
          <div className="dl-card">
            <img src="/brand/tbh-one-logo-portraits.webp" alt="TBH One logo with candidate artwork" width={360} height={270} loading="lazy" />
            <strong>Logo with candidate artwork</strong>
            <span className="dl-meta">PNG · for posters and banners</span>
            <a className="btn btn-sm btn-outline" href="/brand/tbh-one-logo-portraits.png" download="tbh-one-logo-portraits.png">
              <Download size={16} aria-hidden /> Download PNG
            </a>
          </div>
          <div className="dl-card">
            <img src="/brand/icon-512.png" alt="TBH One app icon" width={512} height={512} loading="lazy" />
            <strong>Square icon</strong>
            <span className="dl-meta">PNG · 512 × 512 · profile pictures</span>
            <a className="btn btn-sm btn-outline" href="/brand/icon-512.png" download="tbh-one-icon-512.png">
              <Download size={16} aria-hidden /> Download PNG
            </a>
          </div>
        </div>
      </Section>
      <Section id="posters" title="Posters">
        <PosterGallery download />
      </Section>
      <Section id="songs" title="Campaign songs" alt>
        <ul className="q-list" role="list">
          {songs.map((s) => (
            <li key={s.slug}>
              <a href={s.src} download={`${s.slug}.mp3`}>
                <span>{songLabel(s)}</span>
                <span className="small muted" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <Download size={16} aria-hidden /> MP3
                </span>
              </a>
            </li>
          ))}
        </ul>
        <p className="small muted">{SONG_AI_NOTE}. Lower-data 48 kbps versions play on the Media Hub.</p>
      </Section>
      <Section id="colours" title="Colours and fonts">
        <div className="swatches">
          {SWATCHES.map((s) => (
            <div className="swatch" key={s.hex}>
              <i style={{ background: s.hex }} />
              <div>
                <strong>{s.name}</strong>
                <br />
                <code>{s.hex}</code>
              </div>
            </div>
          ))}
        </div>
        <p style={{ marginTop: 16 }}>
          Headlines use <strong>Noto Serif Display</strong> and body text uses <strong>Noto Sans</strong>; both are free under the SIL Open Font License and support Yorùbá, Hausa and Igbo characters. Get them from{" "}
          <a href="https://fonts.google.com/noto" target="_blank" rel="noopener noreferrer">Google Fonts</a>.
        </p>
      </Section>
    </>
  );
}
