/**
 * Factual candidate profiles from public records. No quotes, no policy claims on the candidates' behalf.
 * Portraits are TBH One logo art until official photographs are supplied.
 */
import { TICKET_SOURCE, TICKET_URL } from "./factsheet";

export type Candidate = {
  slug: "peter-obi" | "rabiu-musa-kwankwaso";
  name: string;
  role: string;
  portrait: string;
  answer: string;
  born: string;
  facts: { label: string; value: string }[];
  timeline: { year: string; text: string }[];
  sources: { label: string; url?: string; date?: string }[];
  wikidata: string;
  wikipedia: string;
};

const TICKET = { label: TICKET_SOURCE, url: TICKET_URL, date: "31 May 2026" };

export const candidates: Candidate[] = [
  {
    slug: "peter-obi",
    name: "Peter Obi",
    role: "NDC presidential candidate, 2027",
    portrait: "/people/peter-obi.jpg",
    answer:
      "Peter Gregory Obi is the Nigeria Democratic Congress (NDC) presidential candidate for the election on Saturday 16 January 2027. A businessman before entering politics, he served as Governor of Anambra State from 2006 to 2014 and was the Labour Party presidential candidate in 2023. He was declared the NDC flagbearer at the party’s special convention in Abuja on 30 May 2026.",
    born: "19 July 1961, Onitsha, Anambra State",
    facts: [
      { label: "Born", value: "19 July 1961, Onitsha, Anambra State" },
      { label: "Education", value: "BA Philosophy, University of Nigeria, Nsukka (1984)" },
      { label: "Governor of Anambra State", value: "2006 – 2014" },
      { label: "2023 presidential election", value: "Labour Party candidate; placed third" },
      { label: "2027 ticket", value: "NDC presidential candidate, with Rabiu Musa Kwankwaso as running mate" },
    ],
    timeline: [
      { year: "1961", text: "Born in Onitsha, Anambra State." },
      { year: "1984", text: "Graduated in philosophy from the University of Nigeria, Nsukka, and went on to a career in trading and banking, including chairing Fidelity Bank." },
      { year: "2006", text: "Sworn in as Governor of Anambra State in March 2006 after the courts upheld his 2003 election petition." },
      { year: "2007", text: "Returned to office by the Supreme Court in June 2007, which ruled that his four-year term had not expired." },
      { year: "2010", text: "Re-elected Governor of Anambra State; served until March 2014." },
      { year: "2019", text: "Vice-presidential candidate of the Peoples Democratic Party (PDP)." },
      { year: "2023", text: "Presidential candidate of the Labour Party; placed third in the February 2023 election." },
      { year: "2026", text: "Declared NDC presidential candidate on 30 May 2026 and named Rabiu Musa Kwankwaso as his running mate." },
    ],
    sources: [TICKET, { label: "Peter Obi — Wikipedia", url: "https://en.wikipedia.org/wiki/Peter_Obi" }],
    wikidata: "https://www.wikidata.org/wiki/Q7176093",
    wikipedia: "https://en.wikipedia.org/wiki/Peter_Obi",
  },
  {
    slug: "rabiu-musa-kwankwaso",
    name: "Rabiu Musa Kwankwaso",
    role: "NDC vice-presidential candidate, 2027",
    portrait: "/people/rabiu-musa-kwankwaso.jpg",
    answer:
      "Rabiu Musa Kwankwaso is Peter Obi’s running mate on the Nigeria Democratic Congress (NDC) ticket for the 16 January 2027 presidential election. An engineer by training, he twice served as Governor of Kano State, was Minister of Defence and a Senator, and leads the Kwankwasiyya Movement. He was the New Nigeria Peoples Party (NNPP) presidential candidate in 2023.",
    born: "21 October 1956, Kwankwaso, Kano State",
    facts: [
      { label: "Born", value: "21 October 1956, Kwankwaso, Madobi LGA, Kano State" },
      { label: "Governor of Kano State", value: "1999 – 2003 and 2011 – 2015" },
      { label: "Minister of Defence", value: "2003 – 2007" },
      { label: "Senator, Kano Central", value: "2015 – 2019" },
      { label: "2027 ticket", value: "NDC vice-presidential candidate, running mate to Peter Obi" },
    ],
    timeline: [
      { year: "1956", text: "Born in Kwankwaso, in present-day Madobi LGA, Kano State." },
      { year: "1992", text: "Elected to the House of Representatives in the Third Republic and became its Deputy Speaker." },
      { year: "1999", text: "Elected Governor of Kano State; served until 2003." },
      { year: "2003", text: "Appointed Minister of Defence; served until 2007." },
      { year: "2011", text: "Elected Governor of Kano State for a second time; served until 2015." },
      { year: "2015", text: "Elected Senator for Kano Central; served until 2019." },
      { year: "2023", text: "Presidential candidate of the New Nigeria Peoples Party (NNPP)." },
      { year: "2026", text: "Named as Peter Obi’s running mate on the NDC ticket on 30 May 2026." },
    ],
    sources: [TICKET, { label: "Rabiu Kwankwaso — Wikipedia", url: "https://en.wikipedia.org/wiki/Rabiu_Kwankwaso" }],
    wikidata: "https://www.wikidata.org/wiki/Q7279151",
    wikipedia: "https://en.wikipedia.org/wiki/Rabiu_Kwankwaso",
  },
];

export const candidateBySlug = (s: string) => candidates.find((c) => c.slug === s);
