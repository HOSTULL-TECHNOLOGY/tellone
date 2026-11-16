import Link from "next/link";
import { CalendarDays, Check, ClipboardCheck, HandCoins, Mail, Megaphone, MessageCircle, Phone, ShieldAlert, Users, X } from "lucide-react";
import { href, type Locale } from "@/lib/i18n";
import { site } from "@/config/site";
import { Faq } from "@/components/ui/Page";
import { ExampleMonths, RegionChart, ShareRow } from "@/components/careers/Recruitment";
import { careersPhotos, peoplePhotos } from "@/data/photos";
import {
  benefits,
  boost,
  contactLine,
  dutiesNote,
  dutiesTitle,
  duties,
  earnings,
  earnTitle,
  faq,
  finalCta,
  findWard,
  first30,
  howPaidSteps,
  hubNote,
  hubRoles,
  keyDates,
  lookingFor,
  months,
  pleaseNote,
  quotes,
  regionsPage,
  rules,
  safety,
  safetyTitle,
  steps,
  stepsTitle,
  supportPage,
  vision,
  waLink,
  WAVE,
  week,
  why,
  whyRegister,
} from "@/data/careers";

const dutyIcons = [Users, ClipboardCheck, CalendarDays, HandCoins, Megaphone, ShieldAlert];

/**
 * Photos across the careers sections: the client's careers photos (careersPhotos in src/data/photos.ts); swap a
 * name here to use a different photo. Photos never sit next to a quote, so no one is shown as saying something.
 * Not used here: NYSC corps members and election officials (both must stay out of partisan politics) and children.
 */
const PH = {
  why: "23-careers-village-meeting",
  benefits: ["20-careers-poster-provision-shop", "23-careers-village-meeting", "22-careers-team-village-walk", "21-careers-poster-hair-salon", "24-careers-poster-roadside-salon", "22-careers-team-village-walk"],
  duties: "23-careers-village-meeting",
  paid: "20-careers-poster-provision-shop",
  week: "21-careers-poster-hair-salon",
  member: "24-careers-poster-roadside-salon",
  register: "22-careers-team-village-walk",
  ward: "24-careers-poster-roadside-salon",
  who: ["20-careers-poster-provision-shop", "21-careers-poster-hair-salon", "24-careers-poster-roadside-salon", "23-careers-village-meeting"],
  final: "22-careers-team-village-walk",
};

/** A responsive photo from public/photos (480/960 WebP with a JPEG fallback). */
export function CPhoto({ name, className = "", sizes = "(min-width: 900px) 560px, 100vw", eager }: { name: string; className?: string; sizes?: string; eager?: boolean }) {
  const p = [...careersPhotos, ...peoplePhotos].find((x) => x.base.endsWith(name));
  if (!p) return null;
  return (
    <picture className={`cw-photo ${className}`}>
      <source type="image/webp" srcSet={`${p.base}-480.webp 480w, ${p.base}-960.webp 960w`} sizes={sizes} />
      <img src={`${p.base}.jpg`} alt={p.alt} loading={eager ? "eager" : "lazy"} decoding="async" />
    </picture>
  );
}

/** Toll-free line, WhatsApp and email: shown on every careers screen. */
export function CareersContact() {
  const tel = `tel:${site.contact.tollFreeTel}`;
  return (
    <ul className="cw-contact" role="list" aria-label="Contact">
      <li>
        <Phone size={16} aria-hidden /> <a href={tel}>{contactLine.tollFree}</a>
      </li>
      <li>
        <MessageCircle size={16} aria-hidden /> <a href={waLink()} target="_blank" rel="noopener">{contactLine.whatsapp}</a>
      </li>
      {contactLine.email && (
        <li>
          <Mail size={16} aria-hidden /> <a href={`mailto:${contactLine.email}`}>{contactLine.email}</a>
        </li>
      )}
    </ul>
  );
}

/**
 * Everything an applicant needs to know about the ward leader role (sections 2–17 of the Career Page content, plus
 * the other roles). Used on the landing page and, below the application, on the apply page.
 */
