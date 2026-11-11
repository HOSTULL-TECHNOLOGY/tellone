/**
 * WhatsApp message templates for the Tools page. English is the approved source; the other four
 * languages are first drafts pending review by the TBH One translator pool (PRD L10N), and are labelled so.
 */
export type MsgLang = "en" | "pcm" | "yo" | "ha" | "ig";
export type MsgPurpose = "tell" | "bring" | "help";

export const msgLangs: { code: MsgLang; label: string }[] = [
  { code: "en", label: "English" },
  { code: "pcm", label: "Nigerian Pidgin" },
  { code: "yo", label: "Yorùbá" },
  { code: "ha", label: "Hausa" },
  { code: "ig", label: "Igbo" },
];

export const msgPurposes: { code: MsgPurpose; label: string; hint: string }[] = [
  { code: "tell", label: "Tell One — family at home", hint: "For Nigerians abroad writing to a relative." },
  { code: "bring", label: "Bring One — a friend on the fence", hint: "For a friend who has not decided or has not registered." },
  { code: "help", label: "Help One — a community project", hint: "Invite someone to fund or support a local project." },
];

/** {name} is replaced with the recipient's name. */
export const messages: Record<MsgLang, Record<MsgPurpose, string>> = {
  en: {
    tell: "Hello {name}, I have been thinking about home. On Saturday 16 January 2027 we choose a president. I am backing Peter Obi and Rabiu Musa Kwankwaso because they have promised: we will not steal your money. Please make sure your PVC is ready, and vote. It matters to all of us.",
    bring: "{name}, I know you are still deciding. Give me five minutes. Obi and Kwankwaso are running on one simple promise: we will not steal your money. Less stealing means more jobs, better roads and light. Have you collected your PVC? Let us go and vote together on 16 January 2027.",
    help: "Hi {name}, our community is raising funds for a TBH One project you can track to the last naira. Every donation is published and every finished project has proof. Join free and chip in what you can. We will not steal your money.",
  },
  pcm: {
    tell: "{name}, how body? On Saturday 16 January 2027 we go choose president. I dey with Peter Obi and Rabiu Musa Kwankwaso because dem don promise: we no go thief your money. Abeg make sure say your PVC ready, and go vote. E concern all of us.",
    bring: "{name}, I know say you never decide. Give me five minutes. Obi and Kwankwaso get one promise: we no go thief your money. If dem no thief, we go get work, better road and light. You don collect your PVC? Make we go vote together on 16 January 2027.",
    help: "{name}, our community dey gather money for one TBH One project wey you fit track reach the last naira. Every money dey published and every finished project get proof. Join free and drop wetin you fit. We no go thief your money.",
  },
  yo: {
    tell: "{name}, ẹ n lẹ o. Ní Ọjọ́ Àbámẹ́ta, 16 Oṣù Kínní 2027, a ó yan ààrẹ. Mo wà lẹ́yìn Peter Obi àti Rabiu Musa Kwankwaso nítorí wọ́n ti ṣèlérí pé: a ò ní jí owó yín. Ẹ jọ̀ọ́, ẹ rí i dájú pé káàdì ìdìbò (PVC) yín ti ṣetán, kí ẹ sì dìbò.",
    bring: "{name}, mo mọ̀ pé o kò tíì pinnu. Fún mi ní ìṣẹ́jú márùn-ún. Obi àti Kwankwaso ní ìlérí kan: a ò ní jí owó yín. Bí wọn kò bá jí owó, iṣẹ́ á pọ̀ sí i, ọ̀nà á dára, iná á wà. Ṣé o ti gba PVC rẹ? Jẹ́ ká jọ lọ dìbò ní 16 Oṣù Kínní 2027.",
    help: "{name}, àdúgbò wa ń kówó jọ fún iṣẹ́ àkànṣe TBH One tí o lè tọpa dé naira tó kẹ́yìn. Gbogbo owó ni a ń gbé jáde, gbogbo iṣẹ́ tó parí sì ní ẹ̀rí. Darapọ̀ lọ́fẹ̀ẹ́, kí o sì ṣe ohun tí o lè ṣe. A ò ní jí owó yín.",
  },
  ha: {
    tell: "{name}, ina kwana? A ranar Asabar 16 ga Janairu 2027 za mu zaɓi shugaban ƙasa. Ina goyon bayan Peter Obi da Rabiu Musa Kwankwaso saboda sun yi alƙawari: ba za mu saci kuɗinku ba. Don Allah ka tabbatar katin zaɓenka (PVC) ya shirya, ka je ka yi zaɓe.",
    bring: "{name}, na san har yanzu ba ka yanke shawara ba. Ba ni minti biyar. Obi da Kwankwaso suna da alƙawari ɗaya: ba za mu saci kuɗinku ba. Idan ba a sata ba, za a sami aiki, hanyoyi masu kyau da wutar lantarki. Ka karɓi PVC ɗinka? Mu je mu yi zaɓe tare a ranar 16 ga Janairu 2027.",
    help: "{name}, al'ummarmu tana tara kuɗi don wani aikin TBH One da za ka iya bibiya har zuwa naira ta ƙarshe. Ana wallafa kowace gudummawa, kuma kowane aikin da aka kammala yana da shaida. Shiga kyauta ka bayar da abin da za ka iya. Ba za mu saci kuɗinku ba.",
  },
  ig: {
    tell: "{name}, kedu? Na Satọdee 16 Jenụwarị 2027 anyị ga-ahọpụta onye isi ala. Ana m akwado Peter Obi na Rabiu Musa Kwankwaso n'ihi na ha kwere nkwa: anyị agaghị ezu ohi ego unu. Biko hụ na kaadị ntuli aka gị (PVC) dị njikere, ma gaa tụọ vootu.",
    bring: "{name}, amaara m na ị ka na-eche echiche. Nye m nkeji ise. Obi na Kwankwaso nwere otu nkwa: anyị agaghị ezu ohi ego unu. Ọ bụrụ na ezughị ohi, ọrụ ga-adị, ụzọ ga-aka mma, ọkụ ga-adị. Ị natala PVC gị? Ka anyị jikọọ gaa tụọ vootu na 16 Jenụwarị 2027.",
    help: "{name}, obodo anyị na-achịkọta ego maka ọrụ TBH One ị nwere ike soro ruo naira ikpeazụ. A na-ebipụta onyinye ọ bụla, ọrụ ọ bụla emechara nwekwara ihe akaebe. Sonye n'efu ma nye ihe ị nwere ike. Anyị agaghị ezu ohi ego unu.",
  },
};

export const talkingPoints = [
  { h: "The promise", p: "We will not steal your money. Everything else — jobs, security, power, roads, schools — depends on keeping it." },
  { h: "The ticket", p: "Peter Obi for president and Rabiu Musa Kwankwaso for vice president, on the NDC ticket, named on 30 May 2026." },
  { h: "The date", p: "Presidential and National Assembly elections are on Saturday 16 January 2027. Campaigning ends at 11:59 pm on Thursday 14 January." },
  { h: "The proof", p: "TBH One publishes where every naira goes. Projects are funded by citizens and documented with photos and receipts when delivered." },
  { h: "The ask", p: "Collect your PVC, bring one friend who has not decided, and vote together. Never share your PVC number or photograph your ballot." },
];
