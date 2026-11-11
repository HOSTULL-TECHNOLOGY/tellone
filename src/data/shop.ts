/**
 * TBH One Shop catalogue and rules (PRD §17). DEMO prices and stock — replace with the Merch lead's
 * approved list. Rules (member price, bulk tiers, coupons, delivery zones, cut-off) follow the PRD exactly.
 */
import { campaignDates } from "@/config/site";

export type ProductCategory = "T-shirts" | "Caps" | "Key holders" | "Wristbands" | "Banners" | "Stickers" | "Packs" | "Hoodies" | "Bags";
export type ProductImage = { src: string; alt: string };
/** Responsive sources for a product photo in /public/shop: `<base>-480.webp`, `<base>-900.webp`, `<base>-900.jpg`. */
export const photoSources = (src: string) => {
  const base = src.replace(/-900\.(jpg|webp)$/, "");
  return { webp480: `${base}-480.webp`, webp900: `${base}-900.webp`, jpg: `${base}-900.jpg` };
};
export type Product = {
  slug: string;
  name: string;
  category: ProductCategory;
  price: number; // public price, ₦ incl. VAT
  sizes?: string[];
  colours?: string[];
  stock: number; // total units available (demo)
  lowStockAt?: number;
  vendor: string;
  description: string;
  details: string[];
  bestSeller?: boolean;
  popularIn?: string[]; // states where it sells most ("popular in your state", EC-3)
  packOf?: number; // ready-made packs
  designApproved: true; // EC-28: only approved designs are listed
  images?: ProductImage[]; // client-supplied product renders; the first is the main photo
  series?: ProductSeries; // a named collection shown as a filter, e.g. the tagline in five languages
};
export type ProductSeries = "Language series";
export const productSeries: ProductSeries[] = ["Language series"];

export const VENDORS = ["Ankara Prints Ltd (Lagos)", "Kano Textile Works", "Aba Garment Cluster", "Northern Promo Supplies (Kaduna)"];

