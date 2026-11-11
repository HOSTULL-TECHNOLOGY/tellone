"use client";

import { usePathname } from "next/navigation";
import { Check, Globe } from "lucide-react";
import { Popover } from "./Popover";
import { href, localeMeta, locales, stripLocale, type Locale } from "@/lib/i18n";

/** Switches to the same page in another language (PRD SEO-2). */
export function LanguageMenu({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname() ?? "/";
  const base = stripLocale(pathname);
  return (
    <Popover
      label={`${label}: ${localeMeta[locale].native}`}
      button={
        <>
          <Globe size={16} aria-hidden />
          <span>{localeMeta[locale].native}</span>
        </>
      }
    >
      {(close) => (
        <ul className="menu-list" role="list">
          {locales.map((l) => (
            <li key={l}>
              <a
                href={href(l, base)}
                hrefLang={localeMeta[l].hreflang}
                lang={localeMeta[l].htmlLang}
                aria-current={l === locale ? "true" : undefined}
                onClick={close}
              >
                <span>{localeMeta[l].native}</span>
                {l === locale && <Check size={16} aria-hidden />}
              </a>
            </li>
          ))}
        </ul>
      )}
    </Popover>
  );
}
