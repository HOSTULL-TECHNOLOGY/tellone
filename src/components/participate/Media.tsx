"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Bell, ChevronLeft, ChevronRight, Download, Expand, Play, Sparkles } from "lucide-react";
import { ProgrammeArt } from "@/components/media/ProgrammeArt";
import { Dialog } from "@/components/ui/Interactive";
import { songLabel, songs, SONG_AI_NOTE, SONG_ARTIST } from "@/data/songs";

import type { GalleryItem } from "@/data/gallery";

export type { GalleryItem };

/** Keyboard-accessible lightbox gallery: native dialog, arrow keys move between images. */
export function GalleryLightbox({ items }: { items: GalleryItem[] }) {
  const [i, setI] = useState<number | null>(null);
  useEffect(() => {
    if (i === null) return;
    const k = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setI((n) => (n === null ? n : (n + 1) % items.length));
      if (e.key === "ArrowLeft") setI((n) => (n === null ? n : (n - 1 + items.length) % items.length));
    };
    document.addEventListener("keydown", k);
    return () => document.removeEventListener("keydown", k);
  }, [i, items.length]);
  const cur = i === null ? null : items[i];
  return (
    <>
      <ul className="gal" role="list">
        {items.map((p, n) => (
          <li key={p.key}>
            <button type="button" className="gal-btn" onClick={() => setI(n)} aria-label={`Open larger: ${p.alt}`}>
              <picture>
                <source type="image/webp" srcSet={p.thumbWebp} sizes="(min-width: 1024px) 25vw, 50vw" />
                <img src={p.thumbJpg} alt={p.alt} width={480} height={Math.round(480 / (p.ratio ?? 0.8))} loading="lazy" style={{ aspectRatio: String(p.ratio ?? 0.8) }} />
              </picture>
              <span className="gal-cap">
                <Expand size={16} aria-hidden /> {p.label}
              </span>
            </button>
          </li>
        ))}
      </ul>
      <Dialog open={cur !== null} onClose={() => setI(null)} title={cur ? cur.label : ""} size="lg">
        {cur && (
          <div className="lightbox">
            <picture>
              <source type="image/webp" srcSet={cur.fullWebp} />
              <img src={cur.fullJpg} alt={cur.alt} width={800} height={Math.round(800 / (cur.ratio ?? 0.8))} />
            </picture>
            <div className="lightbox-nav">
              <button type="button" className="btn btn-outline btn-sm" onClick={() => setI((n) => (n === null ? n : (n - 1 + items.length) % items.length))}>
                <ChevronLeft size={16} aria-hidden /> Previous
              </button>
              <span className="small muted">
                {(i ?? 0) + 1} of {items.length} · use the arrow keys
              </span>
              <button type="button" className="btn btn-outline btn-sm" onClick={() => setI((n) => (n === null ? n : (n + 1) % items.length))}>
                Next <ChevronRight size={16} aria-hidden />
              </button>
            </div>
            {cur.download && (
              <a className="btn btn-sm btn-ghost" href={cur.download} download>
                <Download size={16} aria-hidden /> Download
              </a>
            )}
          </div>
        )}
      </Dialog>
    </>
  );
}

/**
 * All theme songs with players, a language filter and lyrics exactly as written in the files.
 * Only one track plays at a time; playing here also pauses the homepage player.
 */
