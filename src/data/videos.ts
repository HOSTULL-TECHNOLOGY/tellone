/**
 * Peter Obi videos shown in the Media Hub. Public YouTube uploads from broadcasters and programmes, found through
 * YouTube search in October 2026 (IDs and titles as YouTube lists them); TBH One does not own them. Fan-commentary
 * uploads were left out. The campaign media team should confirm each one, and swap in official TBH One / NDC uploads
 * when those channels go live.
 */
export type Video = { id: string; title: string; source: string };

export const videos: Video[] = [
  { id: "9U3pylByvoc", title: "Exclusive interview: Peter Obi on the 2027 race, the opposition coalition and the Tinubu government", source: "Sunday Politics interview" },
  { id: "RaUawU-TKBQ", title: "Peter Obi’s exclusive interview with CNN’s Zain Asher", source: "CNN" },
  { id: "ovjMiD2BWJU", title: "Peter Obi speaks on democracy under Tinubu", source: "Arise TV" },
  { id: "QPD_l0Y7yt0", title: "Peter Obi interview session with BBC Africa", source: "BBC Africa, 2023 campaign" },
];

export const watchUrl = (id: string) => `https://www.youtube.com/watch?v=${id}`;
