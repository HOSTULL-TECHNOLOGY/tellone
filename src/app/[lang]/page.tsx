import Link from "next/link";
import { Hashtag } from "@/components/ui/Hashtag";
import { notFound } from "next/navigation";
import {
  Award, BadgeCheck, BookOpen, Briefcase, CalendarDays, CalendarPlus, Clapperboard, Gift, GraduationCap, HandHeart, Handshake,
  Images, MapPin, Megaphone, Radio, Shield, ShieldAlert, Smartphone, Store, Tag, Ticket, Tv, Users, Wifi,
} from "lucide-react";
import "@/styles/home.css";
import { getDict } from "@/i18n";
import { href, isLocale, type Locale } from "@/lib/i18n";
import { DEMO_MODE, site } from "@/config/site";
import { phaseAt, promotionsAllowed } from "@/lib/campaign";
import { timeline, timelineSources } from "@/data/timeline";
import { articles, couponDemo, events, giveawayDemo, leaderboard } from "@/data/demo";
import { memberPrice, productBySlug, type Product } from "@/data/shop";
import { ProductMedia } from "@/components/shop/ProductPhoto";

// Homepage picks from the shop catalogue so photos, prices and links always match the shop.
const featured = ["tbh-one-tagline-t-shirt", "hoodie-the-nigeria-we-want", "tbh-one-cap", "tote-obi-kwankwaso-2027"]
  .map(productBySlug)
  .filter((p): p is Product => !!p);
import { formatDate, formatNaira } from "@/lib/format";
import { icsDataUri } from "@/lib/ics";
import { Hero } from "@/components/home/Hero";
import { CandidatePortrait } from "@/components/CandidatePortrait";
import { NewsArt } from "@/components/NewsArt";
import { memberStories } from "@/data/stories";
import { ReachExplorer } from "@/components/home/ReachExplorer";
import { VideoCard } from "@/components/home/VideoCard";
import { SocialFeed } from "@/components/home/SocialFeed";
import { videos } from "@/data/videos";
import { EventCalendarArt } from "@/components/home/EventCalendarArt";
import { AppScreens, appScreensCaption } from "@/components/AppScreens";
import { diasporaChapters } from "@/data/presence";
import { states } from "@/data/states";
import { ProjectCarousel } from "@/components/home/ProjectCarousel";
import { projects as fundableProjects, STATUS_LABEL } from "@/data/projects";
import { PeopleMosaic } from "@/components/PeopleMosaic";
import { peoplePhotos } from "@/data/photos";
import { LiveBlock } from "@/components/home/LiveBlock";
import { ConnectForm } from "@/components/home/ConnectForm";
import { AddToCartButton } from "@/components/ui/AddToCartButton";
import { StoreBadges } from "@/components/ui/StoreBadges";
import { JsonLd, organizationLd, websiteLd } from "@/lib/seo";

export const revalidate = 300;

function Demo({ t }: { t: ReturnType<typeof getDict> }) {
  if (!DEMO_MODE) return null;
  return (
    <span className="chip chip-demo" title={t.common.demoTitle}>
      {t.common.demo}
    </span>
  );
}

