import type { Metadata, Viewport } from "next";
import "../globals.css";
import "@/styles/chrome.css";
import "@/styles/ui.css";
import "@/styles/dashboard.css";
import { themeBootScript } from "@/lib/prefs";
import { FileModeShim } from "@/components/FileModeShim";
import { ServiceWorker } from "@/components/ServiceWorker";
import { Toaster } from "@/components/ui/Toast";

export const metadata: Metadata = {
  title: { default: "Dashboard | TBH One", template: "%s | TBH One dashboard" },
  robots: { index: false, follow: false }, // SEO-7: dashboards are never indexed
  icons: { icon: "/brand/icon-192.png" },
};
export const viewport: Viewport = { width: "device-width", initialScale: 1 };

/** Separate root layout for the authenticated platform (no public chrome). */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-NG" suppressHydrationWarning>
      <head>
        <FileModeShim />
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body className="dash-body">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        {children}
        <Toaster />
        <ServiceWorker />
      </body>
    </html>
  );
}
