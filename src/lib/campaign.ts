import { campaignDates } from "@/config/site";

export type CampaignPhase = "campaign" | "cutoff" | "election-day" | "post-election";

/**
 * Date-driven rules (GR-3, EC-25, WEB-1):
 * - campaign:      promotion, giveaways, coupons and campaign banners allowed
 * - cutoff:        from 11:59 pm Thu 14 Jan 2027 — neutral voting information only
 * - election-day:  Sat 16 Jan 2027 — link only to official INEC results
 * - post-election: from 17 Jan 2027 — shop dispatch resumes
 * `?phase=` can preview a phase in demo mode so reviewers can test the switch.
 */
export function phaseAt(now: Date = new Date()): CampaignPhase {
  if (now >= campaignDates.postElection) return "post-election";
  if (now >= campaignDates.electionDayStart) return "election-day";
  if (now >= campaignDates.campaignCutoff) return "cutoff";
  return "campaign";
}

export function promotionsAllowed(phase: CampaignPhase) {
  return phase === "campaign";
}

export function timeToElection(now: Date = new Date()) {
  const ms = Math.max(0, campaignDates.electionDay.getTime() - now.getTime());
  const days = Math.floor(ms / 86_400_000);
  const hours = Math.floor((ms % 86_400_000) / 3_600_000);
  const minutes = Math.floor((ms % 3_600_000) / 60_000);
  return { ms, days, hours, minutes };
}

export const INEC_IREV_URL = "https://www.inecelectionresults.ng/";
export const INEC_URL = "https://inecnigeria.org/";
export const INEC_CVR_URL = "https://cvr.inecnigeria.org/";
