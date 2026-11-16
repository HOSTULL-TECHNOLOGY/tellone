import "@/styles/participate.css";
import "@/styles/careers.css";
import Link from "next/link";
import { Check, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import { href, type Locale } from "@/lib/i18n";
import { localeParams, pageMeta, site } from "@/lib/meta";
import { localeOf } from "@/components/participate/pageKit";
import { Breadcrumbs } from "@/components/ui/Page";
import { JsonLd } from "@/lib/seo";
import { WardFinder } from "@/components/careers/WardFinder";
import { ExitIntent, WardCounter } from "@/components/careers/Recruitment";
import { StickyApply } from "@/components/careers/StickyApply";
import { CareersContact, CPhoto, WardLeaderInfo } from "@/components/careers/WardLeaderInfo";
import { careersText } from "@/i18n/careers";
import { duties, hero, pleaseNote, seo, stickyStrip, WAVE } from "@/data/careers";

export const generateStaticParams = localeParams;
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const m = pageMeta(lang as Locale, "/careers/ward-leaders", seo.title, seo.description);
  return {
    ...m,
    title: { absolute: seo.title },
    openGraph: { ...m.openGraph, title: seo.ogTitle, description: seo.ogText },
    twitter: { ...m.twitter, title: seo.ogTitle, description: seo.ogText },
    keywords: [seo.primaryQuery, "become a ward leader Nigeria", "paid community organiser jobs Nigeria 2026", "Obi campaign ward leader", "NDC ward coordinator", "how I fit lead my ward for TBH One"],
  };
}


/**
 * /careers/ward-leaders — the publish-ready "Career Page content", in page order (sections 1–17). Counters and
 * quotes are SAMPLE values, replaced by live data and real, consented quotes at launch.
 */
export default async function WardLeadersCareersPage({ params }: { params: Promise<{ lang: string }> }) {
  const locale = await localeOf(params);
  const L = (p: string) => href(locale, p);
  const t = careersText(locale);
  const apply = L("/careers/ward-leaders/apply");
  const memberApply = L(`/login?next=${encodeURIComponent("/careers/ward-leaders/apply")}`);
  const open = WAVE.wards - WAVE.filledSample;

  const jobLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: "TBH One Ward Leader (organising role with per-task fees)",
    description: `<p>${hero.intro}</p><ul>${duties.map(([a, b]) => `<li>${a} ${b}</li>`).join("")}</ul><p>${pleaseNote}</p>`,
    datePosted: WAVE.opens,
    validThrough: `${WAVE.closes}T23:59:00+01:00`,
    employmentType: ["VOLUNTEER", "PART_TIME"],
    hiringOrganization: { "@type": "Organization", name: site.name, sameAs: Object.values(site.social).filter((u) => u && !u.includes("wa.me")), logo: `${site.url}/brand/tbh-one-logo.png` },
    jobLocationType: "TELECOMMUTE",
    applicantLocationRequirements: { "@type": "Country", name: "Nigeria" },
    jobLocation: { "@type": "Place", address: { "@type": "PostalAddress", addressCountry: "NG" } },
    totalJobOpenings: WAVE.wards,
    baseSalary: { "@type": "MonetaryAmount", currency: "NGN", value: { "@type": "QuantitativeValue", value: 5000, unitText: "Per village meeting (task-based fee, not a salary)" } },
    directApply: true,
    url: href(locale, "/careers/ward-leaders"),
  };


  return (
    <>
      <JsonLd data={jobLd} />

      {/* 1. Hero */}
      <section className="cw-hero" aria-labelledby="cw-h1">
        <div className="container">
          <Breadcrumbs locale={locale} items={[{ label: "Opportunities" }, { label: "Careers", path: "/careers" }, { label: "Ward Leaders" }]} />
          <div className="cw-hero-grid">
            <div className="cw-hero-copy">
              <p className="cw-eyebrow">{t.eyebrow}</p>
              <h1 id="cw-h1">{t.h1}</h1>
              <p className="cw-sub">{t.sub}</p>
              <p className="cw-intro">{t.intro}</p>
              <ul className="cw-reasons band-green" role="list" aria-label="Four reasons at a glance">
                {hero.reasons.map(([a, b]) => (
                  <li key={a}>
                    <Check size={18} aria-hidden />
                    <span>
                      <strong>{a}:</strong> {b}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="cw-ctas">
                <Link href={apply} className="btn btn-lg btn-primary">
                  {t.primary}
                </Link>
                <Link href={memberApply} className="btn btn-lg btn-outline">
                  {t.secondary}
                </Link>
              </div>
              <div className="cw-counter-box band-green">
                <WardCounter />
              </div>
              <CPhoto name="22-careers-team-village-walk" className="cw-hero-photo" sizes="(min-width: 1050px) 620px, 100vw" eager />
              <p className="cw-trust">
                <ShieldCheck size={18} aria-hidden /> {t.trust}
              </p>
              <CareersContact />
            </div>
            <div className="cw-hero-finder" id="find-your-ward">
              <h2 className="cw-finder-title">{t.finder}</h2>
              <WardFinder applyHref={apply} streetHref={L("/street-leaders")} shareUrl={`${site.domain}/careers`} compact />
            </div>
          </div>
        </div>
      </section>

      <WardLeaderInfo locale={locale} apply={apply} checkHref="#find-your-ward" finalH2={t.finalH2} />

      <StickyApply href={apply} label={t.primary} text={stickyStrip(open)} />
      <ExitIntent checkHref="#find-your-ward" />
    </>
  );
}
