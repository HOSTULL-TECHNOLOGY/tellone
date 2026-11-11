import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import { localeParams, pageMeta } from "@/lib/meta";
import { Breadcrumbs, PrototypeNote } from "@/components/ui/Page";
import { DemoAccounts, LoginForm } from "@/components/auth/LoginForm";
import Link from "next/link";
import { href } from "@/lib/i18n";

export const generateStaticParams = localeParams;
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return pageMeta(lang as Locale, "/login", "Sign in to TBH One", "Sign in to your TBH One dashboard with your phone number and a one-time code, or with email and password.", { noindex: true });
}

export default async function LoginPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return (
    <div className="auth-page pattern">
      <div className="container">
        <Breadcrumbs locale={lang} items={[{ label: "Sign in" }]} />
        <div className="auth-grid">
          <div className="auth-main">
            <h1>Sign in to TBH One</h1>
            <p className="muted">
              New here? <Link href={href(lang, "/join")}>Join TBH One — it&apos;s free</Link>.
            </p>
            <LoginForm />
            <PrototypeNote>Sign-in is simulated. Production uses an SMS code provider, server sessions and authenticator-app 2FA for every role above Member.</PrototypeNote>
          </div>
          <DemoAccounts />
        </div>
      </div>
    </div>
  );
}
