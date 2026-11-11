import type { DeepPartial } from "./types";
import type { Dict } from "./en";

// Draft Nigerian Pidgin — pending TBH One translator review (AEO-3).
const pcm: DeepPartial<Dict> = {
  topbar: { verify: "Check Official Channels", talk: "Talk to Us", app: "Get the App", login: "Login", join: "Join", fund: "Fund Project" },
  nav: { movement: "The Movement", campaign: "Campaign Hub", involved: "Join Hand", opportunities: "Opportunities", media: "Media Hub", shop: "Shop", party: "The Party", search: "Search", menu: "Menu" },
  hero: {
    tagline: "We no go thief your money.",
    intro: "Free movement wey people dey power for Peter Obi, Rabiu Musa Kwankwaso and Nigeria Democratic Congress. Every Naija person, for house or abroad, fit move one more person before Saturday 16 January 2027.",
    tellText: "You dey abroad? Tell your people for house who to vote.",
    bringText: "Bring one padi wey still dey siddon for fence.",
    helpText: "Help one person or community wey need help.",
    join: "Join TBH One — e free",
    fund: "Fund Project",
    countdown: "Before polls open",
  },
  quick: { join: "Join", fund: "Fund", shop: "Shop", giveaway: "Giveaway", talk: "Talk to Us" },
  player: { play: "Play", pause: "Pause", tapForSound: "Tap make e sound", comingSoon: "Recording dey come soon" },
};
export default pcm;
