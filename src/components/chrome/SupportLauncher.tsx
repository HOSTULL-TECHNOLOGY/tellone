"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Bot, LifeBuoy, Loader2, MessageSquareText, RotateCcw, Send, X } from "lucide-react";
import { site } from "@/config/site";
import { scriptedAnswer } from "@/data/knowledge";
import { href as localeHref, isLocale } from "@/lib/i18n";
import { STATIC_FILE } from "@/lib/navigate";
import type { Dict } from "@/i18n";

type Msg = { role: "user" | "assistant"; content: string; links?: { label: string; href: string }[]; mode?: "ai" | "scripted" };

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
      <path
        fill="currentColor"
        d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.7.3-.2.3-.9.9-.9 2.2s.9 2.5 1 2.7c.1.2 1.8 2.8 4.4 3.9 1.6.7 2.3.8 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.2-.2-.5-.3Z"
      />
    </svg>
  );
}

/**
 * One floating support control that combines the AI Call Agent and WhatsApp (master prompt §8, SH-11).
 * The assistant identifies itself as automated at the start of every chat (GR-10).
 */
export function SupportLauncher({ t, locale, contactHref, verifyHref }: { t: Dict["support"]; locale: string; contactHref: string; verifyHref: string }) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<"menu" | "ai">("menu");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const panel = useRef<HTMLDivElement>(null);
  const launcher = useRef<HTMLButtonElement>(null);
  const log = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const wa = site.contact.whatsappNumber;
  const waHref = wa ? `https://wa.me/${wa}?text=${encodeURIComponent("Hello TBH One")}` : null;

  useEffect(() => {
    const openFromLink = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      setOpen(true);
      setView(detail === "ai" ? "ai" : "menu");
    };
    window.addEventListener("tbh:support", openFromLink);
    return () => window.removeEventListener("tbh:support", openFromLink);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        launcher.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    window.setTimeout(() => (view === "ai" ? inputRef.current : panel.current?.querySelector<HTMLElement>("button, a"))?.focus(), 30);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, view]);

  useEffect(() => {
    log.current?.scrollTo({ top: log.current.scrollHeight });
  }, [msgs, busy]);

  async function ask(q: string, history = msgs) {
    const text = q.trim();
    if (!text || busy) return;
    const next = [...history, { role: "user" as const, content: text }];
    setMsgs(next);
    setInput("");
    setBusy(true);
    setError(null);
    try {
      if (STATIC_FILE) throw new Error("offline");
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.map(({ role, content }) => ({ role, content })), locale }),
      });
      if (!res.ok) throw new Error(String(res.status));
      const data = (await res.json()) as Msg;
      setMsgs([...next, { role: "assistant", content: data.content, links: data.links, mode: data.mode }]);
    } catch {
      // No server (offline prototype) or the API failed: answer from the same approved facts in the browser.
      const hit = scriptedAnswer(text);
      const loc = isLocale(locale) ? locale : "en";
      await new Promise((r) => setTimeout(r, 500));
      setMsgs([
        ...next,
        hit
          ? { role: "assistant", mode: "scripted", content: hit.answer, links: hit.links.map((l) => ({ label: l.label, href: localeHref(loc, l.path) })) }
          : { role: "assistant", mode: "scripted", content: "I don't have an approved answer for that yet. Please use the Contact page and the TBH One team will help.", links: [{ label: "Contact", href: localeHref(loc, "/contact") }] },
      ]);
    } finally {
      setBusy(false);
    }
  }

  function retry() {
    const lastUser = [...msgs].reverse().find((m) => m.role === "user");
    if (!lastUser) return;
    const idx = msgs.lastIndexOf(lastUser);
    ask(lastUser.content, msgs.slice(0, idx));
  }

  return (
    <div className="support" data-open={open ? "true" : undefined}>
      <button
        ref={launcher}
        type="button"
        className="support-launcher"
        aria-expanded={open}
        aria-controls="support-panel"
        aria-label={t.open}
        onClick={() => {
          setOpen((o) => !o);
          setView("menu");
        }}
      >
        {open ? <X size={24} aria-hidden /> : <MessageSquareText size={24} aria-hidden />}
      </button>
      <div ref={panel} id="support-panel" className="support-panel" role="dialog" aria-modal="false" aria-labelledby="support-title" hidden={!open}>
        <div className="support-head">
          {view === "ai" ? (
            <button type="button" className="icon-btn" onClick={() => setView("menu")} aria-label={t.back}>
              <ArrowLeft size={20} aria-hidden />
            </button>
          ) : (
            <LifeBuoy size={20} aria-hidden className="support-head-icon" />
          )}
          <h2 id="support-title">{view === "ai" ? t.aiTitle : t.title}</h2>
          <button type="button" className="icon-btn" onClick={() => setOpen(false)} aria-label={t.close}>
            <X size={20} aria-hidden />
          </button>
        </div>

        {view === "menu" ? (
          <div className="support-menu">
            <button type="button" className="support-choice" onClick={() => setView("ai")}>
              <span className="support-choice-icon">
                <Bot size={22} aria-hidden />
              </span>
              <span>
                <strong>{t.aiTitle}</strong>
                <span>{t.aiText}</span>
              </span>
            </button>
            {waHref ? (
              <a className="support-choice" href={waHref} target="_blank" rel="noopener">
                <span className="support-choice-icon wa">
                  <WhatsAppIcon />
                </span>
                <span>
                  <strong>{t.waTitle}</strong>
                  <span>{t.waText}</span>
                </span>
              </a>
            ) : (
              <div className="support-choice is-pending" aria-disabled="true">
                <span className="support-choice-icon wa">
                  <WhatsAppIcon />
                </span>
                <span>
                  <strong>{t.waTitle}</strong>
                  <span>{t.waPending}</span>
                  <Link href={verifyHref} className="small">
                    Verify Official Channels
                  </Link>
                </span>
              </div>
            )}
            <p className="support-note small muted">{t.difference}</p>
            <Link href={contactHref} className="small">
              {t.human}
            </Link>
          </div>
        ) : (
          <div className="chat">
            <div ref={log} className="chat-log" aria-live="polite" aria-busy={busy}>
              <div className="chat-msg is-assistant">
                <p>{t.aiIntro}</p>
              </div>
              {msgs.length === 0 && (
                <div className="chat-suggest">
                  <p className="small muted">{t.suggested}</p>
                  {[t.q1, t.q2, t.q3, t.q4].map((q) => (
                    <button key={q} type="button" className="chip chat-chip" onClick={() => ask(q)}>
                      {q}
                    </button>
                  ))}
                </div>
              )}
              {msgs.map((m, i) => (
                <div key={i} className={`chat-msg is-${m.role}`}>
                  <p>{m.content}</p>
                  {m.links && m.links.length > 0 && (
                    <ul role="list" className="chat-links">
                      {m.links.map((l) => (
                        <li key={l.href}>
                          <Link href={l.href}>{l.label}</Link>
                        </li>
                      ))}
                    </ul>
                  )}
                  {m.mode === "scripted" && <p className="chat-mode small">Scripted answers — live AI not connected yet</p>}
                </div>
              ))}
              {busy && (
                <div className="chat-msg is-assistant chat-typing">
                  <Loader2 size={16} aria-hidden className="spin" />
                  <span>{t.typing}</span>
                </div>
              )}
              {error && (
                <div className="chat-error" role="alert">
                  <span>{error}</span>
                  <button type="button" className="btn btn-sm btn-outline" onClick={retry}>
                    <RotateCcw size={14} aria-hidden /> {t.retry}
                  </button>
                </div>
              )}
            </div>
            <form
              className="chat-form"
              onSubmit={(e) => {
                e.preventDefault();
                ask(input);
              }}
            >
              <label htmlFor="chat-input" className="sr-only">
                {t.placeholder}
              </label>
              <input ref={inputRef} id="chat-input" className="input" value={input} onChange={(e) => setInput(e.target.value)} placeholder={t.placeholder} autoComplete="off" maxLength={500} />
              <button type="submit" className="btn btn-primary" disabled={busy || !input.trim()} aria-label={t.send}>
                <Send size={18} aria-hidden />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
