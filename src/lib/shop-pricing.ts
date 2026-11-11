import { bulkRate, coupons, deliveryZones, FREE_DELIVERY_FROM, memberPrice, productBySlug, VAT_RATE, type Coupon } from "@/data/shop";
import { stateBySlug, states } from "@/data/states";
import type { CartLine } from "./cart";

/**
 * Shop pricing rules (PRD EC-4, EC-6, EC-7, EC-10, EC-13, EC-19). Pure functions so the cart,
 * checkout and dashboards compute identical totals. Prices include VAT.
 */
export type Totals = {
  lines: (CartLine & { unit: number; lineTotal: number; isPack: boolean })[];
  qty: number;
  bulkQty: number;
  publicSubtotal: number;
  memberSaving: number;
  bulkRate: number;
  bulkDiscount: number;
  couponDiscount: number;
  coupon?: Coupon;
  couponError?: string;
  goods: number; // after all discounts
  delivery: number;
  freeDelivery: boolean;
  total: number;
  vat: number; // VAT included in total (goods only)
};

export function validateCoupon(code: string | null | undefined, opts: { member: boolean; subtotal: number; now?: Date }): { coupon?: Coupon; error?: string } {
  if (!code) return {};
  const c = coupons.find((x) => x.code.toUpperCase() === code.trim().toUpperCase());
  if (!c) return { error: "That coupon code doesn't exist. Check the spelling." };
  const now = opts.now ?? new Date();
  if (new Date(`${c.expires}T23:59:59+01:00`) < now) return { error: `This coupon expired on ${c.expires}.` };
  if (c.membersOnly && !opts.member) return { error: "This coupon is for signed-in TBH One members. Sign in or join free to use it." };
  if (c.minOrder && opts.subtotal < c.minOrder) return { error: `This coupon needs an order of at least ₦${c.minOrder.toLocaleString("en-NG")}.` };
  return { coupon: c };
}

export function computeTotals(cart: CartLine[], opts: { member: boolean; couponCode?: string | null; deliveryFee?: number | null; now?: Date }): Totals {
  const lines = cart.map((l) => {
    const p = productBySlug(l.slug);
    const base = p?.price ?? l.price;
    const unit = opts.member ? memberPrice(base) : base;
    return { ...l, unit, lineTotal: unit * l.qty, isPack: p?.category === "Packs" };
  });
  const qty = lines.reduce((n, l) => n + l.qty, 0);
  const publicSubtotal = lines.reduce((n, l) => n + (productBySlug(l.slug)?.price ?? l.price) * l.qty, 0);
  const afterMember = lines.reduce((n, l) => n + l.lineTotal, 0);
  const memberSaving = publicSubtotal - afterMember;
  // Packs are already priced as packs; bulk tiers count individual items only.
  const bulkQty = lines.filter((l) => !l.isPack).reduce((n, l) => n + l.qty, 0);
  const rate = bulkRate(bulkQty);
  const bulkDiscount = Math.round(lines.filter((l) => !l.isPack).reduce((n, l) => n + l.lineTotal, 0) * rate);
  const afterBulk = afterMember - bulkDiscount;

  const { coupon, error } = validateCoupon(opts.couponCode, { member: opts.member, subtotal: afterBulk, now: opts.now });
  let couponDiscount = 0;
  if (coupon?.type === "percent") {
    const scope = coupon.scope?.split(",").map((s) => s.trim());
    const base = lines.filter((l) => !scope || scope.includes(productBySlug(l.slug)?.category ?? "")).reduce((n, l) => n + l.lineTotal, 0);
    couponDiscount = Math.round(base * (1 - rate) * (coupon.value / 100));
  } else if (coupon?.type === "fixed") couponDiscount = Math.min(coupon.value, afterBulk);
  const goods = Math.max(0, afterBulk - couponDiscount);
  const freeDelivery = goods >= FREE_DELIVERY_FROM || coupon?.type === "free-delivery";
  const delivery = opts.deliveryFee == null ? 0 : freeDelivery ? 0 : opts.deliveryFee;
  const total = goods + delivery;
  const vat = Math.round(goods - goods / (1 + VAT_RATE));
  return { lines, qty, bulkQty, publicSubtotal, memberSaving, bulkRate: rate, bulkDiscount, couponDiscount, coupon, couponError: error, goods, delivery, freeDelivery, total, vat };
}

/** Which delivery zone applies (EC-19). Lagos & Abuja 1–3 days; other state capitals 3–5; elsewhere 5–7. */
export function zoneFor(stateName: string, inCapital: boolean) {
  const z = deliveryZones;
  if (stateName === "Lagos" || stateName === "FCT") return z[0];
  return inCapital ? z[1] : z[2];
}

export const capitalOf = (stateName: string) => states.find((s) => s.name === stateName)?.capital ?? "";
export const stateNameFromSlug = (slug: string) => stateBySlug(slug)?.name ?? "";

/** Demo ward-leader pickup hubs (EC-20). */
export const pickupHubs = [
  { id: "hub-lag-sur", label: "Surulere Ward 4 hub — Adeniran Ogunsanya St, Lagos", state: "Lagos" },
  { id: "hub-lag-ikj", label: "Ikeja Ward 2 hub — Allen Avenue, Lagos", state: "Lagos" },
  { id: "hub-fct-wuse", label: "Wuse Ward hub — Wuse II, Abuja", state: "FCT" },
  { id: "hub-kan-nas", label: "Nassarawa (Gama) hub — Gama Road, Kano", state: "Kano" },
  { id: "hub-kad-kdn", label: "Kaduna North hub — Kawo, Kaduna", state: "Kaduna" },
  { id: "hub-enu-nsk", label: "Nsukka Ward 4 hub — Nsukka, Enugu", state: "Enugu" },
  { id: "hub-ana-oni", label: "Onitsha North hub — Onitsha, Anambra", state: "Anambra" },
  { id: "hub-riv-ph", label: "Port Harcourt hub — D-Line, Rivers", state: "Rivers" },
  { id: "hub-oyo-ibn", label: "Ibadan North hub — Bodija, Oyo", state: "Oyo" },
];