export const products: Product[] = [
  { slug: "tbh-one-tagline-t-shirt", name: "‘We will not steal your money’ T-shirt", category: "T-shirts", price: 8000, sizes: ["S", "M", "L", "XL", "XXL"], colours: ["White"], stock: 1840, lowStockAt: 100, vendor: VENDORS[2], description: "White T-shirt printed #WWNSYM — We Will Not Steal Your Money — with the letter key under the hashtag. English edition of the Language series.", details: ["100% cotton, 180 gsm", "Screen-printed, wash at 30°C", "Made in Aba"], bestSeller: true, popularIn: ["Lagos", "Enugu", "Anambra"], designApproved: true, series: "Language series", images: [{ src: "/shop/tshirt-wwnsym-english-900.jpg", alt: "White T-shirt printed with the hashtag #WWNSYM and, beneath it, the key spelling out We Will Not Steal Your Money" }] },
  { slug: "tagline-t-shirt-pidgin", name: "‘We no go thief your money’ T-shirt", category: "T-shirts", price: 8000, sizes: ["S", "M", "L", "XL", "XXL"], colours: ["White"], stock: 960, vendor: VENDORS[2], description: "White T-shirt with the Pidgin tagline, We No Go Thief Your Money, and the letter key at the bottom left. Part of the Language series. The sample shown uses the earlier print (#WNGTUM, ‘Una’); the next print run reads #WNGTYM, ‘Your’.", details: ["100% cotton, 180 gsm", "Screen-printed", "Made in Aba"], popularIn: ["Rivers", "Delta", "Lagos"], designApproved: true, series: "Language series", images: [{ src: "/shop/tshirt-wngtum-pidgin-900.jpg", alt: "White T-shirt printed with the hashtag #WNGTUM, with the key We No Go Thief Una Money at the bottom left" }] },
  { slug: "tagline-t-shirt-hausa", name: "‘Ba za mu saci kuɗinku ba’ T-shirt", category: "T-shirts", price: 8000, sizes: ["S", "M", "L", "XL", "XXL"], colours: ["White", "Green"], stock: 1200, vendor: VENDORS[1], description: "The tagline in Hausa — Ba za mu saci kuɗinku ba, ‘We will not steal your money’ — with the TBH One logo. Part of the Language series.", details: ["100% cotton", "Screen-printed", "Made in Kano"], bestSeller: true, popularIn: ["Kano", "Kaduna", "Katsina"], designApproved: true, series: "Language series", images: [{ src: "/shop/mockup-tshirt-hausa-900.jpg", alt: "Design mockup: white T-shirt printed with the TBH One logo and the Hausa tagline Ba za mu saci kuɗinku ba" }] },
  { slug: "tagline-t-shirt-yoruba", name: "‘A ò ní jí owó yín’ T-shirt", category: "T-shirts", price: 8000, sizes: ["S", "M", "L", "XL", "XXL"], colours: ["White"], stock: 780, vendor: VENDORS[0], description: "White T-shirt printed #AONJOY — A ò ní jí owó yín, Yorùbá for ‘We will not steal your money’ — with the key in full tone marks. Part of the Language series.", details: ["100% cotton", "Screen-printed", "Made in Lagos"], popularIn: ["Oyo", "Ogun", "Lagos"], designApproved: true, series: "Language series", images: [{ src: "/shop/tshirt-aonjoy-yoruba-900.jpg", alt: "White T-shirt printed with the hashtag #AONJOY and the key A ò ní jí owó yín, Yorùbá for We will not steal your money" }] },
  { slug: "tagline-t-shirt-igbo", name: "‘Anyị agaghị ezu ohi ego unu’ T-shirt", category: "T-shirts", price: 8000, sizes: ["S", "M", "L", "XL", "XXL"], colours: ["White"], stock: 640, vendor: VENDORS[2], description: "White T-shirt printed #AAEOEU — Anyị agaghị ezu ohi ego unu, Igbo for ‘We will not steal your money’ — with the letter key. Part of the Language series.", details: ["100% cotton", "Screen-printed", "Made in Aba"], popularIn: ["Anambra", "Imo", "Enugu"], designApproved: true, series: "Language series", images: [{ src: "/shop/tshirt-aaeoeu-igbo-900.jpg", alt: "White T-shirt printed with the hashtag #AAEOEU and the key Anyị agaghị ezu ohi ego unu, Igbo for We will not steal your money" }] },
  { slug: "tbh-one-cap", name: "TBH One cap", category: "Caps", price: 5500, colours: ["White", "Black"], sizes: ["One size"], stock: 420, lowStockAt: 50, vendor: VENDORS[3], description: "Six-panel cap with ‘We no go thief your money’ across the front: green and red lettering on white, or white and red on black. Adjustable strap.", details: ["Raised print lettering", "Adjustable strap", "Made in Kaduna"], bestSeller: true, designApproved: true, images: [{ src: "/shop/cap-we-no-go-thief-your-money-900.jpg", alt: "Two TBH One caps side by side: a white cap with ‘We no go thief your money’ in green and red, and a black cap with the same words in white and red" }] },
  { slug: "polo-we-no-go-thief-your-money", name: "‘We no go thief your money’ polo shirt", category: "T-shirts", price: 12000, sizes: ["S", "M", "L", "XL", "XXL"], colours: ["White"], stock: 520, lowStockAt: 60, vendor: VENDORS[2], description: "White piqué polo shirt with ‘We no go thief your money’ lettered in green and red on the front.", details: ["Cotton piqué, three-button placket", "Printed lettering, wash at 30°C", "Made in Aba"], popularIn: ["Lagos", "Rivers", "FCT"], designApproved: true, images: [{ src: "/shop/polo-we-no-go-thief-your-money-900.jpg", alt: "White polo shirt with ‘We no go thief your money’ printed in green and red lettering across the chest" }] },
  { slug: "hoodie-the-nigeria-we-want", name: "‘The Nigeria We Want’ hoodie", category: "Hoodies", price: 22000, sizes: ["S", "M", "L", "XL", "XXL"], colours: ["Black"], stock: 340, lowStockAt: 40, vendor: VENDORS[1], description: "Black pullover hoodie. Front: the TBH One logo and ‘The Nigeria We Want’. Back: Good Road, Housing For All, Secure Nation, Clean Water For Everyone.", details: ["Brushed fleece, kangaroo pocket", "Printed front and back", "Made in Kano"], bestSeller: true, popularIn: ["FCT", "Kano", "Lagos"], designApproved: true, images: [{ src: "/shop/hoodie-nigeria-we-want-front-900.jpg", alt: "Front of a black hoodie with the TBH One logo and the words ‘The Nigeria We Want’" }, { src: "/shop/hoodie-nigeria-we-want-back-900.jpg", alt: "Back of the black hoodie listing Good Road, Housing For All, Secure Nation and Clean Water For Everyone" }] },
  { slug: "hoodie-i-vote-for-this", name: "‘I vote for this’ hoodie", category: "Hoodies", price: 22000, sizes: ["S", "M", "L", "XL", "XXL"], colours: ["White"], stock: 280, lowStockAt: 40, vendor: VENDORS[0], description: "White pullover hoodie with ‘I vote for this’ and fingerprint-style portraits of the candidates.", details: ["Brushed fleece, kangaroo pocket", "Full-colour front print", "Made in Lagos"], popularIn: ["Lagos", "Oyo", "Enugu"], designApproved: true, images: [{ src: "/shop/hoodie-i-vote-for-this-900.jpg", alt: "White hoodie printed with ‘I vote for this’ above fingerprint-style portraits of the TBH One candidates" }] },
  { slug: "tote-obi-kwankwaso-2027", name: "‘Obi/Kwankwaso 2027’ tote bag", category: "Bags", price: 6500, sizes: ["One size"], colours: ["Black"], stock: 450, lowStockAt: 50, vendor: VENDORS[0], description: "Black canvas tote with ‘OBI/KWANKWASO 2027’ in white, underlined in red inside a red and white frame.", details: ["Heavy cotton canvas", "Long shoulder handles", "Made in Lagos"], popularIn: ["Lagos", "Kano", "FCT"], designApproved: true, images: [{ src: "/shop/tote-obi-kwankwaso-2027-900.jpg", alt: "Black tote bag printed OBI/KWANKWASO 2027 in white with a red underline, inside a red and white rectangular frame" }] },
  { slug: "tbh-one-key-holder", name: "TBH One key holder", category: "Key holders", price: 1500, stock: 3100, vendor: VENDORS[3], description: "Enamel speech-bubble key holder in the logo colours.", details: ["Metal with enamel fill", "Split ring"], designApproved: true, images: [{ src: "/shop/mockup-key-holder-900.jpg", alt: "Design mockup: speech-bubble key holder with the TBH One logo in a green frame on a metal ring" }] },
  { slug: "tbh-one-wristband-5-pack", name: "Wristbands, pack of 5", category: "Wristbands", price: 2500, stock: 38, lowStockAt: 50, vendor: VENDORS[3], description: "Silicone wristbands with #WeWillNotStealYourMoney.", details: ["Five bands, one size", "Debossed hashtag"], designApproved: true, images: [{ src: "/shop/mockup-wristbands-900.jpg", alt: "Design mockup: five silicone wristbands in green, red, white, black and light green, each printed #WeWillNotStealYourMoney" }] },
  { slug: "street-banner-3m", name: "Street banner (3 m)", category: "Banners", price: 18000, stock: 210, vendor: VENDORS[0], description: "Weatherproof flex banner with eyelets for gates and streets.", details: ["3 m × 1 m flex", "Brass eyelets every 50 cm"], designApproved: true, images: [{ src: "/shop/mockup-street-banner-900.jpg", alt: "Design mockup: green 3-metre street banner between two poles with the TBH One logo, We Will Not Steal Your Money and the hashtag" }] },
  { slug: "sticker-sheet", name: "Sticker sheet (20 stickers)", category: "Stickers", price: 1200, stock: 5400, vendor: VENDORS[0], description: "Waterproof vinyl stickers: logo, tagline in five languages and both hashtags.", details: ["A5 sheet, 20 stickers", "Outdoor vinyl"], designApproved: true, images: [{ src: "/shop/mockup-sticker-sheet-900.jpg", alt: "Design mockup: sheet of 20 stickers with the logo, the tagline in five languages, T, B and H, and the hashtags" }] },
  { slug: "ward-starter-pack-50", name: "Ward starter pack (50 T-shirts)", category: "Packs", price: 400000, packOf: 50, stock: 60, vendor: VENDORS[2], description: "50 tagline T-shirts in mixed sizes for a ward team. Bulk pricing already applied at checkout.", details: ["50 T-shirts, mixed sizes", "Pickup at a ward-leader hub available"], designApproved: true, images: [{ src: "/shop/mockup-ward-starter-pack-900.jpg", alt: "Design mockup: a stack of folded tagline T-shirts with a ×50 badge and the TBH One logo" }] },
  { slug: "event-pack-200", name: "Event pack (200 items)", category: "Packs", price: 640000, packOf: 200, stock: 25, vendor: VENDORS[3], description: "100 T-shirts, 50 caps and 50 wristband packs for a rally or village meeting.", details: ["Mixed items for events", "Dispatch within 48 hours"], designApproved: true, images: [{ src: "/shop/mockup-event-pack-900.jpg", alt: "Design mockup: a box with a tagline T-shirt and caps, labelled 100 T-shirts, 50 caps and 50 wristband packs" }] },
];

