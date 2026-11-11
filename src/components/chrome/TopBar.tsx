import Link from "next/link";
import { Download, MessageCircle, ShieldCheck } from "lucide-react";
import { href, type Locale } from "@/lib/i18n";
import type { Dict } from "@/i18n";
import { LanguageMenu } from "./LanguageMenu";
import { DisplayPrefs } from "./DisplayPrefs";
import { CartLink } from "./CartLink";
import { AccountMenu } from "./Account";

/** Slim bar above the header on every page. Join and Fund stay visible on mobile. */
export function TopBar({ locale, t }: { locale: Locale; t: Dict }) {
  const L = (p: string) => href(locale, p);
  return (
    <div className="topbar band-green">
      <div className="container topbar-row">
        <div className="topbar-left">
          <LanguageMenu locale={locale} label={t.topbar.language} />
          <Link className="topbar-btn hide-sm" href={L("/verify")}>
            <ShieldCheck size={16} aria-hidden />
            <span>{t.topbar.verify}</span>
          </Link>
          <Link className="topbar-btn hide-md" href={L("/contact")}>
            <MessageCircle size={16} aria-hidden />
            <span>{t.topbar.talk}</span>
          </Link>
          <Link className="topbar-btn hide-md" href={L("/app")}>
            <Download size={16} aria-hidden />
            <span>{t.topbar.app}</span>
          </Link>
        </div>
        <div className="topbar-right">
          <DisplayPrefs t={t.prefs} />
          <CartLink to={L("/shop/cart")} label={t.topbar.cart} itemsLabel={t.topbar.cartItems} />
          <AccountMenu loginHref={L("/login")} loginLabel={t.topbar.login} />
          <Link className="btn btn-sm topbar-cta topbar-cta-join" href={L("/join")}>
            {t.topbar.join}
          </Link>
          <Link className="btn btn-sm topbar-cta topbar-cta-fund" href={L("/projects")}>
            {t.topbar.fund}
          </Link>
        </div>
      </div>
    </div>
  );
}
