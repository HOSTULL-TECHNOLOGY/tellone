import Link from "next/link";
import { Heart, MessageCircle, Play, Repeat2 } from "lucide-react";

/**
 * "From our official accounts": Instagram, X and TikTok feeds laid out the way each platform shows them.
 * The posts are SAMPLES made from the campaign's own posters, merch, photos and messages; the official handles are
 * not published yet, so none is invented here. At launch, replace with the platforms' embeds (or an API feed) for the
 * verified accounts listed on the Verify page. Only posts from verified TBH One accounts may appear (PRD SOC-1).
 */
function IgIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}
function XIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden>
      <path d="M17.8 3h3.1l-6.8 7.8 8 10.2h-6.3l-4.9-6.4L5.3 21H2.2l7.3-8.4L1.8 3h6.4l4.4 5.8L17.8 3zm-1.1 16.2h1.7L7.3 4.7H5.5l11.2 14.5z" />
    </svg>
  );
}
function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden>
      <path d="M16.6 2h-3.4v13.4a3 3 0 1 1-3-3c.3 0 .6 0 .9.1V9a6.4 6.4 0 1 0 5.5 6.4V8.6a8 8 0 0 0 4.4 1.4V6.6a4.5 4.5 0 0 1-4.4-4.6z" />
    </svg>
  );
}

const IG = [
  { src: "/media/poster-en-480.webp", alt: "Campaign poster in English" },
  { src: "/shop/hoodie-nigeria-we-want-front-480.webp", alt: "The Nigeria We Want hoodie" },
  { src: "/photos/04-nysc-corps-members-480.webp", alt: "NYSC corps members waving" },
  { src: "/media/poster-ha-480.webp", alt: "Campaign poster in Hausa" },
  { src: "/photos/10-market-trader-snacks-480.webp", alt: "A market trader at her stall" },
  { src: "/shop/tshirt-wwnsym-english-480.webp", alt: "The tagline T-shirt" },
];

const X_POSTS = [
  { text: "Every naira on every project page is listed: who gave, what was bought, and the photos when it is delivered. That is what “we will not steal your money” looks like in practice.", tag: "#WeWillNotStealYourMoney" },
  { text: "Tell One. Bring One. Help One. Three people-to-people actions, one Nigeria we want. Membership is free.", tag: "#TBHOne" },
  { text: "Have you checked your PVC? INEC’s voter-registration check takes two minutes. Do it today, then help one person do theirs.", tag: "#VotePeopleWhoWillNotStealYourMoney" },
];

const TT = [
  { src: "/people/peter-obi-560.webp", caption: "Why one promise carries the whole campaign" },
  { src: "/photos/01-market-trader-vegetables-480.webp", caption: "Market day: telling one in Pidgin" },
  { src: "/people/rabiu-musa-kwankwaso-441.webp", caption: "Theme song: Kudin Jama’a" },
];

export function SocialFeed({ verifyHref }: { verifyHref: string }) {
  const handle = "Official handle listed at launch";
  return (
    <div className="sfeed">
      <section className="sfeed-col sfeed-ig" aria-label="Instagram">
        <header className="sfeed-head">
          <span className="sfeed-icon">
            <IgIcon />
          </span>
          <span>
            <strong>Instagram</strong>
            <span className="sfeed-handle">{handle}</span>
          </span>
          <Link href={verifyHref} className="sfeed-follow">
            Follow
          </Link>
        </header>
        <ul className="sfeed-ig-grid" role="list">
          {IG.map((p) => (
            <li key={p.src}>
              <img src={p.src} alt={p.alt} loading="lazy" decoding="async" />
              <span className="sfeed-ig-hover" aria-hidden>
                <Heart size={16} /> <MessageCircle size={16} />
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="sfeed-col sfeed-x" aria-label="X">
        <header className="sfeed-head">
          <span className="sfeed-icon">
            <XIcon />
          </span>
          <span>
            <strong>X</strong>
            <span className="sfeed-handle">{handle}</span>
          </span>
          <Link href={verifyHref} className="sfeed-follow">
            Follow
          </Link>
        </header>
        <ul className="sfeed-x-list" role="list">
          {X_POSTS.map((p) => (
            <li key={p.tag + p.text.slice(0, 12)}>
              <div className="sfeed-x-who">
                <img src="/brand/tbh-one-logo-180.webp" alt="" width={36} height={36} />
                <strong>TBH One</strong>
              </div>
              <p>{p.text}</p>
              <p className="sfeed-tag">{p.tag}</p>
              <div className="sfeed-x-acts" aria-hidden>
                <MessageCircle size={16} /> <Repeat2 size={16} /> <Heart size={16} />
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="sfeed-col sfeed-tt" aria-label="TikTok">
        <header className="sfeed-head">
          <span className="sfeed-icon">
            <TikTokIcon />
          </span>
          <span>
            <strong>TikTok</strong>
            <span className="sfeed-handle">{handle}</span>
          </span>
          <Link href={verifyHref} className="sfeed-follow">
            Follow
          </Link>
        </header>
        <ul className="sfeed-tt-row" role="list">
          {TT.map((v) => (
            <li key={v.src}>
              <img src={v.src} alt="" loading="lazy" decoding="async" />
              <span className="sfeed-tt-play" aria-hidden>
                <Play size={22} />
              </span>
              <p>{v.caption}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
