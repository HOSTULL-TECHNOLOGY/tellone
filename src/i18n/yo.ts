import type { DeepPartial } from "./types";
import type { Dict } from "./en";

// Draft Yorùbá — pending TBH One translator review (AEO-3).
const yo: DeepPartial<Dict> = {
  topbar: { verify: "Ṣàyẹ̀wò Àwọn Ìkànnì Òṣìṣẹ́", talk: "Bá Wa Sọ̀rọ̀", app: "Gba Áàpù", login: "Wọlé", join: "Darapọ̀", fund: "Ṣe Onígbọ̀wọ́ Iṣẹ́ Àkànṣe" },
  nav: { movement: "Ẹgbẹ́ Náà", campaign: "Ibùdó Ìpolongo", involved: "Kópa", opportunities: "Àwọn Àǹfààní", media: "Ibùdó Mídíà", shop: "Ọjà", party: "Ẹgbẹ́ Òṣèlú", search: "Ṣàwárí", menu: "Àkójọ" },
  hero: {
    tagline: "A ò ní jí owó yín.",
    intro: "Ẹgbẹ́ ọ̀fẹ́ tí àwọn ènìyàn ń darí fún Peter Obi, Rabiu Musa Kwankwaso àti Nigeria Democratic Congress. Gbogbo ọmọ Nàìjíríà, nílé tàbí lókè òkun, lè mú ènìyàn kan sí i wá kí ó tó di Ọjọ́ Àbámẹ́ta 16 Oṣù Ṣẹ́rẹ́ 2027.",
    join: "Darapọ̀ mọ́ TBH One — ọ̀fẹ́ ni",
    fund: "Ṣe Onígbọ̀wọ́ Iṣẹ́ Àkànṣe",
    countdown: "Títí ìdìbò yóò fi bẹ̀rẹ̀",
  },
  quick: { join: "Darapọ̀", fund: "Ṣe Onígbọ̀wọ́", shop: "Ọjà", giveaway: "Ẹ̀bùn", talk: "Bá Wa Sọ̀rọ̀" },
  player: { play: "Ṣeré", pause: "Dádúró", comingSoon: "Ohùn ń bọ̀ láìpẹ́" },
};
export default yo;
