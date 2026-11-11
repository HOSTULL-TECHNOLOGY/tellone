import Link from "next/link";
import { notFound } from "next/navigation";
import { Factory, ShieldCheck } from "lucide-react";
import { href, isLocale, type Locale } from "@/lib/i18n";
import { pageMeta, withLocales } from "@/lib/meta";
import { memberPrice, productBySlug, products } from "@/data/shop";
import { Breadcrumbs, Section } from "@/components/ui/Page";
import { ProductGallery } from "@/components/shop/ProductGallery";
import { DemoPricesNote, ProductCard, ShopPhaseBanner } from "@/components/shop/ProductBits";
import { BuyBox } from "@/components/shop/BuyBox";
import { JsonLd } from "@/lib/seo";
import { site } from "@/config/site";

export const dynamicParams = false;
export function generateStaticParams() {
  return withLocales(products.map((p) => ({ slug: p.slug })));
}
export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  const p = productBySlug(slug);
  if (!p) return {};
  return pageMeta(lang as Locale, `/shop/p/${slug}`, `${p.name} — TBH One Shop`, `${p.description} ₦${p.price.toLocaleString("en-NG")}; members pay ₦${memberPrice(p.price).toLocaleString("en-NG")}. Delivered across Nigeria.`);
}

export default async function ProductPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const p = productBySlug(slug);
  if (!p) notFound();
  const related = products.filter((x) => x.slug !== p.slug && (p.series ? x.series === p.series : x.category === p.category || x.bestSeller)).slice(0, 4);
  const url = `${site.url}${href(lang, `/shop/p/${p.slug}`)}`;
  return (
    <>
      <div className="container" style={{ paddingTop: "var(--s5)" }}>
        <Breadcrumbs locale={lang} items={[{ label: "Shop", path: "/shop" }, { label: "Merch", path: "/shop/merch" }, { label: p.name }]} />
      </div>
      <Section>
        <ShopPhaseBanner />
        <div className="pdp">
          <ProductGallery p={p} />
          <div className="pdp-info">
            <p className="pdp-cat">
              {p.category}
              {p.series && (
                <>
                  {" · "}
                  <Link href={href(lang, "/shop/merch?series=language-series")}>{p.series}: see all languages</Link>
                </>
              )}
            </p>
            <h1>{p.name}</h1>
            <p className="lead">{p.description}</p>
            <BuyBox p={p} locale={lang} />
            <DemoPricesNote />
            <section aria-labelledby="det-h">
              <h2 id="det-h" className="co-title">
                Product details
              </h2>
              <ul className="pdp-details">
                {p.details.map((d) => (
                  <li key={d}>{d}</li>
                ))}
                {p.packOf && <li>{p.packOf} items per pack</li>}
              </ul>
            </section>
            <p className="small">
              <Factory size={14} aria-hidden style={{ display: "inline", verticalAlign: "-2px" }} /> Made by <strong>{p.vendor}</strong>, a TBH One partner vendor (profit-share).{" "}
              <ShieldCheck size={14} aria-hidden style={{ display: "inline", verticalAlign: "-2px" }} /> Design approved against the brand kit.
            </p>
            <p className="small">
              Returns within 7 days for a wrong size or damage. <Link href={href(lang, "/shop/delivery-returns")}>Delivery & returns</Link>
            </p>
          </div>
        </div>
      </Section>
      <Section id="related" title="You may also like" alt>
        <div className="shop-grid-full">
          {related.map((r) => (
            <ProductCard key={r.slug} p={r} locale={lang} />
          ))}
        </div>
      </Section>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: p.name,
          description: p.description,
          category: p.category,
          sku: p.slug,
          brand: { "@type": "Brand", name: "TBH One" },
          manufacturer: { "@type": "Organization", name: p.vendor },
          image: p.images?.length ? p.images.map((i) => `${site.url}${i.src}`) : `${site.url}/brand/tbh-one-logo.png`,
          offers: {
            "@type": "Offer",
            url,
            priceCurrency: "NGN",
            price: p.price,
            availability: p.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            areaServed: "NG",
            seller: { "@id": `${site.url}/#organization` },
          },
        }}
      />
    </>
  );
}
