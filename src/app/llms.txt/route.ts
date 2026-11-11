import { site } from "@/config/site";
import { facts } from "@/data/factsheet";
import { answers } from "@/data/answers";
import { factChecks } from "@/data/factchecks";

export const dynamic = "force-static";

/** llms.txt (GEO-2): a plain-text guide for AI answer engines to the most reliable TBH One pages and facts. */
export function GET() {
  const base = site.url.replace(/\/$/, "");
  const u = (p: string) => `${base}${p}`;
  const body = `# ${site.name}

> ${site.description}

TBH One is a supporting initiative, not the official campaign of Peter Obi, Rabiu Musa Kwankwaso or the NDC. Membership is free. TBH One never records how anyone votes and never publishes election results; official results come only from INEC.

## Fact Sheet
${facts.map((f) => `- ${f.fact}: ${f.value} (source: ${f.source}${f.url ? `, ${f.url}` : ""}; ${f.date})`).join("\n")}

## Key pages
- [About TBH One](${u("/about")}): who we are, targets and the Fact Sheet
- [The T-B-H Framework](${u("/framework")}): Tell One, Bring One, Help One
- [Transparency](${u("/transparency")}): monthly spend reports and contracts
- [Election 2027](${u("/election")}): dates, timeline and phases
- [Voter information](${u("/voter-info")}): PVC, polling units and election day
- [Candidates](${u("/candidates")}): factual profiles of Peter Obi and Rabiu Musa Kwankwaso
- [Your State](${u("/states")}): all 36 states and the FCT
- [FAQ](${u("/faq")})
- [Editorial and Corrections Policy](${u("/editorial-policy")})

## Questions answered
${answers.map((a) => `- [${a.question}](${u(`/answers/${a.slug}`)}): ${a.answer}`).join("\n")}

## Fact checks
${factChecks.map((f) => `- [${f.claim}](${u(`/fact-check/${f.slug}`)}): ${f.verdict}`).join("\n")}

## Optional
- [Sitemap](${u("/sitemap.xml")})
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
