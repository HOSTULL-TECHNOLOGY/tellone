/**
 * Client-side search index (prototype). Built at module load from the same data the pages use,
 * so results never drift from content. Production: a hosted index with stemming and the other four languages.
 */
import { mainNav, footerUtility, legalLinks } from "./nav";
import { answers } from "./answers";
import { factChecks } from "./factchecks";
import { newsArticles } from "./news";
import { states } from "./states";
import { candidates } from "./candidates";
import { legalPages } from "./legal";

export type SearchDoc = { path: string; title: string; text: string; type: "Page" | "Answer" | "Fact check" | "News" | "State" | "Candidate" | "Legal" };

const seen = new Set<string>();
const docs: SearchDoc[] = [];
const add = (d: SearchDoc) => {
  if (seen.has(d.path)) return;
  seen.add(d.path);
  docs.push(d);
};

candidates.forEach((c) => add({ path: `/candidates/${c.slug}`, title: c.name, text: `${c.role}. ${c.answer}`, type: "Candidate" }));
answers.forEach((a) => add({ path: `/answers/${a.slug}`, title: a.question, text: a.answer, type: "Answer" }));
factChecks.forEach((f) => add({ path: `/fact-check/${f.slug}`, title: f.claim, text: `${f.verdict}. ${f.summary}`, type: "Fact check" }));
newsArticles.forEach((n) => add({ path: `/news/${n.slug}`, title: n.title, text: n.excerpt, type: "News" }));
mainNav.forEach((m) => m.groups.forEach((g) => g.links.forEach((l) => add({ path: l.path, title: l.label, text: l.desc ?? "", type: "Page" }))));
[...footerUtility].forEach((l) => add({ path: l.path, title: l.label, text: l.desc ?? "", type: "Page" }));
legalPages.forEach((l) => add({ path: `/${l.slug}`, title: l.title, text: l.description, type: "Legal" }));
legalLinks.forEach((l) => add({ path: l.path, title: l.label, text: l.desc ?? "Policy", type: "Legal" }));
states.forEach((s) => add({ path: `/states/${s.slug}`, title: s.name === "FCT" ? "Federal Capital Territory (FCT)" : `${s.name} State`, text: `Capital ${s.capital}. ${s.zone}. ${s.lgas} LGAs.`, type: "State" }));

export const searchIndex = docs;

const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

/** Simple ranked match: every term must appear; title hits weigh more than body hits. */
export function search(q: string, limit = 30): SearchDoc[] {
  const terms = norm(q).split(/\s+/).filter((t) => t.length > 1);
  if (!terms.length) return [];
  return docs
    .map((d) => {
      const t = norm(d.title);
      const b = norm(d.text);
      let score = 0;
      for (const term of terms) {
        if (t.includes(term)) score += 3;
        else if (b.includes(term)) score += 1;
        else return null;
      }
      return { d, score };
    })
    .filter((x): x is { d: SearchDoc; score: number } => !!x)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.d);
}