export const productBySlug = (s: string) => products.find((p) => p.slug === s);
export const categories: ProductCategory[] = ["T-shirts", "Hoodies", "Caps", "Bags", "Key holders", "Wristbands", "Banners", "Stickers", "Packs"];

/** EC-6: members see a member price automatically, default 10% below public. */
export const MEMBER_DISCOUNT = 0.1;
export const memberPrice = (p: number) => Math.round(p * (1 - MEMBER_DISCOUNT));

/** EC-4: 15% off from 50 items, 20% off from 200 items. */
export function bulkRate(totalQty: number) {
  if (totalQty >= 200) return 0.2;
  if (totalQty >= 50) return 0.15;
  return 0;
}

/** EC-13: VAT at the prevailing Nigerian rate (7.5% at time of writing; confirm with Finance + tax adviser). Prices include VAT. */
export const VAT_RATE = 0.075;

/** EC-19: delivery by zone; free above ₦20,000. Fees are DEMO until the Merch lead sets them. */
export const FREE_DELIVERY_FROM = 20000;
export const deliveryZones = [
  { key: "lagos-abuja", label: "Lagos and Abuja", days: "1–3 working days", fee: 2000, states: ["Lagos", "FCT"] },
  { key: "capitals", label: "Other state capitals", days: "3–5 working days", fee: 3500, states: [] as string[] },
  { key: "elsewhere", label: "Elsewhere in Nigeria", days: "5–7 working days", fee: 5000, states: [] as string[] },
  { key: "pickup", label: "Free pickup at a ward-leader hub", days: "Ready in 2–4 working days", fee: 0, states: [] as string[] },
];