export function WardLeaderInfo({ locale, apply, checkHref, finalH2 }: { locale: Locale; apply: string; checkHref: string; finalH2: string }) {
  const L = (p: string) => href(locale, p);
  const open = WAVE.wards - WAVE.filledSample;
  const pageUrl = `https://${site.domain}/careers/ward-leaders`;
  const tel = `tel:${site.contact.tollFreeTel}`;
  const followTotal = vision.platforms.reduce((n, p) => n + p.points, 0) + vision.bonus.points;
  return (
    <>
      {/* 2. Why this matters */}
      <section className="section" aria-labelledby="why-h">
        <div className="container">
          <div className="cw-why-grid">
            <div>
              <h2 id="why-h">{why.h2}</h2>
              {why.paras.map((p) => (
                <p key={p.slice(0, 20)} className="cw-para">
                  {p}
                </p>
              ))}
            </div>
            <figure className="cw-quote cw-quote-photo">
              <CPhoto name={PH.why} />
              <div className="cw-quote-over band-green">
                <blockquote>
                  <p>“{why.quote.text}”</p>
                </blockquote>
                <figcaption>— {why.quote.by}</figcaption>
              </div>
            </figure>
          </div>
          <ul className="cw-numbers" role="list">
            {why.numbers.map(([n, l]) => (
              <li key={l}>
                <strong>{n}</strong>
                <span>{l}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 3. What's in it for you */}
      <section className="section section-alt" aria-labelledby="ben-h">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="cw-kicker">What's in it for you</p>
              <h2 id="ben-h">{benefits.h2}</h2>
            </div>
          </div>
          <ul className="cw-benefits" role="list">
            {benefits.items.map(([icon, title, text], i) => (
              <li key={title}>
                <CPhoto name={PH.benefits[i]} className="cw-benefit-photo" sizes="(min-width: 900px) 380px, 100vw" />
                <span className="cw-benefit-icon" aria-hidden>
                  {icon}
                </span>
                <h3>{title}</h3>
                <p>{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 4. What you will do */}
      <section className="section band-green" aria-labelledby="do-h">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="cw-kicker">What you will do</p>
              <h2 id="do-h">{dutiesTitle}</h2>
            </div>
          </div>
          <div className="cw-duties-wrap">
          <CPhoto name={PH.duties} className="cw-duties-photo" />
          <ol className="cw-duties" role="list">
            {duties.map(([a, b], i) => {
              const Icon = dutyIcons[i];
              return (
                <li key={a}>
                  <Icon size={24} aria-hidden />
                  <span>
                    <strong>
                      {i + 1}. {a}
                    </strong>{" "}
                    {b}
                  </span>
                </li>
              );
            })}
          </ol>
          </div>
          <p className="cw-note-band">
            <strong>Good to know:</strong> {dutiesNote}
          </p>
        </div>
      </section>

      {/* 5. What you will earn */}
      <section className="section" id="earn" aria-labelledby="earn-h">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="cw-kicker">What you will earn</p>
              <h2 id="earn-h">{earnTitle}</h2>
            </div>
          </div>
          <ul className="cw-fees" role="list">
            {earnings.map(([work, fee, proof]) => (
              <li key={work}>
                <span className="cw-fee-work">{work}</span>
                <span className="cw-fee">{fee}</span>
                <span className="cw-fee-proof small muted">Proof: {proof}</span>
              </li>
            ))}
          </ul>
          <ExampleMonths title={months.title} tiers={months.tiers} rows={months.rows} />
          <div className="cw-two">
            <div>
              <h3 className="cw-h3">How you get paid</h3>
              <ol className="cw-numlist">
                {howPaidSteps.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ol>
            </div>
            <div className="cw-side-photo">
              <CPhoto name={PH.paid} />
              <p className="cw-please">
                <strong>Please note:</strong> {pleaseNote}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. A week in the life · 7. Your first 30 days */}
      <section className="section section-alt" aria-labelledby="week-h">
        <div className="container cw-two cw-two-top">
          <div>
            <p className="cw-kicker">A week in the life</p>
            <h2 id="week-h">{week.h2}</h2>
            <CPhoto name={PH.week} className="cw-photo-wide" />
            <ul className="cw-week" role="list">
              {week.rows.map(([d, w]) => (
                <li key={d}>
                  <strong>{d}</strong>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="cw-kicker">Your first 30 days</p>
            <h2>{first30.h2}</h2>
            <div className="table-wrap">
              <table className="rate-table">
                <thead>
                  <tr>
                    <th scope="col">When</th>
                    <th scope="col">What you do</th>
                    <th scope="col">What you get</th>
                  </tr>
                </thead>
                <tbody>
                  {first30.rows.map(([w, d, g]) => (
                    <tr key={w}>
                      <th scope="row">{w}</th>
                      <td>{d}</td>
                      <td>{g}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Your support and benefits */}
      <section className="section" aria-labelledby="sup-h">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="cw-kicker">Your support and benefits</p>
              <h2 id="sup-h">{supportPage.h2}</h2>
              <p>{supportPage.intro}</p>
            </div>
          </div>
          <ul className="cw-support" role="list">
            {supportPage.rows.map(([a, b]) => (
              <li key={a}>
                <strong>{a}</strong>
                <span>{b}</span>
              </li>
            ))}
          </ul>
          <div className="cw-three">
            <div className="cw-box band-green">
              <CPhoto name={PH.member} className="cw-box-photo" sizes="(min-width: 1000px) 380px, 100vw" />
              <h3 className="cw-h3">{supportPage.memberTitle}</h3>
              <ul className="cw-ticks" role="list">
                {supportPage.member.map((m) => (
                  <li key={m}>
                    <Check size={16} aria-hidden /> {m}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="cw-h3">{supportPage.rewardsTitle}</h3>
              <div className="table-wrap">
                <table className="rate-table">
                  <thead>
                    <tr>
                      <th scope="col">Points</th>
                      <th scope="col">Reward</th>
                    </tr>
                  </thead>
                  <tbody>
                    {supportPage.rewards.map(([p, r]) => (
                      <tr key={p}>
                        <td>{p}</td>
                        <td>{r}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="small muted">{supportPage.rewardsNote}</p>
            </div>
            <div>
              <h3 className="cw-h3">{supportPage.callTitle}</h3>
              <div className="table-wrap">
                <table className="rate-table">
                  <thead>
                    <tr>
                      <th scope="col">I need help with</th>
                      <th scope="col">Go to</th>
                    </tr>
                  </thead>
                  <tbody>
                    {supportPage.call.map(([a, b]) => (
                      <tr key={a}>
                        <td>{a}</td>
                        <td>{b}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. How to apply */}
      <section className="section section-alt" id="how-to-apply" aria-labelledby="steps-h">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="cw-kicker">How to apply</p>
              <h2 id="steps-h">{stepsTitle}</h2>
            </div>
          </div>
          <ol className="cw-steps" role="list">
            {steps.map((s, i) => (
              <li key={s.step} className={`cw-step${i === 5 ? " cw-step-boost" : ""}`}>
                <span className="cw-step-n" aria-hidden>
                  {i < 5 ? i + 1 : "+"}
                </span>
                <p className="cw-step-name">{s.step.replace(/^\d\. /, "")}</p>
                <p>{s.what}</p>
                <p className="cw-step-time">{s.time}</p>
              </li>
            ))}
          </ol>
          <div className="cw-two">
            <div>
              <h3 className="cw-h3">Key dates</h3>
              <div className="table-wrap">
                <table className="rate-table">
                  <thead>
                    <tr>
                      <th scope="col">Date</th>
                      <th scope="col">What happens</th>
                    </tr>
                  </thead>
                  <tbody>
                    {keyDates.map(([d, w]) => (
                      <tr key={d}>
                        <th scope="row">{d}</th>
                        <td>{w}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="cw-side-photo">
              <CPhoto name={PH.register} />
              <p className="cw-why">
                <strong>Why register first?</strong> {whyRegister}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 10. Find your ward */}
      <section className="section" aria-labelledby="fyw-h">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="cw-kicker">Find your ward</p>
              <h2 id="fyw-h">{findWard.h2}</h2>
              <p>{findWard.intro}</p>
            </div>
          </div>
          <ul className="cw-ways" role="list">
            {findWard.ways.map(([w, how], i) => (
              <li key={w}>
                <p className="cw-way-name">{w}</p>
                <p>{how}</p>
                <a href={i === 3 ? waLink("WARD ") : checkHref} className="cw-way-btn" {...(i === 3 ? { target: "_blank", rel: "noopener" } : {})}>
                  {i === 3 ? "Open WhatsApp" : "Use the ward finder"}
                </a>
              </li>
            ))}
          </ul>
          <div className="cw-two">
            <div className="cw-sample-card">
              <p className="small muted">Result card (sample)</p>
              <p>{findWard.sample}</p>
              <p className="cw-sample-ok">{findWard.sampleOpen}</p>
              <Link href={apply} className="btn btn-primary">
                {findWard.sampleButton}
              </Link>
            </div>
            <div>
              <CPhoto name={PH.ward} className="cw-photo-wide" />
              <p>
                <strong>If it's taken:</strong> {findWard.taken}
              </p>
              <p className="small muted">
                <strong>Note:</strong> {findWard.note}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 11. Places by region */}
      <section className="section section-alt" aria-labelledby="reg-h">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="cw-kicker">Places by region</p>
              <h2 id="reg-h">{regionsPage.h2}</h2>
              <p>{regionsPage.intro}</p>
            </div>
          </div>
          <RegionChart checkHref={checkHref} />
          <div className="cw-two">
            <div>
              <h3 className="cw-h3">{regionsPage.decidedTitle}</h3>
              <ul className="cw-list">
                {regionsPage.decided.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="small muted">
                <strong>Good to know:</strong> {regionsPage.note}
              </p>
              <div className="cw-ctas">
                <a href={checkHref} className="btn btn-outline">
                  Check My Ward
                </a>
                <Link href={apply} className="btn btn-primary">
                  Register Free and Apply
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 12. Boost your application */}
      <section className="section" id="vision" aria-labelledby="vision-h">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="cw-kicker">Boost your application</p>
              <h2 id="vision-h">{boost.h2}</h2>
              {boost.paras.map((p) => (
                <p key={p.slice(0, 20)}>{p}</p>
              ))}
            </div>
          </div>
          <div className="cw-two cw-two-top">
            <div>
              <h3 className="cw-h3">Follow us on</h3>
              <div className="table-wrap">
                <table className="rate-table">
                  <thead>
                    <tr>
                      <th scope="col">Account</th>
                      <th scope="col">Handle</th>
                      <th scope="col" className="num">
                        Points
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {vision.platforms.map((p) => (
                      <tr key={p.key}>
                        <td>
                          <a href={site.social[p.key] ?? "#"} target="_blank" rel="noopener">
                            {p.name}
                          </a>
                        </td>
                        <td>{p.account}</td>
                        <td className="num">{p.points}</td>
                      </tr>
                    ))}
                    <tr>
                      <th scope="row" colSpan={2}>
                        All {vision.platforms.length} accounts
                      </th>
                      <th className="num">+{vision.bonus.points} bonus</th>
                    </tr>
                    <tr>
                      <th scope="row" colSpan={2}>
                        Counted in your score
                      </th>
                      <th className="num">up to 100 (of {followTotal})</th>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="cw-boost-side">
              <div className="cw-box band-green">
                <p className="cw-box-k">Meter (sample)</p>
                <div className="vm-meter" aria-hidden>
                  <span className="vm-fill" style={{ width: "38%" }} />
                  {[25, 50, 75].map((m) => (
                    <i key={m} style={{ left: `${m}%` }} />
                  ))}
                  <b>38</b>
                </div>
                <p>{boost.sample}</p>
                <p className="small">
                  <strong>Levels:</strong> {boost.levels}
                </p>
              </div>
              <p>{boost.everyone}</p>
              <p>
                <strong>How we choose:</strong> {boost.choose}
              </p>
              <p className="small muted">{boost.where}</p>
              <Link href={apply} className="btn btn-primary">
                Start: follow us, then apply
              </Link>
            </div>
          </div>
          <details className="cw-details cw-details-plain">
            <summary>
              <h3>Keeping it honest, and your privacy</h3>
            </summary>
            <div className="cw-two">
              <ul className="cw-list">
                {vision.honest.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
              <ul className="cw-list">
                {vision.privacy.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </div>
          </details>
        </div>
      </section>

      {/* 13. Who we are looking for */}
      <section className="section section-alt" aria-labelledby="who-h">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="cw-kicker">Who we are looking for</p>
              <h2 id="who-h">{lookingFor.h2}</h2>
            </div>
          </div>
          <div className="cw-photo-strip">
            {PH.who.map((n) => (
              <CPhoto key={n} name={n} sizes="(min-width: 900px) 280px, 50vw" />
            ))}
          </div>
          <div className="cw-two cw-two-top">
            <div>
              <h3 className="cw-h3">You need</h3>
              <ul className="cw-ticks" role="list">
                {lookingFor.need.map((n) => (
                  <li key={n}>
                    <Check size={16} aria-hidden /> {n}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="cw-h3">You don't need</h3>
              <ul className="cw-ticks cw-crosses" role="list">
                {lookingFor.dontNeed.map((n) => (
                  <li key={n}>
                    <X size={16} aria-hidden /> {n}
                  </li>
                ))}
              </ul>
              <p className="cw-note">
                <strong>Good to know:</strong> {lookingFor.goodToKnow}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 14. Hear from people like you */}
      <section className="section" aria-labelledby="quotes-h">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="cw-kicker">Hear from people like you</p>
              <h2 id="quotes-h">{quotes.h2}</h2>
            </div>
          </div>
          <ul className="cw-quotes" role="list">
            {quotes.items.map(([q, by], i) => (
              <li key={by} className={i % 2 ? "" : "band-green"}>
                <span className="cw-quote-head">
                  <span className="cw-avatar" aria-hidden>
                    {by.charAt(0)}
                  </span>
                  <span className="chip chip-demo">Sample</span>
                </span>
                <blockquote>
                  <p>“{q}”</p>
                </blockquote>
                <p className="small">— {by}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 15. Safety, trust and fairness */}
      <section className="section band-red" aria-labelledby="safe-h">
        <div className="container cw-safety">
          <div>
            <p className="cw-kicker">Safety, trust and fairness</p>
            <h2 id="safe-h">{safetyTitle}</h2>
            <ul className="cw-list cw-list-inv">
              {safety.map(([a, b]) => (
                <li key={a}>
                  <strong>{a}</strong> {b}
                </li>
              ))}
            </ul>
            <p>
              Read the <Link href={L("/street-activation-guide")}>Street Activation Guide</Link> before you start recruiting.
            </p>
            <details className="cw-details cw-details-band">
              <summary>
                <h3>Rules we follow</h3>
              </summary>
              <ul className="cw-list cw-list-inv">
                {rules.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </details>
          </div>
          <div className="cw-verify">
            <h3>Check before you trust</h3>
            <p>Every leader has a verified ID with a code anyone can check. If anyone asks you for money, report it.</p>
            <div className="cw-ctas">
              <Link href={L("/verify")} className="btn btn-primary">
                Verify a leader or channel
              </Link>
              <Link href={L("/report")} className="btn btn-outline">
                Report a Concern
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 16. Frequently asked questions */}
      <section className="section" aria-labelledby="faq">
        <div className="container container-narrow">
          <Faq items={faq} title="Frequently asked questions" />
        </div>
      </section>

      {/* 17. Final call to action */}
      <section className="section band-green cw-final cw-final-photo" aria-labelledby="final-h">
        <CPhoto name={PH.final} className="cw-final-bg" sizes="100vw" />
        <div className="container">
          <h2 id="final-h">{finalH2}</h2>
          <p>{finalCta.copy(open)}</p>
          <div className="cw-ctas">
            <Link href={apply} className="btn btn-lg cw-btn-primary">
              {finalCta.primary}
            </Link>
            <a href={waLink()} className="btn btn-lg btn-outline" target="_blank" rel="noopener">
              {finalCta.secondary}
            </a>
            <a href={tel} className="btn btn-lg btn-outline">
              {finalCta.call}
            </a>
          </div>
          <div className="cw-share">
            <h3>{finalCta.shareTitle}</h3>
            <p>{finalCta.share}</p>
            <ShareRow message={finalCta.shareMessage} url={pageUrl} />
          </div>
          <CareersContact />
        </div>
      </section>

      {/* Other roles on the Careers hub */}
      <section className="section" aria-labelledby="roles-h">
        <div className="container">
          <div className="section-head">
            <div>
              <h2 id="roles-h">Other roles on the Careers hub</h2>
              <p>{hubNote}</p>
            </div>
          </div>
          <div className="table-wrap">
            <table className="rate-table">
              <thead>
                <tr>
                  <th scope="col">Role</th>
                  <th scope="col">Places</th>
                  <th scope="col">Status</th>
                  <th scope="col">
                    <span className="sr-only">Action</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {hubRoles.map((r) => (
                  <tr key={r.role}>
                    <th scope="row">{r.role}</th>
                    <td>{r.places}</td>
                    <td>{r.status}</td>
                    <td>
                      <Link href={L(r.path)} className="btn btn-sm btn-outline">
                        {r.button}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </>
  );
}
