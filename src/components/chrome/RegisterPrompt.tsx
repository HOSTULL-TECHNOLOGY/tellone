"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { readPref, writePref } from "@/lib/prefs";
import { readSession } from "@/lib/auth";
import { stripLocale } from "@/lib/i18n";

const KEY = "tbh-register-prompt"; // epoch ms of the last dismissal
const WEEK = 7 * 86_400_000;
// Never interrupt sign-up, sign-in, checkout or other forms
const SKIP = [/^\/join/, /^\/login/, /^\/logout/, /^\/shop\/(cart|checkout)/, /^\/report/, /^\/support/, /^\/contact/];

/** "Commit and register" invitation: after 15 seconds or half a page, at most once a week, never to members. */
export function RegisterPrompt({ joinHref }: { joinHref: string }) {
  const pathname = stripLocale(usePathname() ?? "/");
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (SKIP.some((r) => r.test(pathname))) return;
    if (readSession()) return;
    const last = Number(readPref(KEY) ?? 0);
    if (Date.now() - last < WEEK) return;
    let shown = false;
    const show = () => {
      if (shown || document.querySelector("dialog[open]")) return;
      shown = true;
      setOpen(true);
    };
    const timer = window.setTimeout(show, 15000);
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max > 0 && window.scrollY / max > 0.5) show();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname]);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  const dismiss = () => {
    writePref(KEY, String(Date.now()));
    setOpen(false);
  };

  return (
    <dialog ref={dialog} className="reg-prompt" aria-labelledby="reg-title" onCancel={dismiss} onClose={() => setOpen(false)}>
      <button type="button" className="icon-btn reg-close" onClick={dismiss} aria-label="Close">
        <X size={20} aria-hidden />
      </button>
      <div className="reg-photos" aria-hidden>
        <img src="/people/peter-obi-320.webp" alt="" width={120} height={120} />
        <img src="/people/rabiu-musa-kwankwaso-320.webp" alt="" width={120} height={120} />
      </div>
      <p className="reg-kicker">Tell One · Bring One · Help One</p>
      <h2 id="reg-title">Commit to a Nigeria where your money works for you</h2>
      <p>Register as a TBH One member. It is free, it takes about two minutes, and you choose the first action you will take.</p>
      <div className="reg-actions">
        <Link href={joinHref} className="btn btn-lg reg-join" onClick={dismiss}>
          Register now. It’s free
        </Link>
        <button type="button" className="btn btn-lg reg-later" onClick={dismiss}>
          Maybe later
        </button>
      </div>
      <p className="reg-small">We never ask how you will vote, for your voter’s card number or your polling unit.</p>
    </dialog>
  );
}
