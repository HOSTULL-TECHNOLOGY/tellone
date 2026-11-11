import type { Locale } from "@/lib/i18n";

/**
 * Campaign theme songs supplied by the TBH One team (artist credit in the files: danielizeghs).
 * File metadata declares every recording "made with Suno" (AI music), so each is labelled as AI-assisted
 * per PRD CR-3. Lyrics are copied verbatim from the files' embedded lyrics.
 */
export type Song = {
  slug: string;
  lang: Locale;
  langLabel: string;
  title: string;
  version: string | null;
  duration: number;
  src: string;
  srcLow: string;
  created: string;
  lyrics: string;
};

export const SONG_ARTIST = "danielizeghs";
export const SONG_AI_NOTE = "AI-assisted recording (Suno)";

export const songs: Song[] = [
  {
    "slug": "money-meant-for-all",
    "lang": "en",
    "langLabel": "English",
    "title": "Money Meant for All",
    "version": null,
    "duration": 184,
    "src": "/audio/money-meant-for-all-128.mp3",
    "srcLow": "/audio/money-meant-for-all-48.mp3",
    "created": "2026-10-14T01:56:28Z",
    "lyrics": "[Intro]\nEh-eh, everybody come along\nFor the people, for tomorrow\n[Verse 1]\nWhen the budget leaves the table, let the people see the gain\nBuild the roads and schools and clinics, let the harvest reach each lane\nEvery naira has a purpose, every promise has a name\nWe can turn the page together, build a country fair and straight\n[Pre-Chorus]\nHands together, voices rising\nLet the truth lead every choice\n[Chorus]\nWe will not steal your money\nWe no go thief your money\nMoney meant for all the people\nBuilds a future for the people\nA new Nigeria is possible\nNigeria will be OK with Obi/Kwamkwaso\nLet’s end corruption with Obi/Kwamkwaso\nWe will not steal your money\nWe no go thief your money\nWe will not steal your money\nWe no go thief your money\n[Verse 2]\nLet the funds become a classroom, let them bring a nurse nearby\nLet them open doors for workers, give the young a chance to try\nNo more taking what belongs to every mother, every child\nWith honest hands and open books, we’ll make the people proud\n[Pre-Chorus]\nHands together, voices rising\nLet the truth lead every choice\n[Chorus]\nWe will not steal your money\nWe no go thief your money\nMoney meant for all the people\nBuilds a future for the people\nA new Nigeria is possible\nNigeria will be OK with Obi/Kwamkwaso\nLet’s end corruption with Obi/Kwamkwaso\nWe will not steal your money\nWe no go thief your money\n[Bridge]\nFor the market, for the farmer\nFor the student, for the town\nKeep the people’s money working\nBuild the promise from the ground\n[Final Chorus]\nWe will not steal your money\nWe no go thief your money\nMoney meant for all the people\nBuilds a future for the people\nA new Nigeria is possible\nNigeria will be OK with Obi/Kwamkwaso\nLet’s end corruption with Obi/Kwamkwaso\nWe will not steal your money\nWe no go thief your money\n[Chorus]\nWe will not steal your money\nWe no go thief your money\nWe no go thief your money\n[Outro]\nA new Nigeria is possible\nTogether we can make it so"
  },
  {
    "slug": "we-no-go-thief-your-money-pidgin",
    "lang": "pcm",
    "langLabel": "Pidgin",
    "title": "We No Go Thief Your Money",
    "version": null,
    "duration": 175,
    "src": "/audio/we-no-go-thief-your-money-pidgin-128.mp3",
    "srcLow": "/audio/we-no-go-thief-your-money-pidgin-48.mp3",
    "created": "2026-10-14T02:25:54Z",
    "lyrics": "[Verse 1]\nDem dey talk say power sweet like honey\nDem dey promise heaven, but dem empty the treasury\nEvery four years na the same old story\nShouting change, but na the same old robbery\nMy people suffer for street, no be joke\nPromises wey dem make don turn to smoke\n[Chorus]\nWe no go thief your money o\nWe no go thief your money o\nThe wealth of the land na for everybody\nNa development we bring, no be poverty\nWe no go thief your money o\n[Verse 2]\nObi and Kwankwaso come with integrity\nNo more stealing, na transparency\nEvery kobo must to work for the citizen\nGood road, good job, no more negligence\nA new Nigeria is possible today\nIf we stand strong and we choose the right way\n[Chorus]\nWe no go thief your money o\nWe no go thief your money o\nThe wealth of the land na for everybody\nNa development we bring, no be poverty\nWe no go thief your money o\n[Bridge]\nNigeria will be ok with Obi, Kwankwaso\nLet's end corruption make we grow\nNo more looting of the public purse\nMake we turn around this generational curse\n[Chorus]\nWe no go thief your money o\nWe no go thief your money o\nThe wealth of the land na for everybody\nNa development we bring, no be poverty\nWe no go thief your money o\nWe no go thief your money o\n[Outro]\nA new Nigeria is possible\nObi and Kwankwaso\nWe no go thief your money o\n[Fade out]"
  },
  {
    "slug": "we-no-go-thief-your-money-v1",
    "lang": "pcm",
    "langLabel": "Pidgin & English",
    "title": "We No Go Thief Your Money",
    "version": "Version 1",
    "duration": 186,
    "src": "/audio/we-no-go-thief-your-money-v1-128.mp3",
    "srcLow": "/audio/we-no-go-thief-your-money-v1-48.mp3",
    "created": "2026-10-14T01:41:19Z",
    "lyrics": "[Intro]\nEh-eh, people first\nObi, Kwankwaso\nNDC, make we build am right\n[Verse 1]\nYou bring your trust, we hold am with two hands\nEvery naira gets a place in the plan\nRoad to the market, school for the town\nWater in the taps, let the clinics run\nNo backdoor deal, no pocket taking more\nWhat belongs to all comes back through the door\n[Pre-Chorus]\nFrom the farms to the city, let the good work show\nEvery seed of public money, let the people know\n[Chorus]\nWe will not steal your money\nWe no go thief your money\nWe go use am build the road\nKeep the school and clinic strong\nWe will not steal your money\nWe no go thief your money\nPeople’s work, people’s gain\nLet development reach every name\n[Verse 2]\nCount every project, let the figures be clear\nWhen the budget is spoken, the people can hear\nYoung hands learning, small businesses rise\nFair chance for every child under open skies\nWhen the harvest comes, let the whole town share\nPublic money working everywhere\n[Pre-Chorus]\nFrom the farms to the city, let the good work show\nEvery seed of public money, let the people know\n[Chorus]\nWe will not steal your money\nWe no go thief your money\nWe go use am build the road\nKeep the school and clinic strong\nWe will not steal your money\nWe no go thief your money\nPeople’s work, people’s gain\nLet development reach every name\n[Bridge]\nHands clean, books open\nPromises spoken, actions showing\nObi, Kwankwaso, hear the people call\nBuild for the many, leave no one small\n[Final Chorus]\nWe will not steal your money\nWe no go thief your money\nWe go use am build the road\nKeep the school and clinic strong\nWe will not steal your money\nWe no go thief your money\nPeople’s work, people’s gain\nLet development reach every name\n[Outro]\nPeople first, make the future bright\nHonest hands, do the work right\nWe no go thief your money\nWe go build for everybody"
  },
  {
    "slug": "we-no-go-thief-your-money-v2",
    "lang": "pcm",
    "langLabel": "Pidgin & English",
    "title": "We No Go Thief Your Money",
    "version": "Version 2",
    "duration": 208,
    "src": "/audio/we-no-go-thief-your-money-v2-128.mp3",
    "srcLow": "/audio/we-no-go-thief-your-money-v2-48.mp3",
    "created": "2026-10-14T01:41:19Z",
    "lyrics": "[Intro]\nEh-eh, people first\nObi, Kwankwaso\nNDC, make we build am right\n[Verse 1]\nYou bring your trust, we hold am with two hands\nEvery naira gets a place in the plan\nRoad to the market, school for the town\nWater in the taps, let the clinics run\nNo backdoor deal, no pocket taking more\nWhat belongs to all comes back through the door\n[Pre-Chorus]\nFrom the farms to the city, let the good work show\nEvery seed of public money, let the people know\n[Chorus]\nWe will not steal your money\nWe no go thief your money\nWe go use am build the road\nKeep the school and clinic strong\nWe will not steal your money\nWe no go thief your money\nPeople’s work, people’s gain\nLet development reach every name\n[Verse 2]\nCount every project, let the figures be clear\nWhen the budget is spoken, the people can hear\nYoung hands learning, small businesses rise\nFair chance for every child under open skies\nWhen the harvest comes, let the whole town share\nPublic money working everywhere\n[Pre-Chorus]\nFrom the farms to the city, let the good work show\nEvery seed of public money, let the people know\n[Chorus]\nWe will not steal your money\nWe no go thief your money\nWe go use am build the road\nKeep the school and clinic strong\nWe will not steal your money\nWe no go thief your money\nPeople’s work, people’s gain\nLet development reach every name\n[Bridge]\nHands clean, books open\nPromises spoken, actions showing\nObi, Kwankwaso, hear the people call\nBuild for the many, leave no one small\n[Final Chorus]\nWe will not steal your money\nWe will not steal your money\nWe no go thief your money\nWe go use am build the road\nKeep the school and clinic strong\nWe will not steal your money\nWe no go thief your money\nPeople’s work, people’s gain\nLet development reach every name\n[Outro]\nPeople first, make the future bright\nHonest hands, do the work right\nWe no go thief your money\nWe go build for everybody\nWe go build for everybody"
  },
  {
    "slug": "a-ki-i-ji-owo-yin",
    "lang": "yo",
    "langLabel": "Yorùbá",
    "title": "A Kí Í Jí Owó Yín",
    "version": null,
    "duration": 154,
    "src": "/audio/a-ki-i-ji-owo-yin-128.mp3",
    "srcLow": "/audio/a-ki-i-ji-owo-yin-48.mp3",
    "created": "2026-10-14T02:14:10Z",
    "lyrics": "[Intro]\nẸ gbọ́, ẹ gbọ́, ará wa\nỌ̀nà tuntun ń bẹ fún wa\n[Verse 1]\nOwó gbogbo tí a kó jọ\nKí ó ṣiṣẹ́ fún àwùjọ\nKí ilé-ẹ̀kọ́ lè dára\nKí ilé-iwòsàn lè péye\nKí ọ̀nà wa lè rọrùn\nKí iṣẹ́ wà fún ọdọ́ wa\n[Pre-Chorus]\nA ò ní jí owó yín\nA ó lò ó fún ìdàgbàsókè\nA ò ní jí owó yín\nÈso rẹ̀ yóò dé ọ̀dọ̀ gbogbo ènìyàn\n[Chorus]\nA kì í jí owó yín, a kì í jí owó yín\nWe no go thief your money, a kì í jí owó yín\nNàìjíríà tuntun ṣeé ṣe\nNàìjíríà yóò dára pẹ̀lú Obi àti Kwankwaso\nẸ jẹ́ ká fòpin sí ìwà ìbàjẹ́\nPẹ̀lú Obi àti Kwankwaso, ẹ jẹ́ ká ṣiṣẹ́ pọ̀\n[Verse 2]\nObi àti Kwankwaso, ẹ gbọ́ ìpè wa\nKí owó ènìyàn ṣiṣẹ́ fún ènìyàn\nKí iṣẹ́-ọ̀nà dé gbogbo agbègbè\nKí àgbẹ̀ rí àtìlẹ́yìn tó yẹ\nKí ọdọ́ rí iṣẹ́, kí ìrètí tún padà\nKí ìdàgbàsókè dé ilé gbogbo wa\n[Call and Response]\nOlórí: Ta ni owó yìí jẹ́?\nGbogbo: Ti àwọn ènìyàn!\nOlórí: Kí la ó fi ṣe?\nGbogbo: Ìdàgbàsókè!\nOlórí: A ó jí owó yín?\nGbogbo: Rárá o, rárá!\nOlórí: Nàìjíríà tuntun ṣeé ṣe?\nGbogbo: Ó ṣeé ṣe, ó ṣeé ṣe!\n[Chorus]\nA kì í jí owó yín, a kì í jí owó yín\nWe no go thief your money, a kì í jí owó yín\nNàìjíríà tuntun ṣeé ṣe\nNàìjíríà yóò dára pẹ̀lú Obi àti Kwankwaso\nẸ jẹ́ ká fòpin sí ìwà ìbàjẹ́\nPẹ̀lú Obi àti Kwankwaso, ẹ jẹ́ ká ṣiṣẹ́ pọ̀\n[Outro]\nOwó fún ènìyàn, iṣẹ́ fún ilẹ̀ wa\nÌwà títọ́, ìdàgbàsókè fún gbogbo wa\nNàìjíríà tuntun ṣeé ṣe\nObi àti Kwankwaso, ká lọ síwájú!"
  },
  {
    "slug": "kudin-jamaa",
    "lang": "ha",
    "langLabel": "Hausa",
    "title": "Kuɗin Jama'a",
    "version": null,
    "duration": 187,
    "src": "/audio/kudin-jamaa-128.mp3",
    "srcLow": "/audio/kudin-jamaa-48.mp3",
    "created": "2026-10-14T02:17:12Z",
    "lyrics": "[Intro]\nEh, jama'a ku zo, mu tashi tare\nSabuwar Najeriya, za ta yiwu\n[Verse 1]\nKuɗin jama'a, amana ce mai girma\nA yi hanya, asibiti, makaranta\nAikin matasa, noma ya bunƙasa\nAbin da aka tanada ya koma ga kowa\n[Pre-Chorus]\nGaskiya a gaba, ci gaba a hanya\nMu haɗa hannu, mu gyara ƙasa\n[Chorus]\nBa za mu sace kuɗinku ba\nWe no go thief your money\nKuɗin jama'a don amfanin jama'a\nWe no go thief your money\nSabuwar Najeriya mai yiwuwa ce\nNajeriya za ta yi kyau da Obi/Kwamkwaso\nMu kawo ƙarshen cin hanci da Obi/Kwamkwaso\n[Verse 2]\nIdan an samu kuɗi, a gina asibiti\nA kawo ruwa, wutar lantarki\nHanyoyi su haɗa ƙauye da gari\nCi gaban nan ya shafi kowa da kowa\n[Pre-Chorus]\nGaskiya a gaba, ci gaba a hanya\nMu haɗa hannu, mu gyara ƙasa\n[Chorus]\nBa za mu sace kuɗinku ba\nWe no go thief your money\nKuɗin jama'a don amfanin jama'a\nWe no go thief your money\nSabuwar Najeriya mai yiwuwa ce\nNajeriya za ta yi kyau da Obi/Kwamkwaso\nMu kawo ƙarshen cin hanci da Obi/Kwamkwaso\n[Bridge]\nA'a da rashawa, eh ga gaskiya\nA'a da almundahana, eh ga ci gaba\nKuɗinmu ya koma ga makaranta\nKuɗinmu ya koma ga lafiya\n[Final Chorus]\nBa za mu sace kuɗinku ba\nWe no go thief your money\nSabuwar Najeriya mai yiwuwa ce\nNajeriya za ta yi kyau da Obi/Kwamkwaso\nMu kawo ƙarshen cin hanci da Obi/Kwamkwaso\nKuɗin jama'a don amfanin jama'a\nWe no go thief your money\n[Outro]\nGaskiya da aiki, mu tashi tare\nSabuwar Najeriya, za ta yiwu"
  },
  {
    "slug": "obi-na-kwankwaso",
    "lang": "ig",
    "langLabel": "Igbo",
    "title": "Obi na Kwankwaso",
    "version": null,
    "duration": 215,
    "src": "/audio/obi-na-kwankwaso-128.mp3",
    "srcLow": "/audio/obi-na-kwankwaso-48.mp3",
    "created": "2026-10-14T02:22:20Z",
    "lyrics": "[Intro]\nNdị mmadụ, unu nụ\nKa anyị wuo ala ọma\n[Verse 1]\nEgo ndị mmadụ abụghị nke onye\nA ga-eji ya rụọ ụlọ ọgwụ na ụzọ\nA ga-akụziri ụmụaka akwụkwọ\nKa ọrụ ọma too n’ala anyị\n[Pre-Chorus]\nObi na Kwankwaso, anyị na-achọ eziokwu\nỌchịchị ga-eje ozi, ọ bụghị izu ohi\nKa onye ọ bụla hụ uru nke ego ya\nKa mmepe ruo obodo niile\n[Chorus]\nAnyị agaghị ezu ego unu\nAnyị agaghị ezu ego unu\nWe no go thief your money\nWe no go thief your money\nObi na Kwankwaso, Naịjirịa ga-adị mma\nObi na Kwankwaso, Naịjirịa ga-adị mma\n[Verse 2]\nEgo e nyere maka ndị mmadụ\nKa ọ gaa n’ọrụ ga-abara ha uru\nMmiri dị ọcha, ọrụ, na ụlọ ọgwụ\nKa mmepe ruo n’ụlọ onye ọ bụla\n[Pre-Chorus]\nKa anyị kwụsị nrụrụ aka taa\nKa onye ndu bụrụ enyi ndị mmadụ\nEzi ọchịchị ga-eweta olileanya\nỌdịnihu anyị dị n’aka anyị\n[Chorus]\nAnyị agaghị ezu ego unu\nAnyị agaghị ezu ego unu\nWe no go thief your money\nWe no go thief your money\nObi na Kwankwaso, Naịjirịa ga-adị mma\nObi na Kwankwaso, Naịjirịa ga-adị mma\n[Bridge]\nNaịjirịa ọhụrụ ga-ekwe omume\nNaịjirịa ọhụrụ ga-ekwe omume\nKa anyị kwụsị nrụrụ aka\nKa anyị kwụsị nrụrụ aka\nSoro Obi na Kwankwaso\nKa ego ndị mmadụ wuo ala\n[Final Chorus]\nAnyị agaghị ezu ego unu\nAnyị agaghị ezu ego unu\nWe no go thief your money\nWe no go thief your money\nKa anyị kwụsị nrụrụ aka na Obi na Kwankwaso\nNaịjirịa ga-adị mma na Obi na Kwankwaso\nNaịjirịa ọhụrụ ga-ekwe omume\nKa mmepe ruo onye ọ bụla\n[Outro]\nEzi ọchịchị, mmepe maka mmadụ\nObi na Kwankwaso, anyị ga-aga n’ihu"
  }
];

/** The first song in the visitor's language, falling back to Pidgin. */
export function defaultSong(locale: Locale): Song {
  return songs.find((s) => s.lang === locale) ?? songs.find((s) => s.lang === "pcm")!;
}

export const songLabel = (s: Song) => `${s.title}${s.version ? ` (${s.version})` : ""}`;
