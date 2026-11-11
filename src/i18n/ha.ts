import type { DeepPartial } from "./types";
import type { Dict } from "./en";

// Draft Hausa — pending TBH One translator review (AEO-3).
const ha: DeepPartial<Dict> = {
  topbar: { verify: "Tabbatar da Tashoshin Hukuma", talk: "Yi Magana da Mu", app: "Sami Manhaja", login: "Shiga", join: "Shiga Ƙungiya", fund: "Ɗauki Nauyin Aiki" },
  nav: { movement: "Ƙungiyar", campaign: "Cibiyar Yaƙin Neman Zaɓe", involved: "Shiga Ciki", opportunities: "Damammaki", media: "Cibiyar Kafofin Watsa Labarai", shop: "Kanti", party: "Jam'iyya", search: "Nema", menu: "Menu" },
  hero: {
    tagline: "Ba za mu saci kuɗinku ba.",
    intro: "Ƙungiya kyauta da jama'a ke jagoranta don Peter Obi, Rabiu Musa Kwankwaso da Nigeria Democratic Congress. Kowane ɗan Najeriya, a gida ko a ƙasashen waje, zai iya jawo mutum ɗaya kafin Asabar 16 ga Janairu 2027.",
    join: "Shiga TBH One — kyauta ne",
    fund: "Ɗauki Nauyin Aiki",
    countdown: "Kafin a buɗe rumfunan zaɓe",
  },
  quick: { join: "Shiga", fund: "Tallafa", shop: "Kanti", giveaway: "Kyauta", talk: "Magana" },
  player: { play: "Kunna", pause: "Dakata", comingSoon: "Rikodi na nan tafe" },
};
export default ha;
