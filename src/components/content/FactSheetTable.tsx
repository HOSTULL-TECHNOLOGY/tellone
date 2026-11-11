import { facts, type Fact } from "@/data/factsheet";

/** The Fact Sheet as a crawlable HTML table — one source reused across pages (GEO-3). */
export function FactSheetTable({ ids, caption = "TBH One Fact Sheet" }: { ids?: string[]; caption?: string }) {
  const rows: Fact[] = ids ? ids.map((id) => facts.find((f) => f.id === id)!).filter(Boolean) : facts;
  return (
    <div className="table-wrap">
      <table className="ctable stack-sm">
        <caption>{caption}</caption>
        <thead>
          <tr>
            <th scope="col">Fact</th>
            <th scope="col">Value</th>
            <th scope="col">As of</th>
            <th scope="col">Source</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((f) => (
            <tr key={f.id}>
              <th scope="row">{f.fact}</th>
              <td data-label="Value">{f.value}</td>
              <td data-label="As of">{f.date}</td>
              <td data-label="Source">
                {f.url ? (
                  <a href={f.url} rel="noopener" target="_blank">
                    {f.source}
                  </a>
                ) : (
                  f.source
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function TaglineList() {
  const items = [
    { lang: "English", code: "en", text: "We will not steal your money." },
    { lang: "Nigerian Pidgin", code: "pcm", text: "We no go thief your money." },
    { lang: "Yorùbá", code: "yo", text: "A ò ní jí owó yín." },
    { lang: "Hausa", code: "ha", text: "Ba za mu saci kuɗinku ba." },
    { lang: "Igbo", code: "ig", text: "Anyị agaghị ezu ohi ego unu." },
  ];
  return (
    <ul className="taglines" role="list">
      {items.map((t) => (
        <li key={t.code}>
          <span className="tl-lang">{t.lang}</span>
          <span className="tl-text" lang={t.code}>
            {t.text}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function CorruptionChain() {
  const chain = ["more jobs", "less militancy", "less terrorism", "better healthcare", "better roads & infrastructure", "reliable electricity", "clean drinking water", "better education"];
  return (
    <figure className="cchain" aria-label="No corruption leads to: more jobs, less militancy, less terrorism, better healthcare, better roads and infrastructure, reliable electricity, clean drinking water, better education">
      <p className="cchain-root" aria-hidden>
        No corruption
      </p>
      <ul role="list">
        {chain.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ul>
    </figure>
  );
}

export function Hashtags() {
  return (
    <p className="tags">
      <span>#WeWillNotStealYourMoney</span>
      <span>#WWNSYM</span>
      <span>#VotePeopleWhoWillNotStealYourMoney</span>
      <span>#VPWWNSYM</span>
    </p>
  );
}

const posterLangs: Record<string, string> = { en: "English", ha: "Hausa", yo: "Yorùbá", ig: "Igbo" };
export function PosterGallery({ download = false }: { download?: boolean }) {
  return (
    <ul className="posters" role="list">
      {(["en", "ha", "yo", "ig"] as const).map((p) => (
        <li key={p}>
          <figure>
            <picture>
              <source type="image/webp" srcSet={`/media/poster-${p}-480.webp 480w, /media/poster-${p}-800.webp 800w`} sizes="(min-width: 900px) 25vw, 50vw" />
              <img src={`/media/poster-${p}-480.jpg`} width={480} height={580} loading="lazy" alt={`Campaign poster with the tagline in ${posterLangs[p]}`} />
            </picture>
            <figcaption>
              {posterLangs[p]} poster
              {download && (
                <>
                  {" · "}
                  <a href={`/media/poster-${p}-1320.jpg`} download={`tbh-one-poster-${p}.jpg`}>
                    Download JPG
                  </a>
                </>
              )}
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );
}
