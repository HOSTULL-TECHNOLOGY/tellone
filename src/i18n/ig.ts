import type { DeepPartial } from "./types";
import type { Dict } from "./en";

// Draft Igbo — pending TBH One translator review (AEO-3).
const ig: DeepPartial<Dict> = {
  topbar: { verify: "Nyochaa Ọwa Gọọmentị", talk: "Gwa Anyị Okwu", app: "Nweta Ngwa", login: "Banye", join: "Sonye", fund: "Kwado Ọrụ" },
  nav: { movement: "Otu Ahụ", campaign: "Ebe Mkpọsa", involved: "Sonye Aka", opportunities: "Ohere", media: "Ebe Mgbasa Ozi", shop: "Ahịa", party: "Otu Ndọrọ Ndọrọ", search: "Chọọ", menu: "Menu" },
  hero: {
    tagline: "Anyị agaghị ezu ohi ego unu.",
    intro: "Otu efu nke ndị mmadụ na-akwado maka Peter Obi, Rabiu Musa Kwankwaso na Nigeria Democratic Congress. Onye Naịjirịa ọ bụla, n'ụlọ ma ọ bụ mba ọzọ, nwere ike ịkpọta otu onye ọzọ tupu Satọdee 16 Jenụwarị 2027.",
    join: "Sonye TBH One — ọ bụ n'efu",
    fund: "Kwado Ọrụ",
    countdown: "Tupu ntuli aka amalite",
  },
  quick: { join: "Sonye", fund: "Kwado", shop: "Ahịa", giveaway: "Onyinye", talk: "Gwa Anyị" },
  player: { play: "Kpọọ", pause: "Kwụsịtụ", comingSoon: "Ndekọ na-abịa n'oge na-adịghị anya" },
};
export default ig;
