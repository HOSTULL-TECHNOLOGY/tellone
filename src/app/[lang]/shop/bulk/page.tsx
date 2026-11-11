import Link from "next/link";
import { notFound } from "next/navigation";
import { href, isLocale, type Locale } from "@/lib/i18n";
import { localeParams, pageMeta } from "@/lib/meta";
import { formatNaira } from "@/lib/format";
import { products } from "@/data/shop";
import { Faq, FactList, Notice, PageHeader, Section } from "@/components/ui/Page";
import { ProductMedia } from "@/components/shop/ProductPhoto";
import { DemoPricesNote } from "@/components/shop/ProductBits";
import { AddPackButton, BulkCalculator } from "@/components/shop/Bulk";

export const generateStaticParams = localeParams;
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return pageMeta(lang as Locale, "/shop/bulk", "Bulk & ward packs — 15–20% off TBH One merch", "Order TBH One merch in bulk for your street, ward or event: 15% off from 50 items, 20% off from 200, ready-made ward and event packs, free pickup at ward-leader hubs.");
}

export default async function BulkPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  // EC-23: out-of-stock items are hidden from packs
  const packs = products.filter((p) => p.category === "Packs" && p.stock > 0);
  return (
    <>
      <PageHeader
        locale={lang}
        crumbs={[{ label: "Shop", path: "/shop" }, { label: "Bulk & ward packs" }]}
        title="Bulk and ward packs"
        answer="Streets, wards and events buy TBH One merch in bulk at lower prices: 15% off when an order has 50 or more items and 20% off from 200 items, applied automatically in the cart. Ready-made ward and event packs bundle the most-used items, out-of-stock items are left out of packs, and ward leaders can pay from approved project funds."
        aside={
          <FactList
            cols={1}
            items={[
              { label: "50–199 items", value: "15% off" },
              { label: "200 items or more", value: "20% off" },
              { label: "Dispatch", value: "Within 48 hours of payment" },
              { label: "Pickup", value: "Free at ward-leader hubs" },
            ]}
          />
        }
      />
      <Section id="calculator" title="Bulk price calculator" intro="Pick a product and quantity to see your price. Discounts count every individual item in the cart together.">
        <DemoPricesNote />
        <div style={{ marginTop: "var(--s4)" }}>
          <BulkCalculator locale={lang} />
        </div>
      </Section>
      <Section id="packs" title="Ready-made packs" alt>
        <div className="card-grid" style={{ ["--min" as string]: "320px" }}>
          {packs.map((p) => (
            <article key={p.slug} className="pack-card">
              <div className="pack-art">
                <ProductMedia p={p} size={64} label={false} sizes="96px" decorative />
              </div>
              <div className="pack-body">
                <h3>
                  <Link href={href(lang, `/shop/p/${p.slug}`)}>{p.name}</Link>
                </h3>
                <p className="small">{p.description}</p>
                <p>
                  <strong>{formatNaira(p.price)}</strong> <span className="small muted">({formatNaira(Math.round(p.price / (p.packOf ?? 1)))} per item)</span>
                </p>
                <AddPackButton slug={p.slug} />
              </div>
            </article>
          ))}
        </div>
      </Section>
      <Section narrow>
        <Notice tone="info" title="Paying from project funds">
          Ward leaders can pay for a bulk order from an approved, funded project (for example “Fund merch giveaways”). The ward leader requests it in their dashboard; Finance releases the payment with a second signature, and the purchase appears on the Transparency page.
        </Notice>
        <div style={{ marginTop: "var(--s6)" }}>
          <Faq
            items={[
              { q: "Can I mix sizes in a bulk order?", a: "Yes. Add “Mixed sizes” in the calculator, then tell us the split at checkout or in your ward dashboard. The discount counts every item together." },
              { q: "Do packs get the bulk discount too?", a: "Packs are already priced as packs, so the tier discount applies to individual items only. Combine packs and individual items as you need." },
              { q: "How fast are bulk orders delivered?", a: "Vendors dispatch within 48 hours. Delivery then takes 1–3 working days in Lagos and Abuja, 3–5 to other state capitals and 5–7 elsewhere, or collect free from a ward-leader hub." },
            ]}
          />
        </div>
      </Section>
    </>
  );
}
