import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import "@/styles/chrome.css";
import "@/styles/ui.css";
import { getDict } from "@/i18n";
import { href, isLocale, localeMeta, locales, type Locale } from "@/lib/i18n";
import { themeBootScript } from "@/lib/prefs";
import { phaseAt } from "@/lib/campaign";
import { site } from "@/config/site";
import { TopBar } from "@/components/chrome/TopBar";
import { Ticker } from "@/components/chrome/Ticker";
import { SiteHeader } from "@/components/chrome/SiteHeader";
import { StickyPlayer } from "@/components/chrome/StickyPlayer";
import { Logo } from "@/components/chrome/Logo";
import { Footer } from "@/components/chrome/Footer";
import { QuickActions } from "@/components/chrome/QuickActions";
import { SupportLauncher } from "@/components/chrome/SupportLauncher";
import { CookieBanner } from "@/components/chrome/CookieBanner";
import { DraftNotice } from "@/components/chrome/DraftNotice";
import { Toaster } from "@/components/ui/Toast";
import { FileModeShim } from "@/components/FileModeShim";
import { Motion } from "@/components/Motion";
import { RegisterPrompt } from "@/components/chrome/RegisterPrompt";
import { ServiceWorker } from "@/components/ServiceWorker";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f2f3ed",
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = getDict(lang);
  return {
    metadataBase: new URL(site.url),
    title: { default: t.meta.homeTitle, template: "%s | TBH One" },
    description: t.meta.homeDescription,
    applicationName: "TBH One",
    icons: { icon: "/brand/icon-192.png", apple: "/brand/icon-192.png" },
    manifest: "/manifest.webmanifest",
    openGraph: { siteName: "TBH One", type: "website", locale: localeMeta[lang].hreflang },
    twitter: { card: "summary_large_image" },
    // Draft translations stay out of the index until translators approve them (Plan C9).
    robots: lang === "en" ? undefined : { index: false, follow: true },
  };
}

export default async function LangLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale = lang as Locale;
  const t = getDict(locale);
  const L = (p: string) => href(locale, p);

  return (
    <html lang={localeMeta[locale].htmlLang} suppressHydrationWarning>
      <head>
        <FileModeShim />
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
        {process.env.NEXT_PUBLIC_STATIC_FILE !== "1" && (
          <>
            {/* Offline export embeds the fonts in the CSS instead (file:// cannot fetch font files). */}
            <link rel="preload" href="/fonts/noto-sans-latin-wght-normal.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
            <link rel="preload" href="/fonts/noto-serif-display-latin-wght-normal.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
          </>
        )}
      </head>
      <body>
        <a href="#main" className="skip-link">
          {t.common.skipToContent}
        </a>
        <div className="split-rule" aria-hidden />
        <TopBar locale={locale} t={t} />
        <Ticker t={t} electionHref={L("/election")} initialPhase={phaseAt()} />
        <SiteHeader locale={locale} t={t} logo={<Logo locale={locale} />} player={<StickyPlayer t={t.player} locale={locale} allHref={L("/media/theme-song")} />} />
        <DraftNotice locale={locale} t={t} englishHref="/" />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <Footer locale={locale} t={t} />
        <QuickActions locale={locale} t={t} />
        <SupportLauncher t={t.support} locale={locale} contactHref={L("/contact")} verifyHref={L("/verify")} />
        <CookieBanner t={t.cookies} policyHref={L("/cookies")} />
        <Toaster />
        <Motion />
        <RegisterPrompt joinHref={L("/join")} />
        <ServiceWorker />
      </body>
    </html>
  );
}
