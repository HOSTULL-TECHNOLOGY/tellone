/**
 * Photographs of Nigerians in the movement: supporters, volunteers, events, communities.
 * Every section that uses this list (homepage "Faces of the movement", About, Join, Diaspora) is hidden while
 * it is empty, so the site never shows placeholder boxes.
 *
 * Add photos with scripts/add-photos.py, which resizes them into public/photos/ and prints the entries to
 * paste here. Use only photos the campaign owns or has licensed, with written consent from identifiable
 * people, because a campaign photo implies that person supports TBH One. Stock-photo licences usually
 * forbid that use.
 */
export type PeoplePhoto = {
  /** Base path without size or extension, e.g. "/photos/rally-enugu-01" (files: -480.webp, -960.webp, .jpg). */
  base: string;
  alt: string;
  caption?: string;
  /** Photographer or source, shown small under the photo. */
  credit?: string;
  /** Width / height of the original, for layout (e.g. 1.5 for 3:2). */
  ratio?: number;
  /** Internal note on rights and consent (never shown on the site). */
  rights?: string;
};

/**
 * Supplied by the client on 28 Oct 2026 for the preview. Rights must be cleared before launch: see each `rights` note.
 * Captions are neutral and describe the people the campaign is for. They do not claim anyone supports TBH One.
 */
export const peoplePhotos: PeoplePhoto[] = [
  {
    base: "/photos/01-market-trader-vegetables",
    alt: "A smiling woman in a black hijab and patterned wrapper selling fresh vegetables at a roadside market, with another trader beside her",
    caption: "Traders who keep our markets running",
    ratio: 0.8,
    rights: "Source and photographer unknown: confirm licence and consent before launch.",
  },
  {
    base: "/photos/02-fabric-trader-shop",
    alt: "A smiling woman in a blue patterned dress and headscarf holding up Ankara fabric in a textile shop",
    caption: "Small businesses, built on hard work",
    ratio: 0.667,
    rights: "ADOBE STOCK PREVIEW (#1148191656) with a visible watermark: license it from Adobe Stock or replace it before launch.",
  },
  {
    base: "/photos/03-young-professional",
    alt: "A smiling young man in a maroon sweater over a blue shirt, sitting at a desk",
    caption: "Young Nigerians ready to work",
    ratio: 1,
    rights: "Looks like a stock photo: confirm licence and model release before launch.",
  },
  {
    base: "/photos/04-nysc-corps-members",
    alt: "A cheerful group of NYSC corps members in white and green uniforms and orange boots, posing and waving",
    caption: "A generation serving the country",
    ratio: 0.803,
    rights: "NYSC corps members in uniform: NYSC rules bar corps members from partisan politics, so get NYSC and individual consent, or replace before launch. Source unknown.",
  },
  {
    base: "/photos/06-man-agbada-portrait",
    alt: "A smiling man in a light-blue agbada with embroidered trim and a green striped cap",
    caption: "Fathers, uncles, community leaders",
    ratio: 0.667,
    rights: "Looks like an official portrait, possibly of a public figure: confirm who he is and get consent before launch.",
  },
  {
    base: "/photos/07-elder-village-road",
    alt: "An elderly man in a grey jacket and leopard-print cap, arms folded, smiling on a red-earth road through green bush",
    caption: "Elders who have waited long enough",
    ratio: 0.667,
    rights: "Source and photographer unknown: confirm licence and consent before launch.",
  },
  {
    base: "/photos/08-schoolgirl-classroom",
    alt: "A smiling schoolgirl in an orange uniform with arms folded, in front of a classroom blackboard",
    caption: "Every child deserves a good school",
    ratio: 0.818,
    rights: "A MINOR in a school uniform with a visible crest (possibly not Nigerian): needs guardian consent; replacing it is recommended.",
  },
  {
    base: "/photos/09-teacher-whiteboard",
    alt: "A smiling teacher in a headscarf and headset microphone writing on a whiteboard",
    caption: "Teachers shaping the next generation",
    ratio: 0.679,
    rights: "The whiteboard text is French, so this is probably not a Nigerian photo: replace or confirm before launch. Source unknown.",
  },
  {
    base: "/photos/10-market-trader-snacks",
    alt: "A smiling market woman in a pink patterned dress and blue headscarf reaching over trays of bagged snacks at a busy market",
    caption: "The backbone of every market",
    ratio: 0.8,
    rights: "Photographer's mark (\u201cDexit Media\u201d): get the photographer's permission before launch.",
  },
];

/** Illustrative photo for the election and voter-information pages (not used as a "supporters" image). */
export const electionPhoto: PeoplePhoto = {
  base: "/photos/05-polling-unit-officials",
  alt: "Election officials at an open-air polling unit sorting and counting paper ballots on a table, with a ballot box in front and voters waiting in the background",
  caption: "Votes are sorted and counted in public at each polling unit",
  ratio: 1.777,
  rights: "Shows electoral officials: avoid any suggestion that INEC staff support a party. Source unknown: confirm licence before launch.",
};

/**
 * Careers pages (ward leaders): photos supplied by the client on 16 Nov 2026 for the careers pages only.
 * Before launch, confirm they are real photos the campaign owns, with consent from everyone identifiable.
 */
export const careersPhotos: PeoplePhoto[] = [
  { base: "/photos/20-careers-poster-provision-shop", alt: "A young man in a blue NDC T-shirt putting up a “We no go thief your money” poster on a provision shop door while the smiling shop owner holds the door", ratio: 1.339 },
  { base: "/photos/21-careers-poster-hair-salon", alt: "A young man in a blue NDC T-shirt and a smiling salon owner in an apron putting up a campaign poster on the glass door of a hair salon", ratio: 1.339 },
  { base: "/photos/22-careers-team-village-walk", alt: "Six smiling young volunteers walking through a village street with posters, a paste bucket and a brush, one holding up a “We no go thief your money” poster", ratio: 1.793 },
  { base: "/photos/23-careers-village-meeting", alt: "A young man in a blue T-shirt speaking from a wooden lectern to elders and young men seated on benches at an outdoor village meeting", ratio: 1.793 },
  { base: "/photos/24-careers-poster-roadside-salon", alt: "A young man in a blue campaign T-shirt and a woman in an Ankara apron putting up a campaign poster on the door of a roadside salon", ratio: 1.339 },
];
