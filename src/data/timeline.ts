/**
 * INEC revised timetable for the 2027 general election (issued Feb 2026; campaign dates confirmed July 2026).
 * Sources: Channels TV (26 Feb 2026), The Guardian, P.M. News (29 Jul 2026), WithinNigeria (31 Jul 2026).
 * Verify against inecnigeria.org before publishing changes.
 */
export type Milestone = { date: string; end?: string; title: string; dateLabel: string; scope: "national" | "state" };

export const timeline: Milestone[] = [
  { date: "2026-04-23", end: "2026-05-30", title: "Party primaries and dispute resolution", dateLabel: "23 Apr – 30 May 2026", scope: "national" },
  { date: "2026-06-27", end: "2026-07-11", title: "Presidential & National Assembly nomination forms submitted", dateLabel: "27 Jun – 11 Jul 2026", scope: "national" },
  { date: "2026-08-19", title: "Presidential & National Assembly campaigns begin", dateLabel: "19 Aug 2026", scope: "national" },
  { date: "2026-08-22", title: "Last day to withdraw or replace national candidates", dateLabel: "22 Aug 2026", scope: "national" },
  { date: "2026-09-09", title: "Governorship & State Assembly campaigns begin", dateLabel: "9 Sep 2026", scope: "state" },
  { date: "2026-09-12", title: "Final list of Presidential & National Assembly candidates", dateLabel: "12 Sep 2026", scope: "national" },
  { date: "2026-10-10", title: "Final list of Governorship & State Assembly candidates", dateLabel: "10 Oct 2026", scope: "state" },
  { date: "2027-01-14", title: "Presidential & National Assembly campaigns end (11:59 pm)", dateLabel: "Thu 14 Jan 2027", scope: "national" },
  { date: "2027-01-16", title: "Presidential & National Assembly elections", dateLabel: "Sat 16 Jan 2027", scope: "national" },
  { date: "2027-02-04", title: "Governorship & State Assembly campaigns end", dateLabel: "Thu 4 Feb 2027", scope: "state" },
  { date: "2027-02-06", title: "Governorship & State Assembly elections", dateLabel: "Sat 6 Feb 2027", scope: "state" },
];

export const timelineSources = [
  { label: "Channels TV — INEC releases revised election timetable (26 Feb 2026)", url: "https://www.channelstv.com/2026/02/26/inec-releases-revised-election-timetable-presidential-poll-to-hold-jan-16/" },
  { label: "The Guardian — INEC moves 2027 presidential election to January 16", url: "https://guardian.ng/politics/inec-moves-2027-presidential-election-to-january-16/" },
  { label: "P.M. News — INEC settles controversy over election timetable change (29 Jul 2026)", url: "https://pmnewsnigeria.com/2026/07/29/2027-inec-settles-controversy-over-election-timetable-change/" },
  { label: "Independent National Electoral Commission (official)", url: "https://inecnigeria.org/" },
];

export function nextMilestone(now = new Date()): Milestone | undefined {
  const today = now.toISOString().slice(0, 10);
  return timeline.find((m) => (m.end ?? m.date) >= today);
}
