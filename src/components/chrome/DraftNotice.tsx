import { Languages } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import type { Dict } from "@/i18n";

/** Honest notice on non-English pages until translators approve them (Plan C9). */
export function DraftNotice({ locale, t, englishHref }: { locale: Locale; t: Dict; englishHref: string }) {
  if (locale === "en") return null;
  return (
    <div className="draft-notice" role="note" lang="en">
      <div className="container draft-notice-row">
        <Languages size={18} aria-hidden />
        <p>
          {t.common.draftNotice} <a href={englishHref}>{t.common.readInEnglish}</a>
        </p>
      </div>
    </div>
  );
}
