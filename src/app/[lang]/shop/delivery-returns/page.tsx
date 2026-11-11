import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import { localeParams, pageMeta } from "@/lib/meta";
import { formatNaira } from "@/lib/format";
import { deliveryZones, FREE_DELIVERY_FROM } from "@/data/shop";
import { pickupHubs } from "@/lib/shop-pricing";
import { Faq, PageHeader, Prose, Section } from "@/components/ui/Page";
import { ReturnsForm } from "@/components/shop/ReturnsForm";

export const generateStaticParams = localeParams;
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return pageMeta(lang as Locale, "/shop/delivery-returns", "Delivery and returns — TBH One Shop", "TBH One Shop delivers to all 36 states and the FCT in 1–7 working days, free over ₦20,000. Returns within 7 days for a wrong size or damage; refunds in 5 working days.");
}

export default async function DeliveryReturnsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return (
    <>
      <PageHeader
        locale={lang}
        crumbs={[{ label: "Shop", path: "/shop" }, { label: "Delivery & returns" }]}
        title="Delivery and returns"
        answer="We deliver to Nigerian addresses in all 36 states and the FCT: Lagos and Abuja in 1–3 working days, other state capitals in 3–5 and elsewhere in 5–7. Delivery is free over ₦20,000 and pickup at a ward-leader hub is always free. Return a wrong size or damaged item within 7 days of delivery; refunds reach your original payment method within 5 working days."
      />
      <Section id="delivery" title="Delivery areas, times and fees">
        <div className="dt-wrap">
          <table className="dt-table zones-table">
            <caption className="sr-only">Delivery zones</caption>
            <thead>
              <tr>
                <th scope="col">Area</th>
                <th scope="col">Delivery time</th>
                <th scope="col" className="num">
                  Fee
                </th>
              </tr>
            </thead>
            <tbody>
              {deliveryZones.map((z) => (
                <tr key={z.key}>
                  <td data-label="Area">{z.label}</td>
                  <td data-label="Delivery time">{z.days}</td>
                  <td data-label="Fee" className="num">
                    {z.fee === 0 ? "Free" : formatNaira(z.fee)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="proto-note" style={{ marginTop: "var(--s3)" }}>
          <span className="chip chip-demo">Demo data</span> Courier fees are estimates until the Merch lead signs agreements with two national courier partners. Free delivery on orders over {formatNaira(FREE_DELIVERY_FROM)}.
        </p>
        <Prose>
          <h3>Pickup points</h3>
          <p>Collect free from a ward-leader hub. Bring your order number and the phone you ordered with. Ward and street leaders who hand over orders earn a delivery fee for verified hand-overs.</p>
          <ul>
            {pickupHubs.map((h) => (
              <li key={h.id}>{h.label}</li>
            ))}
          </ul>
          <p className="small muted">Demo hubs. Live hubs are listed once ward leaders are vetted.</p>
          <h3>Important</h3>
          <ul>
            <li>We deliver to Nigerian addresses only at launch. Cash on delivery is not available.</li>
            <li>Orders paid with a card issued outside Nigeria are held for review before dispatch.</li>
            <li>Orders placed after the campaign cut-off (11:59 pm, Thursday 14 January 2027) are dispatched from Sunday 17 January 2027.</li>
          </ul>
        </Prose>
      </Section>
      <Section id="returns" title="Returns, exchanges and refunds" alt>
        <Prose>
          <ul>
            <li>Request a return within 7 days of delivery if the size is wrong, the item is damaged or we sent the wrong item.</li>
            <li>Choose an exchange or a refund. Refunds go back to the original payment method within 5 working days of us receiving the item.</li>
            <li>You can cancel an order free of charge until it has been packed.</li>
          </ul>
        </Prose>
        <div id="return" style={{ marginTop: "var(--s5)", maxWidth: 820 }}>
          <h3 style={{ marginBottom: "var(--s3)" }}>Request a return</h3>
          <ReturnsForm />
        </div>
      </Section>
      <Section narrow>
        <Faq
          items={[
            { q: "How much does delivery cost?", a: `Delivery is free on orders over ${formatNaira(FREE_DELIVERY_FROM)} and pickup at ward-leader hubs is always free. Otherwise the fee depends on the zone and is shown before you pay.` },
            { q: "How will I know where my order is?", a: "You get an SMS or WhatsApp update at every stage, and you can check Track My Order with your order number and phone." },
            { q: "My item arrived damaged. What do I do?", a: "Request a return within 7 days with a photo of the damage. We arrange a pickup or drop-off and send a replacement or refund." },
          ]}
        />
      </Section>
    </>
  );
}
