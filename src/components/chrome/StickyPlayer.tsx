"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { FileText, Music2, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { PREF, readPref, writePref, VIDEO_PLAY_EVENT } from "@/lib/prefs";
import type { Dict } from "@/i18n";
import type { Locale } from "@/lib/i18n";
import { defaultSong, songLabel, songs, SONG_AI_NOTE, SONG_ARTIST, type Song } from "@/data/songs";
import { Dialog } from "@/components/ui/Interactive";

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
const POS_KEY = "tbh-song-pos"; // { slug, t, playing, at } — lets the song carry on across pages
const SESSION_KEY = "tbh-song-session"; // set once per visit, so autoplay only fires on the first page

type Pos = { slug: string; t: number; playing: boolean; at: number };
const readPos = (): Pos | null => {
  try {
    return JSON.parse(readPref(POS_KEY) ?? "null");
  } catch {
    return null;
  }
};

/**
 * WEB-3, updated: the theme song player sits in the sticky header on every public page.
 * - Hosted site: it lives in the shared layout, so music continues while you move between pages.
 * - Offline preview (each page is a separate file): the song and position are saved and resumed on the next page.
 * - Autoplay is a visitor setting (on by default, off in Data Saver). It applies to the first page of a visit;
 *   after that the song continues only if it was playing, so a pause is respected.
 * - Browsers that block sound start muted with "Tap for sound". Any video starting stops the song.
 */
