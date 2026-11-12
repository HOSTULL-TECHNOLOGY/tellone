"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { timeToElection } from "@/lib/campaign";
import { CandidatePortrait } from "@/components/CandidatePortrait";
import type { Dict } from "@/i18n";
import type { Locale } from "@/lib/i18n";

/** The tagline as set on the official posters: light words + heavy key words. Text from the Concept Note, p.2. */
const TAGLINES: { lang: Locale; label: string; parts: [string, boolean][] }[] = [
  { lang: "en", label: "English", parts: [["We Will Not ", false], ["STEAL", true], [" Your ", false], ["MONEY", true]] },
  { lang: "pcm", label: "Pidgin", parts: [["We No Go ", false], ["THIEF", true], [" Your ", false], ["MONEY", true]] },
  { lang: "yo", label: "Yorùbá", parts: [["A Ò Ní ", false], ["JÍ OWÓ", true], [" Yín", false]] },
  { lang: "ha", label: "Hausa", parts: [["Ba Za Mu ", false], ["SACI KUƊINKU", true], [" Ba", false]] },
  { lang: "ig", label: "Igbo", parts: [["Anyị ", false], ["AGAGHỊ", true], [" Ezu Ohi ", false], ["EGO", true], [" Unu", false]] },
];
const HTML_LANG: Record<Locale, string> = { en: "en", pcm: "pcm", yo: "yo", ha: "ha", ig: "ig" };

export function Hero({ t, locale, joinHref, fundHref, candidatesHref }: { t: Dict; locale: Locale; joinHref: string; fundHref: string; frameworkHref?: string; candidatesHref: string }) {
  const start = Math.max(0, TAGLINES.findIndex((x) => x.lang === locale));
  const [i, setI] = useState(start);
  const [paused, setPaused] = useState(false);
  const [left, setLeft] = useState<ReturnType<typeof timeToElection> | null>(null);
  const reduce = useRef(false);

  useEffect(() => {
    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tick = () => setLeft(timeToElection());
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);

  // One orchestrated moment: the tagline cycles through the five languages (6 s each).
  useEffect(() => {
    if (paused || reduce.current) return;
    const id = window.setInterval(() => setI((n) => (n + 1) % TAGLINES.length), 6000);
    return () => window.clearInterval(id);
  }, [paused]);

  const cur = TAGLINES[i];
  return (
    <section className="hero hero-white" aria-labelledby="hero-title">
      <div className="container hero-grid">
        <div className="hero-main">
          <h1 id="hero-title" className="hero-h1">
            {t.hero.title}
          </h1>
          <div className="bubble hero-bubble band-green" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
            <p className="hero-tagline" lang={HTML_LANG[cur.lang]} key={cur.lang} aria-live="off">
              {cur.parts.map(([w, heavy], k) => (heavy ? <strong key={k}>{w}</strong> : <span key={k}>{w}</span>))}
            </p>
            <p className="sr-only">
              {TAGLINES.map((x) => `${x.label}: ${x.parts.map((p) => p[0]).join("")}`).join(". ")}
            </p>
          </div>
          <div className="hero-langs" role="group" aria-label={t.hero.taglineIn}>
            {TAGLINES.map((x, k) => (
              <button
                key={x.lang}
                type="button"
                className="hero-lang"
                aria-pressed={k === i}
                onClick={() => {
                  setI(k);
                  setPaused(true);
                }}
              >
                {x.label}
              </button>
            ))}
          </div>
          <div className="hero-ctas">
            <Link href={joinHref} className="btn btn-primary btn-lg">
              {t.hero.join}
            </Link>
            <Link href={fundHref} className="btn btn-outline btn-lg">
              {t.hero.fund}
            </Link>
          </div>
        </div>

        <aside className="hero-side">
          <Link href={candidatesHref} className="hero-ticket" aria-label={`${t.candidates.title}: Peter Obi and Rabiu Musa Kwankwaso`}>
            <div className="hero-cand">
              <CandidatePortrait slug="peter-obi" size={260} eager />
              <p>
                <strong>Peter Obi</strong>
                <span>{t.candidates.obiRole}</span>
              </p>
            </div>
            <div className="hero-cand">
              <CandidatePortrait slug="rabiu-musa-kwankwaso" size={260} eager />
              <p>
                <strong>Rabiu Musa Kwankwaso</strong>
                <span>{t.candidates.kwanRole}</span>
              </p>
            </div>
          </Link>
          <div className="countdown band-green" role="timer" aria-live="off" aria-label={`${t.hero.countdown}: ${t.hero.electionDate}`}>
            <p className="countdown-label">{t.hero.countdown}</p>
            <div className="countdown-nums">
              <span>
                <strong>{left?.days ?? "—"}</strong> {t.hero.days}
              </span>
              <span>
                <strong>{left ? String(left.hours).padStart(2, "0") : "—"}</strong> {t.hero.hours}
              </span>
              <span>
                <strong>{left ? String(left.minutes).padStart(2, "0") : "—"}</strong> {t.hero.minutes}
              </span>
            </div>
            <p className="countdown-date">{t.hero.electionDate}</p>
          </div>
        </aside>
      </div>
    </section>
  );
}
