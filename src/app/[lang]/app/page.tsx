import Link from "next/link";
import { AppScreens, appScreensCaption } from "@/components/AppScreens";
import { notFound } from "next/navigation";
import { CloudOff, ShoppingBag, Trophy, Languages, Bell, ShieldCheck } from "lucide-react";
import "@/styles/content.css";
import { href, isLocale, type Locale } from "@/lib/i18n";
import { localeParams, pageMeta } from "@/lib/meta";
import { getDict } from "@/i18n";
import { CardGrid, Faq, FactList, PageHeader, Section } from "@/components/ui/Page";
import { StoreBadges } from "@/components/ui/StoreBadges";

export const generateStaticParams = localeParams;
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return pageMeta(lang as Locale, "/app", "The TBH One app for Android and iPhone", "The TBH One app puts your dashboard, the Shop and the Media Hub in your pocket. Built for low-end Android phones and patchy data. Launches 10 November 2026.");
}

const FEATURES = [
  { icon: CloudOff, t: "Works offline", d: "Log Tell One, Bring One and Help One tasks without signal; they sync when you are back online." },
  { icon: Trophy, t: "Impact Points", d: "Track your points, rank and rewards, and see the projects you have funded." },
  { icon: ShoppingBag, t: "Shop and coupons", d: "Buy official merch and redeem member coupons with delivery tracking." },
  { icon: Languages, t: "Five languages", d: "English, Nigerian Pidgin, Yorùbá, Hausa and Igbo, switchable at any time." },
  { icon: Bell, t: "Timely alerts", d: "Event reminders, project updates and the official manifesto the day it is published." },
  { icon: ShieldCheck, t: "Verified channels", d: "Check a leader ID or an official account from inside the app before you pay or share." },
];

export default async function AppPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDict(lang);
  const L = (p: string) => href(lang, p);
  return (
    <>
      <PageHeader
        locale={lang}
        crumbs={[{ label: "Resources" }, { label: "Get the App" }]}
        title="Get the TBH One app"
        answer="The TBH One app puts your member dashboard, the Shop and the Media Hub on your phone. It is built for low-end Android phones and patchy data: tasks log offline and sync later, pages stay light, and it runs in five languages. The Android and iPhone apps launch on 10 November 2026; store links appear here on launch day."
        updated="2026-10-23"
      />
      <Section id="get">
        <StoreBadges t={t.app} appHref={L("/app")} />
        <div style={{ height: 24 }} />
        <FactList
          items={[
            { label: "Launch", value: "10 November 2026" },
            { label: "Platforms", value: "Android 8.0 and later; iPhone (iOS 15 and later)" },
            { label: "Price", value: "Free" },
            { label: "Languages", value: "English, Pidgin, Yorùbá, Hausa, Igbo" },
          ]}
        />
      </Section>
      <Section id="preview" title="A first look at the app" intro="Home, project funding and the Shop, designed for small screens, five languages and patchy data.">
        <figure style={{ margin: 0 }}>
          <AppScreens screens={["home", "projects", "shop"]} />
          <figcaption className="app-caption">{appScreensCaption}</figcaption>
        </figure>
      </Section>
      <Section id="features" title="What the app does" alt>
        <CardGrid>
          {FEATURES.map(({ icon: Icon, t: title, d }) => (
            <article key={title} className="pkg">
              <Icon size={24} aria-hidden />
              <h3>{title}</h3>
              <p className="muted" style={{ margin: 0 }}>{d}</p>
            </article>
          ))}
        </CardGrid>
      </Section>
      <Section narrow>
        <Faq
          items={[
            { q: "Is there an app download link yet?", a: "Not yet. The apps launch on 10 November 2026. Until then, any link claiming to be the TBH One app is not official — check the Verify page." },
            { q: "Can I use TBH One without the app?", a: "Yes. Everything in the app also works on this website, including the dashboard, the Shop and the Media Hub." },
            { q: "How much data does it use?", a: "The app is designed for low data use, with a data-saver mode that holds back images and video until you ask for them." },
          ]}
        />
      </Section>
      <Section narrow>
        <p>
          Spotted a TBH One app before launch day? <Link href={L("/verify")}>Check it on the Verify page</Link>.
        </p>
      </Section>
    </>
  );
}
