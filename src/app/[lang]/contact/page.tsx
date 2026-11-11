import "@/styles/participate.css";
import Link from "next/link";
import { Mail, MapPin, MessageCircle, Phone, Bot } from "lucide-react";
import { localeParams } from "@/lib/meta";
import { href } from "@/lib/i18n";
import { localeOf, metaFor } from "@/components/participate/pageKit";
import { Faq, PageHeader, Section } from "@/components/ui/Page";
import { ApplyForm } from "@/components/participate/ApplyForm";
import { OpenChatButton } from "@/components/participate/Support";
import { site } from "@/config/site";

export const generateStaticParams = localeParams;
export const generateMetadata = metaFor(
  "/contact",
  "Contact TBH One",
  "How to contact TBH One: AI chat in five languages, the contact form, and official phone, WhatsApp, email and address once they are verified.",
);

export default async function ContactPage({ params }: { params: Promise<{ lang: string }> }) {
  const locale = await localeOf(params);
  const L = (p: string) => href(locale, p);
  const c = site.contact;
  const channels = [
    { icon: Phone, label: "Toll-free line", value: c.tollFree, link: c.tollFree ? `tel:${c.tollFree}` : null },
    { icon: MessageCircle, label: "WhatsApp", value: c.whatsappNumber ? `+${c.whatsappNumber}` : null, link: c.whatsappNumber ? `https://wa.me/${c.whatsappNumber}` : null },
    { icon: Mail, label: "Email", value: c.email, link: c.email ? `mailto:${c.email}` : null },
    { icon: Mail, label: "Press", value: c.pressEmail, link: c.pressEmail ? `mailto:${c.pressEmail}` : null },
    { icon: MapPin, label: "Office address", value: c.address, link: null },
  ];
  return (
    <>
      <PageHeader
        locale={locale}
        crumbs={[{ label: "Support" }, { label: "Contact" }]}
        title="Contact TBH One"
        answer="The fastest way to get help is the TBH One AI assistant, which answers in English, Pidgin, Yorùbá, Hausa and Igbo and hands you to a person when needed. You can also send a message with the form below. Official phone, WhatsApp, email and office details are published on this page only once verified — until then, treat any other number claiming to be TBH One with care."
        actions={<OpenChatButton />}
      />
      <Section title="Channels">
        <ul className="channels" role="list">
          <li className="channel">
            <Bot size={20} aria-hidden />
            <strong>AI assistant</strong>
            <span className="small muted">Available now, 24 hours, five languages.</span>
          </li>
          {channels.map(({ icon: Icon, label, value, link }) => (
            <li key={label} className="channel">
              <Icon size={20} aria-hidden />
              <strong>{label}</strong>
              {value ? link ? <a href={link}>{value}</a> : <span>{value}</span> : <span className="pending">Pending verification</span>}
            </li>
          ))}
        </ul>
        <p className="small muted" style={{ marginTop: "var(--s3)" }}>
          Check any number or account on <Link href={L("/verify")}>Verify Official Channels</Link>. Need to track an issue? Open a <Link href={L("/support")}>support ticket</Link>. Safety concern? <Link href={L("/report")}>Report a problem</Link>.
        </p>
      </Section>
      <Section alt title="Send a message">
        <ApplyForm
          kind="contact"
          refPrefix="MSG"
          submitLabel="Send message"
          successTitle="Message sent"
          successText="Thanks for getting in touch. We reply within two working days."
          fields={[
            { name: "name", label: "Full name", type: "text", required: true },
            { name: "email", label: "Email", type: "email", required: true },
            { name: "phone", label: "Mobile number", type: "tel" },
            { name: "topic", label: "Topic", type: "select", options: ["General question", "Membership", "Media enquiry", "Partnership", "Feedback", "Data protection request"], required: true },
            { name: "message", label: "Message", type: "textarea", required: true, span: true },
          ]}
        />
      </Section>
      <Section narrow>
        <Faq
          items={[
            { q: "I want my data deleted. Who do I contact?", a: "Choose “Data protection request” in the form, or use the privacy settings in your dashboard. The Data Protection Officer responds within the legal time limit." },
            { q: "Is this the NDC's official contact?", a: "No. TBH One is a supporting movement. Contact the NDC directly for official party matters." },
          ]}
        />
      </Section>
    </>
  );
}
