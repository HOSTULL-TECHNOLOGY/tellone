"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Download, Menu, MessageCircle, Search, ShieldCheck, ShoppingBag, X } from "lucide-react";
import { mainNav } from "@/data/nav";
import { href, stripLocale, type Locale } from "@/lib/i18n";
import type { Dict } from "@/i18n";
import { DisplayControls, ThemeToggle } from "./DisplayPrefs";
import { DrawerAccount } from "./Account";

export function SiteHeader({ locale, t, logo, player }: { locale: Locale; t: Dict; logo: React.ReactNode; player?: React.ReactNode }) {
  const L = (p: string) => href(locale, p);
  const pathname = usePathname() ?? "/";
  const current = stripLocale(pathname);
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [drawer, setDrawer] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const hoverTimer = useRef<number | null>(null);

  const close = useCallback(() => setOpenKey(null), []);

  // Close menus on navigation
  useEffect(() => {
    setOpenKey(null);
    setDrawer(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!openKey) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        const k = openKey;
        setOpenKey(null);
        document.getElementById(`nav-btn-${k}`)?.focus();
      }
    };
    const onDown = (e: PointerEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setOpenKey(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [openKey]);

  const isActive = (paths: string[]) => paths.some((p) => current === p || (p !== "/" && current.startsWith(p + "/")));

  const hoverOpen = (key: string) => {
    if (window.matchMedia("(hover: hover)").matches) {
      if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
      hoverTimer.current = window.setTimeout(() => setOpenKey(key), 120);
    }
  };
  const hoverClose = () => {
    if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
    if (window.matchMedia("(hover: hover)").matches) hoverTimer.current = window.setTimeout(() => setOpenKey(null), 200);
  };

  return (
    <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
      <div className="container header-row">
        {logo}
        <nav ref={navRef} className="main-nav" aria-label={t.nav.label} onMouseLeave={hoverClose}>
          <ul role="list" className="main-nav-list">
            {mainNav.map((m) => {
              const paths = m.groups.flatMap((g) => g.links.map((l) => l.path));
              const open = openKey === m.key;
              if (m.direct)
                return (
                  <li key={m.key}>
                    <Link href={L(m.path)} className={`main-nav-btn${m.key === "shop" ? " main-nav-shop" : ""}`} data-active={isActive([m.path]) ? "true" : undefined} aria-current={current === m.path ? "page" : undefined}>
                      {m.key === "shop" && <ShoppingBag size={16} aria-hidden />}
                      {t.nav[m.key]}
                    </Link>
                  </li>
                );
              return (
                <li key={m.key} className="nav-item" onMouseEnter={() => hoverOpen(m.key)}>
                  <button
                    id={`nav-btn-${m.key}`}
                    type="button"
                    className="main-nav-btn"
                    aria-expanded={open}
                    aria-controls={`mega-${m.key}`}
                    data-active={isActive(paths) ? "true" : undefined}
                    onClick={() => setOpenKey(open ? null : m.key)}
                  >
                    {t.nav[m.key]}
                    <ChevronDown size={14} aria-hidden className="chev" />
                  </button>
                  {/* Plain dropdown: page names only, no descriptions */}
                  <div id={`mega-${m.key}`} className="nav-drop" hidden={!open}>
                    {m.groups.map((g, gi) => (
                      <div key={gi} className="nav-drop-group">
                        {g.title && <p className="nav-drop-title">{t.nav[g.title]}</p>}
                        <ul role="list">
                          {g.links.map((l) => (
                            <li key={l.path}>
                              <Link href={L(l.path)} onClick={close} aria-current={current === l.path ? "page" : undefined}>
                                {l.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="header-actions">
          <ThemeToggle />
          <button
            type="button"
            className="icon-btn"
            aria-label={t.nav.search}
            aria-expanded={searchOpen}
            aria-controls="header-search"
            onClick={() => setSearchOpen((s) => !s)}
          >
            {searchOpen ? <X size={20} aria-hidden /> : <Search size={20} aria-hidden />}
          </button>
          <button type="button" className="icon-btn menu-toggle" aria-label={t.nav.menu} aria-expanded={drawer} aria-controls="mobile-drawer" onClick={() => setDrawer(true)}>
            <Menu size={22} aria-hidden />
          </button>
        </div>
      </div>
      {player}
      <div id="header-search" className="header-search" hidden={!searchOpen}>
        <form className="container header-search-form" action={L("/search")} role="search">
          <label htmlFor="q" className="sr-only">
            {t.nav.searchPlaceholder}
          </label>
          <Search size={18} aria-hidden />
          <input id="q" name="q" type="search" className="input" placeholder={t.nav.searchPlaceholder} autoFocus={searchOpen} />
          <button className="btn btn-primary" type="submit">
            {t.nav.search}
          </button>
        </form>
      </div>
      <MobileDrawer open={drawer} onClose={() => setDrawer(false)} locale={locale} t={t} current={current} />
    </header>
  );
}

function MobileDrawer({ open, onClose, locale, t, current }: { open: boolean; onClose: () => void; locale: Locale; t: Dict; current: string }) {
  const L = (p: string) => href(locale, p);
  const panel = useRef<HTMLDivElement>(null);
  const [section, setSection] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    panel.current?.querySelector<HTMLElement>("button, a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && panel.current) {
        const f = panel.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])');
        const visible = Array.from(f).filter((el) => el.offsetParent !== null);
        const first = visible[0];
        const last = visible[visible.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      prev?.focus();
    };
  }, [open, onClose]);

  if (!mounted) return null;
  return createPortal(
    <div className="drawer-root" data-open={open ? "true" : undefined} hidden={!open}>
      <div className="drawer-scrim" onClick={onClose} aria-hidden />
      <div ref={panel} id="mobile-drawer" className="drawer" role="dialog" aria-modal="true" aria-label={t.nav.menu}>
        <div className="drawer-head">
          <span className="drawer-title">{t.nav.menu}</span>
          <button type="button" className="icon-btn" onClick={onClose} aria-label={t.nav.closeMenu}>
            <X size={22} aria-hidden />
          </button>
        </div>
        <div className="drawer-ctas">
          <Link href={L("/join")} className="btn btn-outline">
            {t.topbar.join}
          </Link>
          <Link href={L("/projects")} className="btn btn-primary">
            {t.topbar.fund}
          </Link>
        </div>
        <nav aria-label={t.nav.label}>
          <ul role="list" className="drawer-nav">
            {mainNav.map((m) => {
              const isOpen = section === m.key;
              if (m.direct)
                return (
                  <li key={m.key}>
                    <Link href={L(m.path)} className="drawer-sec" aria-current={current === m.path ? "page" : undefined} onClick={onClose}>
                      {t.nav[m.key]}
                    </Link>
                  </li>
                );
              return (
                <li key={m.key}>
                  <button type="button" className="drawer-sec" aria-expanded={isOpen} aria-controls={`dsec-${m.key}`} onClick={() => setSection(isOpen ? null : m.key)}>
                    {t.nav[m.key]}
                    <ChevronDown size={18} aria-hidden className="chev" />
                  </button>
                  <div id={`dsec-${m.key}`} hidden={!isOpen}>
                    {m.groups.map((g, gi) => (
                      <div key={gi}>
                        {g.title && <p className="drawer-group-title">{t.nav[g.title]}</p>}
                        <ul role="list" className="drawer-links">
                          {g.links.map((l) => (
                            <li key={l.path}>
                              <Link href={L(l.path)} aria-current={current === l.path ? "page" : undefined} onClick={onClose}>
                                {l.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </li>
              );
            })}
          </ul>
        </nav>
        <ul role="list" className="drawer-utility">
          <DrawerAccount loginHref={L("/login")} loginLabel={t.topbar.login} onNavigate={onClose} />
          <li>
            <Link href={L("/verify")} onClick={onClose}>
              <ShieldCheck size={18} aria-hidden /> {t.topbar.verify}
            </Link>
          </li>
          <li>
            <Link href={L("/contact")} onClick={onClose}>
              <MessageCircle size={18} aria-hidden /> {t.topbar.talk}
            </Link>
          </li>
          <li>
            <Link href={L("/app")} onClick={onClose}>
              <Download size={18} aria-hidden /> {t.topbar.app}
            </Link>
          </li>
        </ul>
        <div className="drawer-prefs">
          <DisplayControls t={t.prefs} />
        </div>
      </div>
    </div>,
    document.body,
  );
}