export function SongLibrary() {
  const [lang, setLang] = useState("");
  const langs = useMemo(() => Array.from(new Set(songs.map((s) => s.langLabel))), []);
  const list = songs.filter((s) => !lang || s.langLabel === lang);
  const wrap = useRef<HTMLUListElement>(null);
  return (
    <div>
      <div className="filters" role="group" aria-label="Filter songs by language">
        <div className="choice-row">
          <label className="choice">
            <input type="radio" name="songlang" checked={!lang} onChange={() => setLang("")} />
            <span>All languages</span>
          </label>
          {langs.map((l) => (
            <label key={l} className="choice">
              <input type="radio" name="songlang" checked={lang === l} onChange={() => setLang(l)} />
              <span>{l}</span>
            </label>
          ))}
        </div>
      </div>
      <p className="small muted ai-note">
        <Sparkles size={14} aria-hidden /> Every recording is credited to {SONG_ARTIST} and labelled “{SONG_AI_NOTE}” because the files declare AI-assisted production (PRD CR-3).
      </p>
      <ul ref={wrap} className="songs" role="list">
        {list.map((s) => (
          <li key={s.slug} className="song card">
            <div className="song-head">
              <div>
                <h3 lang={s.lang}>{songLabel(s)}</h3>
                <p className="small muted">
                  {s.langLabel} · {Math.floor(s.duration / 60)}:{String(s.duration % 60).padStart(2, "0")} · {SONG_ARTIST} · <span className="chip chip-demo">AI-assisted</span>
                </p>
              </div>
              <a className="btn btn-sm btn-ghost" href={s.src} download={`${s.slug}.mp3`}>
                <Download size={16} aria-hidden /> Download MP3
              </a>
            </div>
            <audio
              controls
              preload="none"
              src={s.src}
              className="song-audio"
              aria-label={`Play ${songLabel(s)}`}
              onPlay={(e) => {
                wrap.current?.querySelectorAll("audio").forEach((a) => a !== e.currentTarget && a.pause());
                document.querySelectorAll<HTMLAudioElement>(".splayer audio").forEach((a) => a.pause());
              }}
            />
            <details className="lyrics">
              <summary>Lyrics</summary>
              <pre lang={s.lang}>{s.lyrics}</pre>
            </details>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Video slot that announces playback so the theme song stops (WEB-3). No videos have been supplied yet,
 * so each slot shows a labelled placeholder with a transcript area.
 */
/**
 * An upcoming TBH One TV programme or film: illustrated cover, running time and synopsis. Pressing play explains when
 * it premieres and offers a reminder (stored in this browser) instead of a blank player; the real video file
 * replaces this at release.
 */
export function VideoSlot({ title, duration, synopsis, vertical = false, index = 0, label = "TBH One TV", premiere = "on TBH One TV at launch on 9 November 2026" }: { title: string; duration: string; synopsis: string; vertical?: boolean; index?: number; label?: string; premiere?: string }) {
  const [open, setOpen] = useState(false);
  const [reminded, setReminded] = useState(false);
  const key = `tbh-remind:${title}`;
  useEffect(() => {
    try {
      setReminded(localStorage.getItem(key) === "1");
    } catch {}
  }, [key]);
  const remind = () => {
    try {
      localStorage.setItem(key, "1");
    } catch {}
    setReminded(true);
    window.dispatchEvent(new CustomEvent("tbh:toast", { detail: `We'll remind you when “${title}” premieres.` }));
  };
  return (
    <figure className={`vslot${vertical ? " vslot-v" : ""}`}>
      <div className={`vslot-screen ${vertical ? "ratio-9x16" : "ratio-16x9"}`}>
        <ProgrammeArt title={title} vertical={vertical} index={index} label={label} />
        <span className="vslot-dur">{duration}</span>
        {open ? (
          <div className="vslot-panel" role="status">
            <p>
              <strong>Premieres {premiere}.</strong>
            </p>
            {reminded ? (
              <p className="small">Reminder set in this browser.</p>
            ) : (
              <button type="button" className="btn btn-sm btn-primary" onClick={remind}>
                <Bell size={16} aria-hidden /> Remind me
              </button>
            )}
            <button type="button" className="vslot-close small" onClick={() => setOpen(false)}>
              Close
            </button>
          </div>
        ) : (
          <button type="button" className="vslot-play" onClick={() => setOpen(true)} aria-label={`Play ${title}`}>
            <Play size={28} aria-hidden />
          </button>
        )}
      </div>
      <figcaption>
        <span className="chip chip-soon">Coming soon</span>
        <strong className="vslot-title">{title}</strong>
        <p className="small muted vslot-syn">{synopsis}</p>
        <details className="lyrics">
          <summary>Transcript and captions</summary>
          <p className="small muted">Published with the video, with captions in English, Pidgin, Yorùbá, Hausa and Igbo.</p>
        </details>
      </figcaption>
    </figure>
  );
}
