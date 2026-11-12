import "@/styles/participate.css";
import "@/styles/careers.css";
import Link from "next/link";
import { BadgeCheck, CalendarDays, ClipboardCheck, HandCoins, Megaphone, ShieldAlert, ShieldCheck, Store, Users } from "lucide-react";
import type { Metadata } from "next";
import { href, type Locale } from "@/lib/i18n";
import { localeParams, pageMeta, site } from "@/lib/meta";
import { localeOf } from "@/components/participate/pageKit";
import { Breadcrumbs, Faq } from "@/components/ui/Page";
import { JsonLd } from "@/lib/seo";
import { WardFinder } from "@/components/careers/WardFinder";
import { VisionMeter } from "@/components/careers/VisionMeter";
import { RegionChart, WardCounter } from "@/components/careers/Recruitment";
import { StickyApply } from "@/components/careers/StickyApply";
import { careersText } from "@/i18n/careers";
import { duties, dutiesNote, earnings, exampleMonth, faq, finalCta, finder, goodToKnow, helpful, howPaid, pleaseNote, regionsNote, requirements, rules, safety, seo, steps, support, vision, waLink, WAVE, whyRegister } from "@/data/careers";

export const generateStaticParams = localeParams;
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const m = pageMeta(lang as Locale, "/careers/ward-leaders", seo.title, seo.description);
  return { ...m, title: { absolute: seo.title }, openGraph: { ...m.openGraph, title: seo.ogTitle, description: seo.ogText }, twitter: { ...m.twitter, title: seo.ogTitle, description: seo.ogText }, keywords: [seo.primaryQuery, "become a ward leader Nigeria", "paid community organiser jobs Nigeria 2026", "Obi campaign ward leader", "NDC ward coordinator", "how I fit lead my ward for TBH One"] };
}

const dutyIcons = [Users, ClipboardCheck, CalendarDays, HandCoins, Megaphone, Store, ShieldAlert];

