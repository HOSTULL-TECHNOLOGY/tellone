import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import { localeParams, pageMeta } from "@/lib/meta";
import { Breadcrumbs } from "@/components/ui/Page";
import { RecoverForm } from "@/components/auth/RecoverForm";

export const generateStaticParams = localeParams;
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return pageMeta(lang as Locale, "/login/recover", "Recover your TBH One account", "Reset access to your TBH One account by phone or email.", { noindex: true });
}

export default async function RecoverPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return (
    <div className="auth-page pattern">
      <div className="container container-narrow">
        <Breadcrumbs locale={lang} items={[{ label: "Sign in", path: "/login" }, { label: "Recover account" }]} />
        <h1>Recover your account</h1>
        <p className="muted">Enter the phone number or email address you joined with.</p>
        <RecoverForm />
      </div>
    </div>
  );
}
