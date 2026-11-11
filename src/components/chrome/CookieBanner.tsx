"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Cookie } from "lucide-react";
import { PREF, readPref, writePref } from "@/lib/prefs";
import type { Dict } from "@/i18n";

export type Consent = { necessary: true; analytics: boolean; marketing: boolean; at: string };
const OPEN_EVENT = "tbh:cookie-settings";

export function readConsent(): Consent | null {
  try {
    return JSON.parse(readPref(PREF.consent) ?? "null");
  } catch {
    return null;
  }
}

/** Non-essential scripts may only load after this returns true (MS-2, APP-8). */
export function hasConsent(kind: "analytics" | "marketing") {
  return readConsent()?.[kind] === true;
}

export function CookieSettingsButton({ label }: { label: string }) {
  return (
    <button type="button" className="linklike" onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))}>
      {label}
    </button>
  );
}

/** Consent banner, controls at the far right on desktop (master prompt §16). */
export function CookieBanner({ t, policyHref }: { t: Dict["cookies"]; policyHref: string }) {
  const [visible, setVisible] = useState(false);
  const [manage, setManage] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const c = readConsent();
    if (!c) setVisible(true);
    else {
      setAnalytics(c.analytics);
      setMarketing(c.marketing);
    }
    const reopen = () => {
      const cur = readConsent();
      setAnalytics(cur?.analytics ?? false);
      setMarketing(cur?.marketing ?? false);
      setManage(true);
      setVisible(true);
      window.setTimeout(() => ref.current?.querySelector<HTMLElement>("input, button")?.focus(), 0);
    };
    window.addEventListener(OPEN_EVENT, reopen);
    return () => window.removeEventListener(OPEN_EVENT, reopen);
  }, []);

  useEffect(() => {
    document.documentElement.toggleAttribute("data-cookie-open", visible);
  }, [visible]);

  const save = (a: boolean, m: boolean) => {
    const c: Consent = { necessary: true, analytics: a, marketing: m, at: new Date().toISOString() };
    writePref(PREF.consent, JSON.stringify(c));
    window.dispatchEvent(new CustomEvent("tbh:consent", { detail: c }));
    setVisible(false);
    setManage(false);
  };

  if (!visible) return null;
  return (
    <section ref={ref} className="cookie" aria-labelledby="cookie-title" role="region">
      <div className="cookie-inner">
        <div className="cookie-text">
          <h2 id="cookie-title" className="cookie-title">
            <Cookie size={18} aria-hidden /> {t.title}
          </h2>
          <p>
            {t.body} <Link href={policyHref}>{t.policy}</Link>
          </p>
          {manage && (
            <fieldset className="cookie-cats">
              <legend className="sr-only">{t.manage}</legend>
              <label className="check">
                <input type="checkbox" checked disabled />
                <span>
                  <strong>{t.necessary}</strong> — {t.necessaryText}
                </span>
              </label>
              <label className="check">
                <input type="checkbox" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} />
                <span>
                  <strong>{t.analytics}</strong> — {t.analyticsText}
                </span>
              </label>
              <label className="check">
                <input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} />
                <span>
                  <strong>{t.marketing}</strong> — {t.marketingText}
                </span>
              </label>
            </fieldset>
          )}
        </div>
        <div className="cookie-actions">
          {manage ? (
            <button type="button" className="btn btn-primary" onClick={() => save(analytics, marketing)}>
              {t.save}
            </button>
          ) : (
            <button type="button" className="btn btn-ghost" onClick={() => setManage(true)}>
              {t.manage}
            </button>
          )}
          <button type="button" className="btn btn-outline" onClick={() => save(false, false)}>
            {t.reject}
          </button>
          <button type="button" className="btn btn-primary" onClick={() => save(true, true)}>
            {t.accept}
          </button>
        </div>
      </div>
    </section>
  );
}
