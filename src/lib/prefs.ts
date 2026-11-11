"use client";

/** localStorage wrappers that never throw (private mode, blocked storage). */
export function readPref(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}
export function writePref(key: string, value: string | null) {
  try {
    if (value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, value);
  } catch {
    /* storage unavailable: preference lasts for this page view only */
  }
}

export const PREF = {
  theme: "tbh-theme", // "light" | "dark" | "system"
  dataSaver: "tbh-data-saver", // "on" | "off"
  songPausedUntil: "tbh-song-paused-until", // epoch ms
  songLang: "tbh-song-lang",
  songAutoplay: "tbh-song-autoplay", // "on" | "off"; unset = on (off in Data Saver)
  consent: "tbh-consent", // JSON {necessary, analytics, marketing, at}
  cart: "tbh-cart", // JSON CartLine[]
} as const;

/** Inline script run before paint so the theme never flashes (no FOUC). */
export const themeBootScript = `(function(){try{var d=document.documentElement;var t=localStorage.getItem('tbh-theme');var k=t==='dark'||(t==='system'&&matchMedia('(prefers-color-scheme: dark)').matches)?'dark':'light';d.setAttribute('data-theme',k);var s=localStorage.getItem('tbh-data-saver');var c=navigator.connection;if(s==='on'||(s===null&&c&&c.saveData))d.setAttribute('data-saver','on');}catch(e){}})();`;

export const CART_EVENT = "tbh:cart";
export const VIDEO_PLAY_EVENT = "tbh:video-play";
