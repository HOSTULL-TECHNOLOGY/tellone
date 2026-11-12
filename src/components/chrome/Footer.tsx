import Link from "next/link";
import { Hashtag } from "@/components/ui/Hashtag";
import { footerColumns, footerUtility, legalLinks } from "@/data/nav";
import { href, type Locale } from "@/lib/i18n";
import { site, socialLabels } from "@/config/site";
import type { Dict } from "@/i18n";
import { FooterCounter } from "./FooterCounter";
import { StoreBadges } from "@/components/ui/StoreBadges";
import { CookieSettingsButton } from "./CookieBanner";

export function Footer({ locale, t }: { locale: Locale; t: Dict }) {
  const L = (p: string) => href(locale, p);
  const socials = (Object.keys(site.social) as (keyof typeof site.social)[]).filter((k) => site.social[k]);
  return (
    <footer className="site-footer band-green">
      <div className="split-rule" aria-hidden />
      <FooterCounter t={t} joinHref={L("/join")} />
      <div className="container footer-main">
        <div className="footer-brand">
          <img src="/brand/tbh-one-logo-360.webp" srcSet="/brand/tbh-one-logo-360.webp 360w, /brand/tbh-one-logo-560.webp 560w" sizes="216px" width={216} height={140} alt="TBH One logo" loading="lazy" className="footer-logo" />
          <p className="footer-tagline">{t.hero.tagline}</p>
          <p className="footer-hashtags">
            {site.hashtags.map((h) => (
              <Hashtag key={h} tag={h} />
            ))}
          </p>
          <StoreBadges t={t.app} appHref={L("/app")} compact />
        </div>
        <div className="footer-cols">
          {footerColumns.map((col) => (
            <nav key={col.key} aria-labelledby={`fcol-${col.key}`}>
              <h2 id={`fcol-${col.key}`} className="footer-h">
                {t.footer[col.key]}
              </h2>
              <ul role="list">
                {col.links.map((l) => (
                  <li key={l.path}>
                    <Link href={L(l.path)}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>
      <div className="container footer-rows">
        <nav aria-label={t.footer.utility} className="footer-utility">
          <ul role="list">
            {footerUtility.map((l) => (
              <li key={l.path}>
                <Link href={L(l.path)}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="footer-social">
          <span className="footer-social-label">{t.footer.social}:</span>
          {socials.length ? (
            <ul role="list">
              {socials.map((k) => (
                <li key={k}>
                  <a href={site.social[k]!} rel="me noopener" target="_blank">
                    {socialLabels[k]}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <Link href={L("/verify")}>{t.footer.socialPending}</Link>
          )}
        </div>
      </div>
      <div className="footer-legal">
        <div className="container footer-legal-row">
          <nav aria-label={t.footer.legal}>
            <ul role="list">
              {legalLinks.map((l) => (
                <li key={l.path}>
                  <Link href={L(l.path)}>{l.label}</Link>
                </li>
              ))}
              <li>
                <CookieSettingsButton label={t.cookies.settings} />
              </li>
            </ul>
          </nav>
          <p>
            © {site.copyrightYear} TBH One. {t.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
