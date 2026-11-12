import Link from "next/link";
import { BadgeCheck, Gift, HandCoins, MessageCircle, ShoppingBag, UserPlus } from "lucide-react";
import { WAVE } from "@/data/careers";
import { href, type Locale } from "@/lib/i18n";
import type { Dict } from "@/i18n";

/** Side menu: floating bar on the right edge (desktop) and a bottom bar (mobile). Revised Website Menu, Side Menu. */
export function QuickActions({ locale, t }: { locale: Locale; t: Dict }) {
  const items = [
    { path: "/join", label: t.quick.join, icon: UserPlus },
    { path: "/projects", label: t.quick.fund, icon: HandCoins },
    { path: "/shop", label: t.quick.shop, icon: ShoppingBag },
    { path: "/giveaway", label: t.quick.giveaway, icon: Gift },
    // During ward leader recruitment (until wave 1 closes): side-menu link to Careers
    ...(Date.now() < Date.parse(`${WAVE.closes}T23:59:59+01:00`) ? [{ path: "/careers/ward-leaders", label: t.quick.lead, icon: BadgeCheck }] : []),
    { path: "/contact", label: t.quick.talk, icon: MessageCircle },
  ];
  return (
    <nav className="quick" aria-label={t.quick.label}>
      <ul role="list">
        {items.map(({ path, label, icon: Icon }) => (
          <li key={path}>
            <Link href={href(locale, path)}>
              <Icon size={20} aria-hidden />
              <span>{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
