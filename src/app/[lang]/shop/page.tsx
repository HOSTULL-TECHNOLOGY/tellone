import Link from "next/link";
import { notFound } from "next/navigation";
import { Boxes, Brush, Store, Ticket } from "lucide-react";
import { href, isLocale, type Locale } from "@/lib/i18n";
import { localeParams, pageMeta } from "@/lib/meta";
import { categories, products } from "@/data/shop";
import { CardGrid, CtaBand, Faq, LinkCard, PageHeader, Section } from "@/components/ui/Page";
import { ProductArt } from "@/components/shop/ProductArt";
import { DemoPricesNote, ProductCard, ShopPhaseBanner } from "@/components/shop/ProductBits";
import { CouponTeaser, PopularInState, PromoOnly } from "@/components/shop/ShopHomeBits";
import { JsonLd } from "@/lib/seo";
import { site } from "@/config/site";

export const generateStaticParams = localeParams;
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return pageMeta(lang as Locale, "/shop", "TBH One Shop — official merch, member coupons and partner offers", "Buy official TBH One merch made by Nigerian vendors. Members get 10% off, coupons and partner discounts. Delivery to all 36 states and the FCT.");
}

export default async function ShopHome({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const L = (p: string) => href(lang, p);
  const best = products.filter((p) => p.bestSeller);
  const featured = products.filter((p) => p.series === "Language series").sort((a, b) => Number(!!b.images) - Number(!!a.images)).slice(0, 4);
  return (
    <>
      <PageHeader
        locale={lang}
        crumbs={[{ label: "Shop" }]}
        title="TBH One Shop"
        kicker="Wear the promise: we will not steal your money."
        answer="The TBH One Shop sells official merch — T-shirts, caps, key holders, wristbands, banners and stickers — made by partner vendors in Aba, Kano, Kaduna and Lagos. Signed-in members pay 10% less and get exclusive coupons, ward teams save 15–20% on bulk orders, and every order is delivered to all 36 states and the FCT or collected free from a ward-leader hub."
        actions={
          <>
            <Link href={L("/shop/merch")} className="btn btn-primary btn-lg">
              Shop all merch
            </Link>
            <Link href={L("/shop/bulk")} className="btn btn-outline btn-lg">
              Bulk & ward packs
            </Link>
          </>
        }
      />
      <Section>
        <ShopPhaseBanner />
        <DemoPricesNote />
        <ul role="list" className="shop-cats" style={{ marginTop: "var(--s5)" }}>
          {categories.map((c) => (
            <li key={c}>
              <Link href={`${L("/shop/merch")}?category=${encodeURIComponent(c)}`}>
                <ProductArt category={c} label={false} />
                {c}
              </Link>
            </li>
          ))}
        </ul>
      </Section>
      <Section id="featured" title="Language series: the tagline in five languages" intro="#WWNSYM, #WNGTUM, #AONJOY, #AAEOEU and the Hausa edition — each spells out ‘We will not steal your money’. Every design is approved against the brand kit before it is listed." alt action={<Link href={L("/shop/merch?series=language-series")}>Shop the series</Link>}>
        <div className="shop-grid-full">
          {featured.map((p) => (
            <ProductCard key={p.slug} p={p} locale={lang} />
          ))}
        </div>
      </Section>
      <Section id="popular" title="Best sellers near you" intro="See what members in your state are buying.">
        <PopularInState locale={lang} />
      </Section>
      <PromoOnly>
        <Section id="member-deals" title="Member deals" intro="Coupons, Impact Points rewards and discounts at partner businesses — for members only." alt>
          <CouponTeaser locale={lang} />
          <div style={{ marginTop: "var(--s5)" }}>
            <CardGrid>
              <LinkCard locale={lang} path="/shop/coupons" icon={<Ticket size={24} aria-hidden />} title="Member coupons" text="Weekly codes, plus coupons you unlock with Impact Points." />
              <LinkCard locale={lang} path="/shop/offers" icon={<Store size={24} aria-hidden />} title="Partner vendor offers" text="Discounts at local businesses, redeemed in store with your personal code or QR." />
              <LinkCard locale={lang} path="/shop/bulk" icon={<Boxes size={24} aria-hidden />} title="Bulk & ward packs" text="15% off from 50 items, 20% off from 200. Ready-made packs for wards and events." />
              <LinkCard locale={lang} path="/shop/custom" icon={<Brush size={24} aria-hidden />} title="Custom designs" text="Your ward, LGA or chapter name on approved templates, from 20 pieces." />
            </CardGrid>
          </div>
        </Section>
      </PromoOnly>
      <Section id="best" title="Best sellers">
        <div className="shop-grid-full">
          {best.map((p) => (
            <ProductCard key={p.slug} p={p} locale={lang} />
          ))}
        </div>
      </Section>
      <Section alt narrow>
        <Faq
          items={[
            { q: "Who makes TBH One merch?", a: "Approved partner vendors in Aba, Kano, Kaduna and Lagos produce every item on a profit-share basis. Vendors are chosen through a published selection process and every awarded contract is listed on the Transparency page." },
            { q: "How do member prices work?", a: "Sign in with your TBH One account and the member price — 10% below the public price — is applied automatically. You can add one coupon per order on top." },
            { q: "Where do you deliver?", a: "To Nigerian addresses in all 36 states and the FCT: Lagos and Abuja in 1–3 working days, other state capitals in 3–5, elsewhere in 5–7. Delivery is free on orders over ₦20,000, and pickup from ward-leader hubs is always free." },
            { q: "Where does the money go?", a: "Every sale is recorded against a named buyer in the finance ledger, and the campaign margin on each item is tagged separately for reporting as the law requires." },
            { q: "What happens at the campaign cut-off?", a: "At 11:59 pm on Thursday 14 January 2027, shop promotions, coupons and banners switch off. You can still order, and orders placed then are dispatched from Sunday 17 January 2027." },
          ]}
        />
      </Section>
      <CtaBand
        title="Need 50 or more for your ward?"
        text="Bulk pricing is applied automatically, and ward leaders can pay from approved project funds."
        actions={
          <>
            <Link href={L("/shop/bulk")} className="btn btn-primary">
              See bulk pricing
            </Link>
            <Link href={L("/shop/custom")} className="btn btn-outline">
              Design with your ward name
            </Link>
          </>
        }
      />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "Store", name: "TBH One Shop", url: `${site.url}${L("/shop")}`, parentOrganization: { "@id": `${site.url}/#organization` }, areaServed: "NG", currenciesAccepted: "NGN" }} />
    </>
  );
}