export function StickyPlayer({ t, locale, allHref }: { t: Dict["player"]; locale: Locale; allHref: string }) {
  const audio = useRef<HTMLAudioElement>(null);
  const autoMuted = useRef(false);
  // Position to resume at once the audio has loaded; until then saves keep it instead of the unloaded 0:00
  const pendingSeek = useRef<number | null>(null);
  const [track, setTrack] = useState<Song>(() => defaultSong(locale));
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [time, setTime] = useState(0);
  const [dur, setDur] = useState(track.duration ?? 0);
  const [needsTap, setNeedsTap] = useState(false);
  const [autoplay, setAutoplay] = useState(true);
  const [lowData, setLowData] = useState(false);
  const [lyrics, setLyrics] = useState(false);
  const [note, setNote] = useState("");

  const src = useCallback((tr: Song, low = lowData) => (low ? tr.srcLow : tr.src), [lowData]);

  const save = useCallback(() => {
    const a = audio.current;
    if (!a) return;
    const t = pendingSeek.current ?? (a.currentTime || 0);
    writePref(POS_KEY, JSON.stringify({ slug: track.slug, t, playing: !a.paused || (pendingSeek.current !== null && !!readPos()?.playing), at: Date.now() } satisfies Pos));
  }, [track.slug]);

  // Start-up: restore the song and position, then decide whether to play
  useEffect(() => {
    const a = audio.current;
    if (!a) return;
    const saver = document.documentElement.getAttribute("data-saver") === "on";
    setLowData(saver);
    const pref = readPref(PREF.songAutoplay);
    const auto = pref ? pref === "on" : !saver;
    setAutoplay(auto);

    const pos = readPos();
    const chosen = songs.find((s) => s.slug === (pos?.slug ?? readPref(PREF.songLang))) ?? defaultSong(locale);
    setTrack(chosen);
    a.src = src(chosen, saver);
    a.volume = 0.8;
    const resumeAt = pos && pos.slug === chosen.slug ? pos.t : 0;
    if (resumeAt) {
      // Seeking before the file has loaded is not reliable, so apply it when the metadata arrives
      pendingSeek.current = resumeAt;
      setTime(resumeAt);
      const apply = () => {
        if (pendingSeek.current !== null) a.currentTime = pendingSeek.current;
        pendingSeek.current = null;
      };
      a.addEventListener("loadedmetadata", apply, { once: true });
      a.preload = "metadata";
      a.load();
    }

    let firstPage = false;
    try {
      firstPage = !sessionStorage.getItem(SESSION_KEY);
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {}
    const continuing = !!pos?.playing && Date.now() - pos.at < 30 * 60_000;
    const shouldPlay = firstPage ? auto : continuing;
    if (!shouldPlay) return;

    a.play()
      .then(() => setPlaying(true))
      .catch(() => {
        // Sound blocked until the visitor interacts: play muted and offer "Tap for sound"
        a.muted = true;
        autoMuted.current = true;
        setMuted(true);
        a.play()
          .then(() => setNeedsTap(true))
          .catch(() => {
            a.muted = false;
            autoMuted.current = false;
            setMuted(false);
            setNote(t.blocked);
          });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the saved position fresh (for the offline preview, where each page reloads)
  useEffect(() => {
    const id = window.setInterval(save, 1500);
    window.addEventListener("pagehide", save);
    return () => {
      window.clearInterval(id);
      window.removeEventListener("pagehide", save);
    };
  }, [save]);

  // First tap anywhere turns the sound on after a muted start
  useEffect(() => {
    if (!needsTap) return;
    const unmute = () => {
      if (audio.current) audio.current.muted = false;
      autoMuted.current = false;
      setMuted(false);
      setNeedsTap(false);
    };
    document.addEventListener("pointerdown", unmute, { once: true });
    return () => document.removeEventListener("pointerdown", unmute);
  }, [needsTap]);

  // Status notes are temporary so the sticky header stays compact
  useEffect(() => {
    if (!note) return;
    const id = window.setTimeout(() => setNote(""), 8000);
    return () => window.clearTimeout(id);
  }, [note]);

  // Videos stop the song; Data Saver switches to the small files
  useEffect(() => {
    const stop = () => audio.current?.pause();
    const onSaver = () => setLowData(document.documentElement.getAttribute("data-saver") === "on");
    window.addEventListener(VIDEO_PLAY_EVENT, stop);
    window.addEventListener("tbh:data-saver", onSaver);
    return () => {
      window.removeEventListener(VIDEO_PLAY_EVENT, stop);
      window.removeEventListener("tbh:data-saver", onSaver);
    };
  }, []);

  const toggle = () => {
    const a = audio.current;
    if (!a) return;
    if (!a.src) a.src = src(track);
    if (a.paused) {
      if (autoMuted.current) {
        autoMuted.current = false;
        setNeedsTap(false);
        setMuted(false);
        a.muted = false;
      }
      a.play()
        .then(() => setNote(""))
        .catch(() => setNote(t.blocked));
    } else a.pause();
  };

  const choose = (slug: string) => {
    const tr = songs.find((s) => s.slug === slug);
    const a = audio.current;
    if (!tr || !a) return;
    const wasPlaying = !a.paused;
    setTrack(tr);
    writePref(PREF.songLang, tr.slug);
    setTime(0);
    setDur(tr.duration ?? 0);
    a.src = src(tr);
    if (wasPlaying) a.play().catch(() => setNote(t.blocked));
  };

  const setAuto = (on: boolean) => {
    setAutoplay(on);
    writePref(PREF.songAutoplay, on ? "on" : "off");
  };

  return (
    <>
    <div className="splayer band-green" role="region" aria-label={t.region}>
      <div className="container splayer-row">
        <audio
          ref={audio}
          preload="none"
          onPlay={() => {
            setPlaying(true);
            window.dispatchEvent(new Event("tbh:song-play"));
          }}
          onPause={() => {
            setPlaying(false);
            save();
          }}
          onEnded={() => setPlaying(false)}
          onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
          onLoadedMetadata={(e) => setDur(e.currentTarget.duration || dur)}
        />
        <button type="button" className="splayer-play" onClick={toggle} aria-label={playing ? t.pause : t.play}>
          {playing ? <Pause size={18} aria-hidden /> : <Play size={18} aria-hidden />}
        </button>
        <div className="splayer-meta">
          <p className="splayer-title">
            <Music2 size={13} aria-hidden /> <span lang={track.lang}>{songLabel(track)}</span>
            <span className="splayer-lang"> · {track.langLabel}</span>
          </p>
          <div className="splayer-progress">
            <input
              type="range"
              min={0}
              max={Math.max(1, Math.round(dur))}
              step={1}
              value={Math.round(time)}
              aria-label={t.progress}
              aria-valuetext={`${fmt(time)} / ${fmt(dur)}`}
              onChange={(e) => {
                const a = audio.current;
                if (a && a.src) a.currentTime = Number(e.target.value);
                setTime(Number(e.target.value));
              }}
              style={{ ["--p" as string]: `${dur ? (time / dur) * 100 : 0}%` }}
            />
            <span className="splayer-time">
              {fmt(time)} / {fmt(dur)}
            </span>
          </div>
        </div>
        {needsTap && (
          <button type="button" className="btn btn-sm btn-primary splayer-tap" onClick={() => setNeedsTap(false)}>
            <Volume2 size={15} aria-hidden /> {t.tapForSound}
          </button>
        )}
        <label className="sr-only" htmlFor="splayer-song">
          {t.language}
        </label>
        <select id="splayer-song" className="input splayer-song" value={track.slug} onChange={(e) => choose(e.target.value)}>
          {songs.map((s) => (
            <option key={s.slug} value={s.slug}>
              {songLabel(s)} ({s.langLabel})
            </option>
          ))}
        </select>
        <label className="splayer-auto" title={t.autoplayHint}>
          <input type="checkbox" role="switch" aria-label={t.autoplay} checked={autoplay} onChange={(e) => setAuto(e.target.checked)} />
          <span>{t.autoplay}</span>
        </label>
        <button type="button" className="btn btn-sm splayer-lyrics" onClick={() => setLyrics(true)} aria-haspopup="dialog" aria-label={t.lyrics} title={t.lyrics}>
          <FileText size={15} aria-hidden /> <span>{t.lyrics}</span>
        </button>
        <button
          type="button"
          className="icon-btn splayer-mute"
          aria-label={muted ? t.unmute : t.mute}
          aria-pressed={muted}
          onClick={() => {
            const a = audio.current;
            if (a) a.muted = !muted;
            autoMuted.current = false;
            setNeedsTap(false);
            setMuted(!muted);
          }}
        >
          {muted ? <VolumeX size={18} aria-hidden /> : <Volume2 size={18} aria-hidden />}
        </button>
        {note && (
          <p className="splayer-note small" role="status">
            {note}
          </p>
        )}
      </div>
    </div>
      {/* Outside the green bar so the lyrics read on a white panel */}
      <Dialog
        open={lyrics}
        onClose={() => setLyrics(false)}
        title={`${songLabel(track)}: ${t.lyrics.toLowerCase()}`}
        footer={
          <p className="small muted">
            {SONG_ARTIST} · {SONG_AI_NOTE} · <Link href={allHref}>{t.allVersions}</Link>
          </p>
        }
      >
        <div className="song-pick">
          <label htmlFor="splayer-song-dialog">{t.language}</label>
          <select id="splayer-song-dialog" className="input" value={track.slug} onChange={(e) => choose(e.target.value)}>
            {songs.map((s) => (
              <option key={s.slug} value={s.slug}>
                {songLabel(s)} ({s.langLabel})
              </option>
            ))}
          </select>
        </div>
        <div className="song-lyrics" lang={track.lang}>
          {track.lyrics.split("\n").map((line, i) =>
            /^\[.*\]$/.test(line.trim()) ? (
              <p key={i} className="song-lyrics-part">
                {line.trim().slice(1, -1)}
              </p>
            ) : (
              <p key={i}>{line}</p>
            ),
          )}
        </div>
      </Dialog>
    </>
  );
}
