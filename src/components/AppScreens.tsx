import { Bell, Gift, HandHeart, Home, Megaphone, Music2, Pause, Search, ShoppingBag, Store, User, Users, Wallet } from "lucide-react";

/**
 * TBH One mobile app: interface design for the Android/iPhone app (launch 10 Nov 2026), drawn in HTML/CSS so it
 * stays sharp and matches the site. Decorative on the website (aria-hidden); the caption describes it.
 * Screens: Home (today's action, Impact Points, quick actions, theme song), Projects, Shop.
 */
function StatusBar() {
  return (
    <div className="ap-status">
      <span>9:41</span>
      <span className="ap-status-icons">
        <i /> <i /> <i />
      </span>
    </div>
  );
}

function Tabs({ active }: { active: "home" | "projects" | "shop" }) {
  const items = [
    ["home", "Home", Home],
    ["projects", "Projects", Wallet],
    ["shop", "Shop", ShoppingBag],
    ["media", "Media", Music2],
    ["me", "Me", User],
  ] as const;
  return (
    <nav className="ap-tabs">
      {items.map(([k, label, Icon]) => (
        <span key={k} className={k === active ? "is-on" : ""}>
          <Icon size={18} />
          {label}
        </span>
      ))}
    </nav>
  );
}

function HomeScreen() {
  return (
    <div className="ap-screen ap-home">
      <StatusBar />
      <div className="ap-top">
        <img src="/brand/tbh-one-logo-180.webp" alt="" width={64} height={41} />
        <span className="ap-top-icons">
          <Bell size={18} />
          <span className="ap-avatar">AO</span>
        </span>
      </div>
      <p className="ap-hello">
        Good morning, <strong>Adaeze</strong>
      </p>
      <div className="ap-today">
        <p className="ap-kicker">Today’s action</p>
        <p className="ap-today-title">Bring One</p>
        <p className="ap-today-text">Invite one friend who is still deciding.</p>
        <span className="ap-btn">Share invite</span>
      </div>
      <div className="ap-points">
        <div className="ap-ring" style={{ ["--p" as string]: "50%" }}>
          <strong>1,240</strong>
          <span>points</span>
        </div>
        <div>
          <p className="ap-points-title">Impact Points</p>
          <p className="ap-points-text">1,260 more for a free T-shirt</p>
          <div className="ap-bar">
            <span style={{ width: "50%" }} />
          </div>
        </div>
      </div>
      <div className="ap-quick">
        {[
          ["Tell One", Megaphone, "r"],
          ["Bring One", Users, "g"],
          ["Help One", HandHeart, "r"],
          ["Rewards", Gift, "g"],
        ].map(([l, Icon, c]) => {
          const I = Icon as typeof Megaphone;
          return (
            <span key={l as string} className={`ap-q ap-q-${c}`}>
              <I size={18} />
              {l as string}
            </span>
          );
        })}
      </div>
      <div className="ap-player">
        <span className="ap-play">
          <Pause size={14} />
        </span>
        <span className="ap-player-t">
          <strong>Money Meant for All</strong>
          <i>
            <b />
          </i>
        </span>
        <Music2 size={16} />
      </div>
      <Tabs active="home" />
    </div>
  );
}

function ProjectsScreen() {
  const items: [string, string, number, string][] = [
    ["Borehole repair, Ward 4", "Nsukka, Enugu", 100, "Delivered"],
    ["Hausa radio slots", "Kano Municipal", 63, "₦1.13m of ₦1.8m"],
    ["Fliers for Adeniran St.", "Surulere, Lagos", 75, "₦187k of ₦250k"],
  ];
  return (
    <div className="ap-screen ap-projects">
      <StatusBar />
      <div className="ap-head">
        <p className="ap-head-title">Fund a project</p>
        <Search size={18} />
      </div>
      <div className="ap-chips">
        <span className="is-on">Near me</span>
        <span>Open</span>
        <span>Delivered</span>
      </div>
      {items.map(([t, place, pct, note], i) => (
        <div key={t} className={`ap-proj ${i % 2 ? "ap-proj-g" : "ap-proj-r"}`}>
          <p className="ap-proj-t">{t}</p>
          <p className="ap-proj-p">{place}</p>
          <div className="ap-bar ap-bar-w">
            <span style={{ width: `${pct}%` }} />
          </div>
          <p className="ap-proj-n">
            <span>{note}</span>
            <strong>{pct}%</strong>
          </p>
        </div>
      ))}
      <span className="ap-btn ap-btn-wide">Fund ₦2,000</span>
      <Tabs active="projects" />
    </div>
  );
}

function ShopScreen() {
  const items: [string, string, string][] = [
    ["/shop/tshirt-wwnsym-english-480.webp", "Tagline T-shirt", "₦7,200"],
    ["/shop/hoodie-nigeria-we-want-front-480.webp", "Nigeria We Want hoodie", "₦19,800"],
    ["/shop/cap-we-no-go-thief-your-money-480.webp", "TBH One cap", "₦4,950"],
    ["/shop/tote-obi-kwankwaso-2027-480.webp", "Obi/Kwankwaso tote", "₦5,850"],
  ];
  return (
    <div className="ap-screen ap-shop">
      <StatusBar />
      <div className="ap-head">
        <p className="ap-head-title">Shop</p>
        <span className="ap-cart">
          <Store size={18} />
          <b>2</b>
        </span>
      </div>
      <div className="ap-banner">
        <span>Member price</span>
        <strong>10% off everything</strong>
      </div>
      <div className="ap-grid">
        {items.map(([src, name, price]) => (
          <div key={name} className="ap-prod">
            <img src={src} alt="" loading="lazy" />
            <p>{name}</p>
            <strong>{price}</strong>
          </div>
        ))}
      </div>
      <Tabs active="shop" />
    </div>
  );
}

export function AppScreens({ screens = ["home", "shop"] }: { screens?: ("home" | "projects" | "shop")[] }) {
  const map = { home: HomeScreen, projects: ProjectsScreen, shop: ShopScreen };
  return (
    <div className="app-screens" data-count={screens.length} aria-hidden>
      {screens.map((k, i) => {
        const S = map[k];
        return (
          <div key={k} className={`app-device app-device-${i}`}>
            <div className="app-notch" />
            <S />
          </div>
        );
      })}
    </div>
  );
}

export const appScreensCaption =
  "Design of the TBH One app: the home screen with today’s action, Impact Points and the theme song; project funding; and the Shop with member prices.";