/** EC-7 coupons (demo set). No coupon may reference voting, PVCs or polling units (EC-10). */
export type Coupon = { code: string; label: string; type: "percent" | "fixed" | "free-delivery" | "reward-item"; value: number; membersOnly: boolean; minOrder?: number; expires: string; scope?: string };
export const coupons: Coupon[] = [
  { code: "TBHWEEK1", label: "10% off caps and wristbands this week", type: "percent", value: 10, membersOnly: true, expires: "2026-11-16", scope: "Caps, Wristbands" },
  { code: "WELCOME500", label: "₦500 off your first order over ₦5,000", type: "fixed", value: 500, membersOnly: true, minOrder: 5000, expires: "2027-01-14" },
  { code: "POINTS500", label: "Impact Points reward: ₦500 off", type: "fixed", value: 500, membersOnly: true, expires: "2027-01-14" },
  { code: "POINTS1000", label: "Impact Points reward: free delivery", type: "free-delivery", value: 0, membersOnly: true, expires: "2027-01-14" },
];

/** EC-8: Impact Points → coupons. */
export const pointsRewards = [
  { points: 500, label: "₦500 off", code: "POINTS500" },
  { points: 1000, label: "Free delivery", code: "POINTS1000" },
  { points: 2500, label: "Free TBH One T-shirt", code: "POINTS2500" },
];

/** EC-9: partner vendor offers, redeemed in store by unique code or QR. DEMO partners. */
export const partnerOffers = [
  { id: "off-1", partner: "Mama Put Kitchen, Yaba", category: "Food", offer: "10% off meals on weekdays", area: "Lagos", expires: "2027-01-14" },
  { id: "off-2", partner: "Sharp Cuts Barbers, Wuse II", category: "Grooming", offer: "₦500 off any haircut", area: "FCT", expires: "2026-12-31" },
  { id: "off-3", partner: "Kano Phone Accessories, Farm Centre", category: "Electronics", offer: "15% off chargers and cases", area: "Kano", expires: "2026-12-31" },
  { id: "off-4", partner: "Ọmọ Ọba Printing, Ibadan", category: "Printing", offer: "20% off flyers for members' businesses", area: "Oyo", expires: "2027-01-14" },
  { id: "off-5", partner: "Aba Shoe Makers Co-op", category: "Fashion", offer: "₦2,000 off handmade shoes", area: "Abia", expires: "2026-12-31" },
];

/** EC-17 order states. */
export const ORDER_STATES = ["Paid", "Sent to vendor", "Packed", "Dispatched", "Out for delivery", "Delivered"] as const;
export type OrderState = (typeof ORDER_STATES)[number] | "Cancelled" | "Return requested" | "Refunded";

/** EC-25: after the campaign cut-off, promotions stop; new orders dispatch from 17 Jan 2027. */
export const shopPromotionsOpen = (now = new Date()) => now < campaignDates.campaignCutoff;
export const dispatchHeld = (now = new Date()) => now >= campaignDates.campaignCutoff && now < campaignDates.shopDispatchResumes;
