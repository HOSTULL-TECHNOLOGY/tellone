import "@/styles/participate.css";
import Link from "next/link";
import { AtSign } from "lucide-react";
import { localeParams } from "@/lib/meta";
import { href } from "@/lib/i18n";
import { localeOf, metaFor } from "@/components/participate/pageKit";
import { PageHeader, Section } from "@/components/ui/Page";
import { CopyButton } from "@/components/ui/Interactive";
import { site, socialLabels } from "@/config/site";
import { SocialFeed } from "@/components/home/SocialFeed";

export const generateStaticParams = localeParams;
export const generateMetadata = metaFor(
  "/media/social",
  "TBH One on social media — official accounts and hashtags",
  "Follow TBH One's verified social accounts and use the official hashtags #WeWillNotStealYourMoney and #VotePeopleWhoWillNotStealYourMoney.",
);

const NETWORKS = Object.entries(socialLabels) as [keyof typeof site.social, string][];

export default async function SocialPage({ params }: { params: Promise<{ lang: string }> }) {
  const locale = await localeOf(params);
  const L = (p: string) => href(locale, p);
  return (
    <>
      <PageHeader
        locale={locale}
        crumbs={[{ label: "Media Hub", path: "/media" }, { label: "Social" }]}
        title="TBH One on social media"
        answer="TBH One's official accounts on X, Instagram, Facebook, TikTok and YouTube will be listed here once they are verified. Below is how the feed from Instagram, X and TikTok looks, with sample posts made from the campaign’s own posters, photos and messages until the accounts are verified. Follow only accounts linked from this page or from Verify Official Channels, and use the hashtags so your posts join the conversation."
      />
      <Section title="Official accounts">
        <ul className="channels" role="list">
          {NETWORKS.map(([k, label]) => {
            const url = site.social[k];
            return (
              <li key={k} className="channel">
                <AtSign size={20} aria-hidden />
                <strong>{label}</strong>
                {url ? (
                  <a href={url} rel="noopener" target="_blank">
                    Follow
                  </a>
                ) : (
                  <span className="pending">Account pending verification</span>
                )}
              </li>
            );
          })}
        </ul>
      </Section>
      <section className="section band-red" aria-labelledby="feed-h">
        <div className="container">
          <div className="section-head">
            <div>
              <h2 id="feed-h">
                Feed <span className="chip chip-demo">Sample posts</span>
              </h2>
              <p>The live feed from the verified accounts replaces these sample posts once platform access is approved.</p>
            </div>
          </div>
          <SocialFeed verifyHref={L("/verify")} />
          <p className="small" style={{ marginTop: "var(--s4)" }}>
            To avoid fake accounts, check <Link href={L("/verify")}>Verify Official Channels</Link> before following.
          </p>
        </div>
      </section>
      <Section title="Hashtags">
        <ul className="channels" role="list">
          {[...site.hashtags, ...site.hashtagAcronyms].map((h) => (
            <li key={h} className="channel">
              <strong style={{ overflowWrap: "anywhere" }}>{h}</strong>
              <CopyButton value={h} label="Copy" />
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
