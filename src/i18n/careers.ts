import type { Locale } from "@/lib/i18n";
import { finalCta, hero } from "@/data/careers";

/**
 * Careers hero and final call to action in five languages (CAR-1). English is the approved copy from the Careers
 * Landing Page document; the Pidgin headline is the document's version D. The other translations are DRAFTS for the
 * TBH One translator pool to review before launch (the rest of the page shows the English copy until then).
 */
type CareersText = { eyebrow: string; h1: string; sub: string; intro: string; primary: string; secondary: string; trust: string; boostTitle: string; boost: string; finder: string; finalH2: string; draft: boolean };

const en: CareersText = { ...hero, boostTitle: "", boost: "", finder: hero.finder, finalH2: finalCta.h2, draft: false };

const pcm: CareersText = {
  eyebrow: "TBH One Careers · Wave 1 · 8,809 wards · Application don open",
  sub: "Your community don already dey look up to you. Now lead am for one movement wey talk one thing and mean am: we no go thief your money.",
  h1: "Lead Your Ward, Collect Your Fee — TBH One Dey Pay Per Work",
  intro:
    "TBH One dey find one ward leader for each of Nigeria 8,809 electoral wards. As ward leader, you go coordinate your street leaders, host village meetings, run community projects and keep your ward safe — and you go collect fee for the work wey you do, straight to your bank or mobile-money account. E free to join. Register as member, finish the application and start from Monday 16 November.",
  primary: "Register Free and Apply",
  secondary: "I don already be Member — Apply",
  trust: "No fee. No cost to apply. TBH One no go ever ask you to pay for any role.",
  boostTitle: "Boost your chance (optional):",
  boost: "We dey put first people wey believe the vision. Follow TBH One for 11 platforms, do other small things to gather Vision Points, and watch your Vision Meter dey fill live. Register free make you start.",
  finder: "You no sabi your ward? Most people no sabi am. Find am for 30 seconds:",
  finalH2: "Your ward dey wait. Be the one wey go lead am.",
  draft: true,
};

const yo: CareersText = {
  eyebrow: "Iṣẹ́ TBH One · Ìpele 1 · Wọ́ọ̀dù 8,809 · Ìforúkọsílẹ̀ ti ṣí",
  sub: "Àdúgbò rẹ ti ń wò ọ́ tẹ́lẹ̀. Nísinsìnyí, darí rẹ̀ fún ẹgbẹ́ tí ó sọ ohun kan tí ó sì túmọ̀ rẹ̀: a kò ní jí owó yín.",
  h1: "Di Aṣáájú Wọ́ọ̀dù TBH One: Ṣe Aṣáájú Wọ́ọ̀dù Rẹ, Gba Owó fún Iṣẹ́ Rẹ",
  intro:
    "TBH One ń wá aṣáájú wọ́ọ̀dù kan fún ọ̀kọ̀ọ̀kan nínú àwọn wọ́ọ̀dù ìdìbò 8,809 ní Nàìjíríà. Gẹ́gẹ́ bí aṣáájú wọ́ọ̀dù, wàá máa darí àwọn aṣáájú òpópónà rẹ, ṣe ìpàdé abúlé, ṣe iṣẹ́ àkànṣe àdúgbò, kí o sì pa wọ́ọ̀dù rẹ mọ́ láìléwu — wàá sì gba owó fún iṣẹ́ tí o bá ṣe, sínú àkáǹtì báńkì tàbí mobile-money rẹ. Ọ̀fẹ́ ni láti darapọ̀. Forúkọ sílẹ̀ gẹ́gẹ́ bí ọmọ ẹgbẹ́, parí ìbéèrè náà, kí o sì bẹ̀rẹ̀ láti ọjọ́ Ajé 16 Oṣù Kọkànlá.",
  primary: "Forúkọ Sílẹ̀ Lọ́fẹ̀ẹ́, Kí O Béèrè",
  secondary: "Ọmọ Ẹgbẹ́ Ni Mí Tẹ́lẹ̀ — Béèrè",
  trust: "Kò sí owó ìforúkọsílẹ̀. TBH One kò ní béèrè owó lọ́wọ́ rẹ fún ipò kankan láé.",
  boostTitle: "Mú àǹfààní rẹ pọ̀ sí i (kò pọn dandan):",
  boost: "A ń fi àyè sílẹ̀ fún àwọn tó gba ìran wa gbọ́. Tẹ̀lé TBH One lórí ìkànnì 11 kí o sì gba Vision Points; wo Vision Meter rẹ bí ó ṣe ń kún. Forúkọ sílẹ̀ lọ́fẹ̀ẹ́ láti bẹ̀rẹ̀.",
  finder: "O kò mọ wọ́ọ̀dù rẹ? Ọ̀pọ̀ ènìyàn kò mọ̀ ọ́n. Wá a láàárín ìṣẹ́jú-àáyá 30:",
  finalH2: "Wọ́ọ̀dù rẹ ń dúró dè ọ́. Jẹ́ ẹni tí yóò darí rẹ̀.",
  draft: true,
};