export default async function WardLeadersCareersPage({ params }: { params: Promise<{ lang: string }> }) {
  const locale = await localeOf(params);
  const L = (p: string) => href(locale, p);
  const t = careersText(locale);
  const apply = L("/careers/ward-leaders/apply");
  const memberApply = L(`/login?next=${encodeURIComponent("/careers/ward-leaders/apply")}`);
  const open = WAVE.wards - WAVE.filledSample;
  const pageUrl = `${site.domain}/careers`;

  const jobLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: "TBH One Ward Leader (volunteer organising role with per-task fees)",
    description: `<p>${t.intro}</p><ul>${duties.map(([a, b]) => `<li>${a} ${b}</li>`).join("")}</ul><p>${pleaseNote}</p>`,
    datePosted: WAVE.opens,
    validThrough: `${WAVE.closes}T23:59:00+01:00`,
    employmentType: ["VOLUNTEER", "PART_TIME"],
    hiringOrganization: { "@type": "Organization", name: site.name, sameAs: Object.values(site.social).filter(Boolean), logo: `${site.url}/brand/tbh-one-logo.png` },
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

      {/* 1 — Hero with ward finder, counter and two buttons */}
      <section className="cw-hero band-green pattern" aria-labelledby="cw-h1">
        <div className="container">
          <Breadcrumbs locale={locale} items={[{ label: "Opportunities" }, { label: "Careers", path: "/careers" }, { label: "Ward Leaders" }]} />
          <div className="cw-hero-grid">
            <div className="cw-hero-copy">
              <p className="cw-eyebrow">{t.eyebrow}</p>
              <h1 id="cw-h1">{t.h1}</h1>
              <p className="cw-intro">{t.intro}</p>
              <div className="cw-ctas">
                <Link href={apply} className="btn btn-lg cw-btn-primary">
                  {t.primary}
                </Link>
                <Link href={memberApply} className="btn btn-lg btn-outline">
                  {t.secondary}
                </Link>
              </div>
              <WardCounter />
              <p className="cw-trust">
                <ShieldCheck size={18} aria-hidden /> {t.trust}
              </p>
              <p className="cw-boost">
                <strong>{t.boostTitle}</strong> {t.boost} <a href="#vision">How Vision Points work</a>
              </p>
            </div>
            <div className="cw-hero-finder" id="find-your-ward">
              <h2 className="cw-finder-title">{t.finder}</h2>
              <WardFinder applyHref={apply} streetHref={L("/street-leaders")} shareUrl={pageUrl} compact />
            </div>
          </div>
        </div>
      </section>

      {/* Find your ward: help for people who don't know it */}
      <section className="section" aria-labelledby="fyw-h">
        <div className="container">
          <div className="section-head">
            <div>
              <h2 id="fyw-h">{finder.title}</h2>
              <p>{finder.intro}</p>
            </div>
          </div>
          <h3 className="cw-h3">Four ways to find your ward</h3>
          <ol className="cw-ways" role="list">
            {finder.ways.map((w) => (
              <li key={w.key}>
                <p className="cw-way-name">{w.way}</p>
                <p className="small muted">
                  <strong>Best for:</strong> {w.bestFor}
                </p>
                <p>{w.how}</p>
                <a href={w.key === "ask" ? waLink("WARD ") : "#find-your-ward"} className="cw-way-btn" {...(w.key === "ask" ? { target: "_blank", rel: "noopener" } : {})}>
                  {w.button}
                </a>
              </li>
            ))}
          </ol>
          <div className="cw-two">
            <details className="cw-details" open>
              <summary>
                <h3>{finder.helperTitle}</h3>
              </summary>
              <div className="table-wrap">
                <table className="rate-table">
                  <thead>
                    <tr>
                      <th scope="col">What the person sends</th>
                      <th scope="col">Reply</th>
                    </tr>
                  </thead>
                  <tbody>
                    {finder.helperRows.map(([a, b]) => (
                      <tr key={a}>
                        <td>{a}</td>
                        <td>{b}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="small muted">{finder.helperNote}</p>
            </details>
            <details className="cw-details" open>
              <summary>
                <h3>Where the ward data comes from</h3>
              </summary>
              <ul className="cw-list">
                {finder.dataSources.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
              <h4>Safeguards</h4>
              <ul className="cw-list">
                {finder.safeguards.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
              <p className="small muted">
                Ward list in this prototype: all 8,809 wards from the open Nigeria GeoJSON dataset (MIT licence), which follows INEC&apos;s ward list.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* 2 — How it works in five steps */}
      <section className="section section-alt" aria-labelledby="steps-h">
        <div className="container">
          <div className="section-head">
            <div>
              <h2 id="steps-h">How it works in five steps</h2>
            </div>
          </div>
          <ol className="cw-steps" role="list">
            {steps.map((s, i) => (
              <li key={s.step} className={i === steps.length - 1 ? "cw-step cw-step-boost" : "cw-step"}>
                <span className="cw-step-n" aria-hidden>
                  {i < 5 ? i + 1 : "+"}
                </span>
                <p className="cw-step-name">{s.step.replace(/^\d\. /, "")}</p>
                <p>{s.what}</p>
                <p className="cw-step-time">{s.time}</p>
              </li>
            ))}
          </ol>
          <p className="cw-why">
            <strong>Why register first?</strong> {whyRegister}
          </p>
        </div>
      </section>

      {/* Vision Points */}
      <section className="section" id="vision" aria-labelledby="vision-h">
        <div className="container">
          <div className="section-head">
            <div>
              <h2 id="vision-h">{vision.title}</h2>
              <p>{vision.intro}</p>
            </div>
          </div>
          <div className="cw-vision">
            <div className="cw-vision-left">
              <h3 className="cw-h3">How it works</h3>
              <ol className="cw-howlist" role="list">
                {vision.how.map(([a, b]) => (
                  <li key={a}>
                    <strong>{a.replace(/^\d\. /, "")}</strong> <span>{b}</span>
                  </li>
                ))}
              </ol>
              <h3 className="cw-h3">Levels</h3>
              <ul className="cw-levels" role="list">
                {vision.levels.map((l) => (
                  <li key={l.name}>
                    <span className="cw-level-range">{l.min === l.max ? l.min : `${l.min}–${l.max}`}</span>
                    <strong>{l.name}</strong>
                    <span className="small muted">{l.message}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="cw-vision-right" id="boost">
              <VisionMeter registerHref={apply} eventsHref={L("/events")} />
            </div>
          </div>

          <h3 className="cw-h3">Points for following our official accounts (up to 100)</h3>
          <div className="table-wrap">
            <table className="rate-table">
              <thead>
                <tr>
                  <th scope="col">Platform</th>
                  <th scope="col">Official account</th>
                  <th scope="col">Why follow</th>
                  <th scope="col" className="num">
                    Points
                  </th>
                </tr>
              </thead>
              <tbody>
                {vision.platforms.map((p) => (
                  <tr key={p.key}>
                    <td>{p.name}</td>
                    <td>
                      <a href={site.social[p.key] ?? "#"} target="_blank" rel="noopener">
                        {p.account}
                      </a>
                    </td>
                    <td>{p.why}</td>
                    <td className="num">{p.points}</td>
                  </tr>
                ))}
                <tr>
                  <th scope="row">{vision.bonus.label}</th>
                  <td />
                  <td>{vision.bonus.why}</td>
                  <th className="num">+{vision.bonus.points}</th>
                </tr>
                <tr>
                  <th scope="row">Total</th>
                  <td />
                  <td />
                  <th className="num">100</th>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="small muted">{vision.handlesNote}</p>

          <h3 className="cw-h3">Other ways to earn Vision Points (for everyone, up to 80)</h3>
          <div className="table-wrap">
            <table className="rate-table">
              <thead>
                <tr>
                  <th scope="col">Action</th>
                  <th scope="col" className="num">
                    Points
                  </th>
                  <th scope="col">Limit</th>
                  <th scope="col">How it is checked</th>
                </tr>
              </thead>
              <tbody>
                {vision.other.map((o) => (
                  <tr key={o.key}>
                    <td>{o.action}</td>
                    <td className="num">{o.points}</td>
                    <td>{o.limit}</td>
                    <td>{o.check}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            <strong>No social media?</strong> {vision.noSocial.replace(/^No social media\? /, "")}
          </p>
          <p>{vision.cap.replace(/^The cap: /, "")}</p>

          <div className="cw-two">
            <div>
              <h3 className="cw-h3">How we choose</h3>
              <p>{vision.chooseIntro}</p>
              <div className="table-wrap">
                <table className="rate-table">
                  <thead>
                    <tr>
                      <th scope="col">Part of the score</th>
                      <th scope="col" className="num">
                        Points
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {vision.score.map(([a, b]) => (
                      <tr key={a}>
                        <td>{a}</td>
                        <td className="num">{b}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <ul className="cw-list">
                {vision.chooseRules.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="cw-h3">Keeping it honest</h3>
              <ul className="cw-list">
                {vision.honest.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
              <h3 className="cw-h3">Privacy and consent</h3>
              <ul className="cw-list">
                {vision.privacy.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 3 — What you will do */}
      <section className="section band-green" aria-labelledby="do-h">
        <div className="container">
          <div className="section-head">
            <div>
              <h2 id="do-h">What you will do</h2>
            </div>
          </div>
          <ul className="cw-duties" role="list">
            {duties.map(([a, b], i) => {
              const Icon = dutyIcons[i];
              return (
                <li key={a}>
                  <Icon size={26} aria-hidden />
                  <p>
                    <strong>{a}</strong> {b}
                  </p>
                </li>
              );
            })}
          </ul>
          <p className="cw-note-band">{dutiesNote}</p>
        </div>
      </section>

      {/* 4 — What you will earn */}
      <section className="section" aria-labelledby="earn-h">
        <div className="container">
          <div className="section-head">
            <div>
              <h2 id="earn-h">What you will earn</h2>
            </div>
          </div>
          <div className="cw-earn">
            <ul className="cw-fees" role="list">
              {earnings.map(([work, fee, proof]) => (
                <li key={work}>
                  <span className="cw-fee-work">{work}</span>
                  <span className="cw-fee">{fee}</span>
                  <span className="cw-fee-proof small muted">Proof: {proof}</span>
                </li>
              ))}
            </ul>
            <aside className="cw-month" aria-label="Example month">
              <p className="cw-month-k">Example month</p>
              <ul role="list">
                {exampleMonth.parts.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
              <p className="cw-month-total">= {exampleMonth.total}</p>
              <p className="small">{exampleMonth.tail}</p>
            </aside>
          </div>
          <p>
            <strong>How you get paid:</strong> {howPaid}
          </p>
          <p className="cw-please">
            <strong>Please note:</strong> {pleaseNote}
          </p>
        </div>
      </section>

      {/* 5 — Who we are looking for */}
      <section className="section section-alt" aria-labelledby="who-h">
        <div className="container">
          <div className="section-head">
            <div>
              <h2 id="who-h">Who we are looking for</h2>
            </div>
          </div>
          <ul className="cw-checks" role="list">
            {requirements.map(([need, why]) => (
              <li key={need}>
                <BadgeCheck size={22} aria-hidden />
                <span>
                  <strong>{need}</strong>
                  <span className="small muted">{why}</span>
                </span>
              </li>
            ))}
          </ul>
          <p>
            <strong>Helpful but not required:</strong> {helpful}
          </p>
          <p>
            <strong>Good to know:</strong> {goodToKnow}
          </p>
          <p>
            <Link href={L("/code-of-conduct")}>Read the Code of Conduct</Link>
          </p>
        </div>
      </section>

      {/* 6 — Places by region */}
      <section className="section" aria-labelledby="reg-h">
        <div className="container">
          <div className="section-head">
            <div>
              <h2 id="reg-h">Places by region (wave 1: one per ward)</h2>
            </div>
          </div>
          <RegionChart />
          <p className="small muted">{regionsNote}</p>
        </div>
      </section>

      {/* 7 — Safety and trust */}
      <section className="section band-red" aria-labelledby="safe-h">
        <div className="container cw-safety">
          <div>
            <h2 id="safe-h">Safety and trust</h2>
            <ul className="cw-list">
              {safety.map((s) =>
                s.startsWith("TBH One will never ask") ? (
                  <li key={s}>
                    <strong>{s.split(". ")[0]}.</strong> {s.split(". ").slice(1).join(". ")}
                  </li>
                ) : s.startsWith("Read the Street Activation Guide") ? (
                  <li key={s}>
                    Read the <Link href={L("/street-activation-guide")}>Street Activation Guide</Link> before you start recruiting.
                  </li>
                ) : (
                  <li key={s}>{s}</li>
                ),
              )}
            </ul>
            <details className="cw-details cw-details-band">
              <summary>
                <h3>Rules we follow</h3>
              </summary>
              <ul className="cw-list">
                {rules.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </details>
          </div>
          <div className="cw-verify">
            <ShieldCheck size={36} aria-hidden />
            <p>Check any leader&apos;s ID code before you meet them.</p>
            <Link href={L("/verify")} className="btn btn-lg">
              Verify a leader ID
            </Link>
            <Link href={L("/report")} className="btn btn-outline">
              Report a Concern
            </Link>
          </div>
        </div>
      </section>

      {/* 8 — Your support and benefits */}
      <section className="section" aria-labelledby="sup-h">
        <div className="container">
          <div className="section-head">
            <div>
              <h2 id="sup-h">Your support and benefits</h2>
            </div>
          </div>
          <ul className="cw-support" role="list">
            {support.map((s) => (
              <li key={s}>{s.includes("0800") ? <a href={`tel:${site.contact.tollFreeTel}`}>{s}</a> : s}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* 9 — FAQ */}
      <section className="section section-alt" aria-labelledby="faq">
        <div className="container container-narrow">
          <Faq items={faq} title="FAQ" />
        </div>
      </section>

      {/* 10 — Final call to action */}
      <section className="section band-green pattern cw-final" aria-labelledby="final-h">
        <div className="container">
          <h2 id="final-h">{t.finalH2}</h2>
          <p>{finalCta.copy(open)}</p>
          <div className="cw-ctas">
            <Link href={apply} className="btn btn-lg cw-btn-primary">
              {t.primary}
            </Link>
            <a href={waLink()} className="btn btn-lg btn-outline" target="_blank" rel="noopener">
              {finalCta.secondary}
            </a>
          </div>
        </div>
      </section>

      <StickyApply href={apply} label={t.primary} />
    </>
  );
}
