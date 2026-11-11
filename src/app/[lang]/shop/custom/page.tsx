import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import { localeParams, pageMeta } from "@/lib/meta";
import { Faq, FactList, PageHeader, PrototypeNote, Section } from "@/components/ui/Page";
import { CustomDesigner } from "@/components/shop/CustomDesigner";

export const generateStaticParams = localeParams;
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return pageMeta(lang as Locale, "/shop/custom", "Custom designs — your ward or chapter name on TBH One merch", "Put your ward, LGA or diaspora chapter name on approved TBH One T-shirt, cap and banner templates. Minimum 20 pieces, brand approval within 24 hours.");
}

export default async function CustomPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return (
    <>
      <PageHeader
        locale={lang}
        crumbs={[{ label: "Shop", path: "/shop" }, { label: "Custom designs" }]}
        title="Custom designs for your ward or chapter"
        answer="Wards, LGAs and diaspora chapters can put their own name on approved TBH One templates — a T-shirt, a cap or a 3-metre street banner. Type your text, choose a colour and see a live preview. Orders start at 20 pieces, and the brand team checks every design against the brand kit and official hashtags within 24 hours before anything is printed."
        aside={
          <FactList
            cols={1}
            items={[
              { label: "Minimum order", value: "20 pieces" },
              { label: "Brand approval", value: "Within 24 hours" },
              { label: "Templates", value: "T-shirt, cap, street banner" },
            ]}
          />
        }
      />
      <Section>
        <CustomDesigner />
        <div style={{ marginTop: "var(--s5)" }}>
          <PrototypeNote>Requests are saved in this browser only. In production they go to the brand team&apos;s approval queue and the vendor portal.</PrototypeNote>
        </div>
      </Section>
      <Section alt narrow>
        <Faq
          items={[
            { q: "Why do designs need approval?", a: "Every product must match the brand kit and use only the official hashtags (#WeWillNotStealYourMoney and #VotePeopleWhoWillNotStealYourMoney). The brand team also checks names and spellings before printing." },
            { q: "Can I upload my own artwork?", a: "Not at launch. Custom orders use approved templates so the logo, colours and tagline stay consistent everywhere." },
            { q: "When do I pay?", a: "After approval. You receive a payment link by SMS with the final price, which includes bulk pricing from 50 pieces." },
          ]}
        />
      </Section>
    </>
  );
}