const ha: CareersText = {
  eyebrow: "Ayyukan TBH One · Zango na 1 · Mazabu 8,809 · An buɗe neman aiki",
  sub: "Al’ummarka ta riga ta dogara gare ka. Yanzu ka jagorance ta a wata ƙungiya da ke faɗin abu ɗaya kuma tana nufin sa: ba za mu saci kuɗinku ba.",
  h1: "Zama Shugaban Mazaba na TBH One: Ka Jagoranci Mazabarka, Ka Samu Kudin Aikinka",
  intro:
    "TBH One na neman shugaban mazaba guda ɗaya ga kowace daga cikin mazabun zaɓe 8,809 na Najeriya. A matsayinka na shugaban mazaba, za ka jagoranci shugabannin titi, ka shirya taron ƙauye, ka gudanar da ayyukan al'umma kuma ka kiyaye mazabarka — kuma za a biya ka kuɗin aikin da ka yi, a asusun bankinka ko na mobile-money. Shiga kyauta ne. Yi rajista a matsayin memba, ka kammala neman aikin, ka fara daga Litinin 16 ga Nuwamba.",
  primary: "Yi Rajista Kyauta Ka Nema",
  secondary: "Na Riga Na Zama Memba — Nema",
  trust: "Babu kuɗi. Babu biyan kuɗin nema. TBH One ba za ta taɓa tambayarka kuɗi don wani matsayi ba.",
  boostTitle: "Ƙara damarka (ba dole ba ne):",
  boost: "Muna fifita waɗanda suka yarda da manufarmu. Bi TBH One a dandali 11 ka tara Vision Points, ka kalli Vision Meter ɗinka yana cika kai tsaye. Yi rajista kyauta don farawa.",
  finder: "Ba ka san mazabarka ba? Yawancin mutane ba su sani ba. Nemo ta cikin daƙiƙa 30:",
  finalH2: "Mazabarka na jiranka. Ka zama wanda zai jagorance ta.",
  draft: true,
};

const ig: CareersText = {
  eyebrow: "Ọrụ TBH One · Nkeji 1 · Wọọdụ 8,809 · Emepere ntinye akwụkwọ",
  sub: "Obodo gị anọworị na-ele gị anya. Ugbu a, duo ya maka otu mmegharị na-ekwu otu ihe ma pụta ya: anyị agaghị ezu ohi ego unu.",
  h1: "Bụrụ Onye Ndu Wọọdụ TBH One: Duo Wọọdụ Gị, Nweta Ụgwọ Ọrụ Gị",
  intro:
    "TBH One na-achọ otu onye ndu wọọdụ maka wọọdụ ntuli aka ọ bụla n'ime 8,809 dị na Naịjirịa. Dịka onye ndu wọọdụ, ị ga-ahazi ndị ndu okporo ụzọ gị, kwado nzukọ obodo, rụọ ọrụ obodo ma chekwaa wọọdụ gị — a ga-akwụkwa gị ụgwọ maka ọrụ ị rụrụ, n'akaụntụ ụlọ akụ gị ma ọ bụ mobile-money. Isonye bụ n'efu. Debanye aha dịka onye otu, mezue ngwa ahụ ma bido site na Mọnde 16 Nọvemba.",
  primary: "Debanye Aha n'Efu ma Tinye Akwụkwọ",
  secondary: "Abụlarị m Onye Otu — Tinye Akwụkwọ",
  trust: "Enweghị ego. Ọ dịghị ụgwọ maka itinye akwụkwọ. TBH One agaghị ajụ gị ego maka ọkwa ọ bụla.",
  boostTitle: "Bulie ohere gị (ọ bụghị iwu):",
  boost: "Anyị na-ebute ụzọ ndị kwenyere n'ọhụụ anyị. Soro TBH One n'ikpo okwu 11 ma nweta Vision Points; lee ka Vision Meter gị si ejupụta. Debanye aha n'efu ka ịmalite.",
  finder: "Ị maghị wọọdụ gị? Ọtụtụ mmadụ amaghị. Chọta ya n'ime sekọnd 30:",
  finalH2: "Wọọdụ gị na-eche gị. Bụrụ onye ga-edu ya.",
  draft: true,
};

const all: Record<Locale, CareersText> = { en, pcm, yo, ha, ig };
export const careersText = (l: Locale) => all[l] ?? en;
