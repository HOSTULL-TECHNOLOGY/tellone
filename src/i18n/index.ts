import en, { type Dict } from "./en";
import pcm from "./pcm";
import yo from "./yo";
import ha from "./ha";
import ig from "./ig";
import type { Locale } from "@/lib/i18n";
import type { DeepPartial } from "./types";

const partials: Record<Locale, DeepPartial<Dict>> = { en: {}, pcm, yo, ha, ig };

function merge<T>(base: T, over: DeepPartial<T> | undefined): T {
  if (!over) return base;
  const out: Record<string, unknown> = Array.isArray(base) ? ([...(base as unknown[])] as never) : { ...(base as object) };
  for (const [k, v] of Object.entries(over)) {
    const b = (base as Record<string, unknown>)[k];
    out[k] = v && typeof v === "object" && !Array.isArray(v) && b && typeof b === "object" ? merge(b, v as never) : v;
  }
  return out as T;
}

const cache = new Map<Locale, Dict>();
/** English with each language's draft translations layered on top. */
export function getDict(locale: Locale): Dict {
  if (!cache.has(locale)) cache.set(locale, merge(en, partials[locale]));
  return cache.get(locale)!;
}
export type { Dict };