function Head({ id, title, intro, action, demo }: { id: string; title: string; intro?: string; action?: React.ReactNode; demo?: React.ReactNode }) {
  return (
    <div className="section-head">
      <div>
        <h2 id={id}>
          {title} {demo}
        </h2>
        {intro && <p>{intro}</p>}
      </div>
      {action}
    </div>
  );
}

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale = lang as Locale;
  const t = getDict(locale);
  const L = (p: string) => href(locale, p);
  const phase = phaseAt();
  const promos = promotionsAllowed(phase);
  const today = new Date().toISOString().slice(0, 10);
  const benefitIcons = [GraduationCap, Briefcase, Store, Gift, Wifi, Ticket, Tag, Users, Handshake];

  return (
    <>
      <JsonLd data={[organizationLd(), websiteLd()]} />

      {/* 1 — Hero */}
      <Hero t={t} locale={locale} joinHref={L("/join")} fundHref={L("/projects")} frameworkHref={L("/framework")} candidatesHref={L("/candidates")} />

      {/* 2 — Theme song: the sticky player under the header on every page (components/chrome/StickyPlayer) */}

      {/* 3 — Our Belief */}
      <section className="section belief pattern" aria-labelledby="belief-h">
        <div className="container belief-grid">
          <div className="stack">
            <h2 id="belief-h">{t.belief.title}</h2>
            <p className="lead">{t.belief.body}</p>
            <p className="belief-hashtags">
              {site.hashtags.map((h) => (
                <Hashtag key={h} tag={h} />
              ))}
            </p>
            <Link href={L("/belief")} className="btn btn-outline">
              {t.belief.cta}
            </Link>
            <div className="belief-photos" aria-hidden>
              <picture className="belief-photo-main">
                <source type="image/webp" srcSet="/photos/10-market-trader-snacks-480.webp 480w, /photos/10-market-trader-snacks-960.webp 960w" sizes="(min-width: 1024px) 560px, 100vw" />
                <img src="/photos/10-market-trader-snacks.jpg" alt="" width={960} height={600} loading="lazy" decoding="async" />
              </picture>
              <picture className="belief-photo-inset">
                <source type="image/webp" srcSet="/photos/07-elder-village-road-480.webp" />
                <img src="/photos/07-elder-village-road.jpg" alt="" width={480} height={480} loading="lazy" decoding="async" />
              </picture>
            </div>
          </div>
          <figure className="chain" aria-labelledby="chain-cap">
            <figcaption id="chain-cap" className="chain-cap">
              {t.belief.chainTitle}
            </figcaption>
            <div className="chain-body">
              <p className="chain-root">{t.belief.noCorruption}</p>
              <ul role="list">
                {t.belief.chain.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>
            <p className="small muted">Source: TBH One Concept Note, Campaign Messaging Direction (October 2026).</p>
          </figure>
        </div>
      </section>

      {/* 3b — Photos of Nigerians: appears when photos are listed in src/data/photos.ts */}
      {peoplePhotos.length > 0 && (
        <section className="section" aria-label="The Nigerians we’re working for">
          <div className="container">
            <PeopleMosaic title="The Nigerians we’re working for" intro="Traders, young graduates, workers, teachers, elders and families: when public money is not stolen, it reaches them." limit={9} />
          </div>
        </section>
      )}

      {/* 4 — Meet the Candidates */}
      <section className="section band-green" aria-labelledby="cand-h">
        <div className="container">
          <Head id="cand-h" title={t.candidates.title} intro={t.candidates.intro} action={<Link href={L("/candidates")}>{t.common.viewAll}</Link>} />
          <div className="cand-grid">
            {[
              { name: "Peter Obi", role: t.candidates.obiRole, bio: t.candidates.obiBio, slug: "peter-obi" as const },
              { name: "Rabiu Musa Kwankwaso", role: t.candidates.kwanRole, bio: t.candidates.kwanBio, slug: "rabiu-musa-kwankwaso" as const },
            ].map((c) => (
              <article key={c.slug} className="cand">
                <CandidatePortrait slug={c.slug} size={320} className="cand-photo" />
                <div className="cand-body">
                  <p className="cand-role">{c.role}</p>
                  <h3 className="cand-name">{c.name}</h3>
                  <p>{c.bio}</p>
                  <div className="cand-actions">
                    <Link href={L(`/candidates/${c.slug}`)} className="btn btn-outline btn-sm">
                      {t.candidates.profile}
                    </Link>
                    <Link href={L("/manifesto")} className="btn btn-ghost btn-sm">
                      {t.candidates.manifesto}
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <p className="small muted cand-source">
            Sources: <a href="https://www.politico.ng/2026/05/31/2027-peter-obi-names-kwankwaso-as-running-mate-after-securing-ndc-ticket/" rel="noopener">Politico.ng, 31 May 2026</a>;{" "}
            <a href="https://en.wikipedia.org/wiki/2027_Nigerian_general_election" rel="noopener">2027 Nigerian general election</a>.
          </p>
        </div>
      </section>

      {/* 5 — T-B-H Framework */}
      <section className="section pattern fw-sec" aria-labelledby="fw-h">
        <div className="container">
          <Head id="fw-h" title={t.framework.title} intro={t.framework.intro} />
          <ol className="tbh-cards" role="list">
            {[
              { letter: "T", kicker: t.framework.tellKicker, title: t.framework.tellTitle, body: t.framework.tellBody, cta: t.framework.tellCta, path: "/diaspora", icon: Megaphone, photo: "/photos/03-young-professional" },
              { letter: "B", kicker: t.framework.bringKicker, title: t.framework.bringTitle, body: t.framework.bringBody, cta: t.framework.bringCta, path: "/join", icon: Users, photo: "/photos/04-nysc-corps-members" },
              { letter: "H", kicker: t.framework.helpKicker, title: t.framework.helpTitle, body: t.framework.helpBody, cta: t.framework.helpCta, path: "/projects", icon: HandHeart, photo: "/photos/08-schoolgirl-classroom" },
            ].map(({ letter, kicker, title, body, cta, path, icon: Icon, photo }) => (
              <li key={letter} className="tbh-card">
                <picture className="tbh-photo">
                  <source type="image/webp" srcSet={`${photo}-480.webp`} />
                  <img src={`${photo}.jpg`} alt="" width={480} height={300} loading="lazy" decoding="async" />
                </picture>
                <span className="tbh-letter" aria-hidden>
                  {letter}
                </span>
                <Icon size={24} aria-hidden className="tbh-icon" />
                <p className="tbh-kicker">{kicker}</p>
                <h3>{title}</h3>
                <p>{body}</p>
                <Link href={L(path)} className="link-arrowless">
                  {cta}
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 6 — Live member count */}
      <section className="section band-red" aria-labelledby="live-h">
        <div className="container">
          <Head id="live-h" title={t.live.title} demo={<Demo t={t} />} />
          <LiveBlock t={t} joinHref={L("/join")} transparencyHref={L("/transparency")} />
        </div>
      </section>

      {/* 6b — Where TBH One is active: every state and diaspora chapter */}
      <section className="section reach-sec" aria-labelledby="reach-h">
        <div className="container">
          <div className="reach-head">
            <h2 id="reach-h">
              Active across 36 states, the FCT and {diasporaChapters.length} countries, and <em>growing.</em>
            </h2>
            <p>TBH One is organised ward by ward across Nigeria, with diaspora chapters telling one at home. Click any country to explore, or click Nigeria to drill into states.</p>
          </div>
          <ReachExplorer stateHref={Object.fromEntries(states.map((st) => [st.slug, L(`/states/${st.slug}`)]))} statesHref={L("/states")} diasporaHref={L("/diaspora")} />
          <p className="reach-credit">
            Map: <a href="https://github.com/VictorCazanave/svg-maps" rel="noopener">svg-maps</a> after <a href="https://mapsvg.com/maps/nigeria" rel="noopener">MapSVG</a>, <a href="https://creativecommons.org/licenses/by/4.0/" rel="noopener license">CC BY 4.0</a>.
          </p>
        </div>
      </section>

      {/* 7 — Projects & Transparency */}
      <section className="section" aria-labelledby="proj-h">
        <div className="container">
          <Head id="proj-h" title={t.projects.title} intro={t.projects.intro} demo={<Demo t={t} />} action={<Link href={L("/transparency")}>{t.projects.transparency}</Link>} />
          <ProjectCarousel
            items={fundableProjects.map((p) => ({
              slug: p.slug,
              title: p.title,
              category: p.category,
              place: `${p.lga}, ${p.state}`,
              raised: p.raised,
              target: p.target,
              funders: p.funders,
              statusLabel: STATUS_LABEL[p.status],
              open: p.status === "open",
              update: p.updates[0]?.text,
            }))}
            hrefFor={Object.fromEntries(fundableProjects.map((p) => [p.slug, L(`/projects/${p.slug}`)]))}
            labels={{ raised: t.projects.raised, target: t.projects.target, funders: t.projects.funders, view: t.projects.view, fund: t.projects.fund, prev: "Previous projects", next: "More projects", region: t.projects.title }}
          />
        </div>
      </section>

      {/* 8 — Election timeline */}
      <section className="section band-green" aria-labelledby="el-h">
        <div className="container">
          <Head id="el-h" title={t.election.title} intro={t.election.intro} action={<Link href={L("/election")}>{t.election.full}</Link>} />
          <ol className="tl" role="list">
            {timeline
              .filter((m) => m.scope === "national")
              .map((m) => {
                const done = (m.end ?? m.date) < today;
                const isNext = !done && timeline.filter((x) => x.scope === "national").find((x) => (x.end ?? x.date) >= today) === m;
                return (
                  <li key={m.date} className={`tl-item${done ? " is-done" : ""}${isNext ? " is-next" : ""}`}>
                    <span className="tl-dot" aria-hidden />
                    <p className="tl-date">{m.dateLabel}</p>
                    <p className="tl-title">{m.title}</p>
                    <p className="sr-only">{done ? t.election.done : t.election.upcoming}</p>
                    {isNext && <span className="chip chip-ok tl-today">{t.election.next}</span>}
                  </li>
                );
              })}
          </ol>
          <p className="small muted">
            {t.election.source}:{" "}
            {timelineSources.slice(0, 3).map((s, i) => (
              <span key={s.url}>
                {i > 0 && "; "}
                <a href={s.url} rel="noopener">
                  {s.label}
                </a>
              </span>
            ))}
            .
          </p>
        </div>
      </section>

      {/* 9 — Event calendar */}
      <section className="section" aria-labelledby="ev-h">
        <div className="container">
          <Head id="ev-h" title={t.events.title} intro={t.events.intro} demo={<Demo t={t} />} action={<Link href={L("/events")}>{t.events.all}</Link>} />
          <div className="ev-wrap">
          <div className="ev-photo">
            <EventCalendarArt events={events} />
          </div>
          <ul className="ev-list" role="list">
            {events.map((e) => {
              const d = new Date(e.start);
              return (
                <li key={e.slug} className="ev">
                  <div className="ev-date" aria-hidden>
                    <span>{d.toLocaleString("en-GB", { month: "short", timeZone: "Africa/Lagos" })}</span>
                    <strong>{d.toLocaleString("en-GB", { day: "numeric", timeZone: "Africa/Lagos" })}</strong>
                  </div>
                  <div className="ev-body">
                    <span className="chip">{e.category}</span>
                    <h3>
                      <Link href={L(`/events/${e.slug}`)}>{e.title}</Link>
                    </h3>
                    <p className="ev-meta">
                      <CalendarDays size={16} aria-hidden /> {formatDate(e.start, true)} WAT
                    </p>
                    <p className="ev-meta">
                      <MapPin size={16} aria-hidden /> {e.place}
                    </p>
                    <p className="ev-meta small muted">
                      {t.events.organiser}: {e.organiser}
                    </p>
                  </div>
                  <div className="ev-actions">
                    <Link href={L(`/events/${e.slug}#rsvp`)} className="btn btn-primary btn-sm">
                      {t.events.rsvp}
                    </Link>
                    <a href={icsDataUri(e)} download={`${e.slug}.ics`} className="btn btn-ghost btn-sm">
                      <CalendarPlus size={16} aria-hidden /> {t.events.addToCalendar}
                    </a>
                  </div>
                </li>
              );
            })}
          </ul>
          </div>
        </div>
      </section>

      {/* 10 — Daily giveaway */}
      <section className="section gv-sec" aria-labelledby="gv-h">
        <div className="container gv">
          <div className="stack">
            <h2 id="gv-h">{t.giveaway.title}</h2>
            <p className="lead">{promos ? t.giveaway.intro : t.giveaway.ended}</p>
            <p className="small muted">{t.giveaway.noWinner}</p>
          </div>
          {promos && (
            <div className="gv-card bubble bubble-thin band-red">
              <p className="gv-label">
                {t.giveaway.todayPrize} <Demo t={t} />
              </p>
              <p className="gv-prize">{giveawayDemo.prize}</p>
              <p className="small muted">
                {giveawayDemo.sponsor}. {t.giveaway.closes}.
              </p>
              <div className="gv-actions">
                <Link href={L("/giveaway#enter")} className="btn btn-primary">
                  <Gift size={18} aria-hidden /> {t.giveaway.enter}
                </Link>
                <Link href={L("/giveaway#rules")}>{t.giveaway.rules}</Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 11 — Shop */}
      <section className="section" aria-labelledby="shop-h">
        <div className="container">
          <Head id="shop-h" title={t.shop.title} intro={promos ? t.shop.intro : t.shop.paused} demo={<Demo t={t} />} action={<Link href={L("/shop")}>{t.shop.visit}</Link>} />
          <div className="shop-grid">
            {featured.map((p) => (
              <article key={p.slug} className="prod">
                <Link href={L(`/shop/p/${p.slug}`)} className="prod-img" aria-label={p.name}>
                  <ProductMedia p={p} decorative sizes="(min-width: 1024px) 25vw, 50vw" />
                </Link>
                <div className="prod-body">
                  <h3>
                    <Link href={L(`/shop/p/${p.slug}`)}>{p.name}</Link>
                  </h3>
                  <p className="prod-price">
                    {formatNaira(p.price)}
                    <span className="small muted">
                      {" "}
                      · {t.shop.memberPrice} {formatNaira(memberPrice(p.price))}
                    </span>
                  </p>
                  {(p.sizes?.length ?? 0) > 1 || (p.colours?.length ?? 0) > 1 ? (
                    // Items with a size or colour to pick go to the product page instead of adding blind
                    <Link className="btn btn-outline btn-sm" href={L(`/shop/p/${p.slug}`)}>
                      {(p.sizes?.length ?? 0) > 1 ? t.shop.chooseSize : t.shop.chooseColour}
                    </Link>
                  ) : (
                    <AddToCartButton slug={p.slug} name={p.name} price={p.price} label={t.shop.addToCart} disabled={p.stock <= 0} />
                  )}
                </div>
              </article>
            ))}
          </div>
          {promos && (
            <div className="shop-extras">
              <div className="coupon">
                <Tag size={20} aria-hidden />
                <div>
                  <p className="small muted">{t.shop.coupon}</p>
                  <p>
                    <code>{couponDemo.code}</code> — {couponDemo.text}
                  </p>
                </div>
              </div>
              <Link href={L("/shop/offers")} className="btn btn-outline">
                {t.shop.offers}
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* 12 — Become a Leader */}
      <section className="section band-green" aria-labelledby="lead-h">
        <div className="container">
          <Head id="lead-h" title={t.leaders.title} />
          <div className="lead-grid">
            <article className="lead-card">
              <BadgeCheck size={28} aria-hidden />
              <h3>{t.leaders.wardTitle}</h3>
              <p>{t.leaders.wardBody}</p>
              <Link href={L("/ward-leaders")} className="btn btn-primary">
                {t.leaders.wardCta}
              </Link>
            </article>
            <article className="lead-card">
              <MapPin size={28} aria-hidden />
              <h3>{t.leaders.streetTitle}</h3>
              <p>{t.leaders.streetBody}</p>
              <Link href={L("/street-leaders")} className="btn btn-primary">
                {t.leaders.streetCta}
              </Link>
            </article>
          </div>
        </div>
      </section>

      {/* 13 — Member benefits */}
      <section className="section photo-side photo-side-ben" aria-labelledby="ben-h">
        <div className="container">
          <Head id="ben-h" title={t.benefits.title} intro={t.benefits.intro} action={<Link href={L("/benefits")}>{t.benefits.cta}</Link>} />
          <ul className="ben-list" role="list">
            {t.benefits.items.map((b, i) => {
              const Icon = benefitIcons[i] ?? Gift;
              return (
                <li key={b}>
                  <Icon size={22} aria-hidden />
                  <span>{b}</span>
                </li>
              );
            })}
          </ul>
          <p className="small muted ben-note">
            <Shield size={16} aria-hidden /> {t.benefits.note}
          </p>
        </div>
      </section>

      {/* 14 — Impact Points leaderboard */}
      <section className="section band-green" aria-labelledby="lb-h">
        <div className="container lb">
          <div className="stack">
            <h2 id="lb-h">
              {t.leaderboard.title} <Demo t={t} />
            </h2>
            <p className="muted">{t.leaderboard.intro}</p>
            <Link href={L("/rewards")} className="btn btn-outline">
              <Award size={18} aria-hidden /> {t.leaderboard.how}
            </Link>
          </div>
          <table className="lb-table">
            <caption className="sr-only">{t.leaderboard.title}</caption>
            <thead>
              <tr>
                <th scope="col">{t.leaderboard.rank}</th>
                <th scope="col">{t.leaderboard.member}</th>
                <th scope="col">{t.leaderboard.state}</th>
                <th scope="col" className="num">
                  {t.leaderboard.points}
                </th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((r, i) => (
                <tr key={r.firstName}>
                  <td>{i + 1}</td>
                  <td>{r.firstName}</td>
                  <td>{r.state}</td>
                  <td className="num">{r.points.toLocaleString("en-NG")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 15 — People speak (no fabricated testimonials) */}
      <section className="section photo-side photo-side-ppl" aria-labelledby="ppl-h">
        <div className="container">
          <Head id="ppl-h" title={t.people.title} intro="Members telling one, bringing one and helping one." demo={<Demo t={t} />} action={<Link href={L("/support?topic=story")}>{t.people.share}</Link>} />
          <ul className="story-grid" role="list">
            {memberStories.map((st, i) => (
              <li key={st.name} className={`story-card ${i % 3 === 1 ? "band-red" : "band-green"}`}>
                <p className="story-action">{st.action}</p>
                <blockquote>
                  <p>“{st.quote}”</p>
                </blockquote>
                <p className="story-who">
                  <span className="story-avatar" aria-hidden>
                    {st.name[0]}
                  </span>
                  <span>
                    <strong>{st.name}</strong>, {st.place}
                    <span className="story-role">{st.role}</span>
                  </span>
                </p>
              </li>
            ))}
          </ul>
          <p className="small muted story-note">Sample stories written for this prototype. Real member stories are published only with the member’s written consent.</p>
        </div>
      </section>

      {/* 16 — Media Hub */}
      <section className="section band-green" aria-labelledby="media-h">
        <div className="container">
          <Head id="media-h" title={t.media.title} intro={t.media.intro} action={<Link href={L("/media")}>{t.media.visit}</Link>} />
          <div className="media-grid">
            <VideoCard video={videos[0]} featured />
            <div className="media-side">
              <Link href={L("/media/theme-song")} className="media-tile">
                <Radio size={22} aria-hidden /> <span>{t.media.themeSong}</span>
              </Link>
              <Link href={L("/media/movies")} className="media-tile">
                <Clapperboard size={22} aria-hidden /> <span>{t.media.movies}</span>
              </Link>
              <Link href={L("/media/tv")} className="media-tile">
                <Tv size={22} aria-hidden /> <span>{t.media.tv}</span>
              </Link>
              <Link href={L("/media/gallery")} className="media-tile">
                <Images size={22} aria-hidden /> <span>{t.media.gallery}</span>
              </Link>
            </div>
            <div className="media-more">
              {videos.slice(1).map((v) => (
                <VideoCard key={v.id} video={v} />
              ))}
            </div>
            <p className="small muted media-note">Videos play from YouTube. TBH One does not own them; each belongs to the channel that published it.</p>
          </div>
        </div>
      </section>

      {/* 17 — Blog & News */}
      <section className="section" aria-labelledby="news-h">
        <div className="container">
          <Head id="news-h" title={t.news.title} demo={<Demo t={t} />} action={<Link href={L("/news")}>{t.news.all}</Link>} />
          <div className="news-grid">
            {articles.map((a) => (
              <article key={a.slug} className="news">
                <Link href={L(`/news/${a.slug}`)} className="news-img" tabIndex={-1} aria-hidden>
                  <NewsArt slug={a.slug} />
                </Link>
                <p className="news-cat small">{a.category}</p>
                <h3>
                  <Link href={L(`/news/${a.slug}`)}>{a.title}</Link>
                </h3>
                <p className="muted">{a.excerpt}</p>
                <p className="small muted">
                  {t.news.by} <Link href={L("/news/author/tbh-one-editorial-desk")}>{a.author}</Link> · <time dateTime={a.date}>{formatDate(a.date)}</time>
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 18 — Social feed */}
      <section className="section band-red" aria-labelledby="soc-h">
        <div className="container">
          <div className="section-head">
            <div>
              <h2 id="soc-h">
                {t.social.title} <span className="chip chip-demo">Sample posts</span>
              </h2>
              <p>Instagram, X and TikTok. The official handles go on the Verify page at launch; until then these are sample posts made from the campaign’s own posters, photos and messages.</p>
            </div>
            <Link href={L("/verify")} className="btn btn-outline">
              <BadgeCheck size={18} aria-hidden /> {t.social.verify}
            </Link>
          </div>
          <SocialFeed verifyHref={L("/verify")} />
          <p className="soc-tags">
            {site.hashtags.map((h) => (
              <Hashtag key={h} tag={h} />
            ))}
          </p>
        </div>
      </section>

      {/* 19 — Get the App */}
      <section className="section app-sec" aria-labelledby="app-h">
        <div className="container app">
          <div className="stack">
            <h2 id="app-h">{t.app.title}</h2>
            <p className="lead">{t.app.intro}</p>
            <ul className="app-feats" role="list">
              <li>
                <Smartphone size={20} aria-hidden /> {t.app.f1}
              </li>
              <li>
                <Award size={20} aria-hidden /> {t.app.f2}
              </li>
              <li>
                <Store size={20} aria-hidden /> {t.app.f3}
              </li>
            </ul>
            <StoreBadges t={t.app} appHref={L("/app")} />
          </div>
          <figure className="app-figure">
            <AppScreens screens={["home", "shop"]} />
            <figcaption className="app-caption">{appScreensCaption}</figcaption>
          </figure>
        </div>
      </section>

      {/* 20 — Stay safe */}
      <section className="section safe-sec band-red pattern" aria-labelledby="safe-h">
        <div className="container safe">
          <ShieldAlert size={36} aria-hidden className="safe-icon" />
          <div className="stack">
            <h2 id="safe-h">{t.safe.title}</h2>
            <p className="measure">{t.safe.intro}</p>
            <div className="safe-actions">
              <Link href={L("/verify")} className="btn btn-primary">
                {t.safe.verify}
              </Link>
              <Link href={L("/report")} className="btn btn-outline">
                {t.safe.report}
              </Link>
              <Link href={L("/safeguarding")}>{t.safe.safeguarding}</Link>
            </div>
          </div>
        </div>
      </section>

      {/* 21 — Stay connected */}
      <section className="section band-green" aria-labelledby="con-h">
        <div className="container connect">
          <div className="stack">
            <h2 id="con-h">{t.connect.title}</h2>
            <p className="muted">{t.connect.intro}</p>
            <p className="small muted">
              <BookOpen size={14} aria-hidden style={{ display: "inline", verticalAlign: "-2px" }} /> NDPA 2023 — consent recorded per purpose; opt out any time.
            </p>
          </div>
          <ConnectForm t={t.connect} privacyHref={L("/privacy")} whatsappHref={L("/whatsapp")} />
        </div>
      </section>
    </>
  );
}
