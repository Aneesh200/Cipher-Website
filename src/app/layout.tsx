import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import UtilBar from "@/components/site/UtilBar";
import SiteNav from "@/components/site/SiteNav";
import ScrollFx from "@/components/site/ScrollFx";
import "./globals.css";
import "@/styles/console.css";
import "@/styles/graph.css";

const sans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Cipher — Find every bug and breach, automatically and continuously",
    template: "%s · Cipher",
  },
  description:
    "Cipher tests the way an attacker would, and it never stops. Every push, every deploy, every change to your cloud starts a new run.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://cipher.authify.tech"
  ),
  openGraph: {
    title: "Cipher — Autonomous security testing",
    description:
      "Cipher tests the way an attacker would, and it never stops. Application, cloud and network.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body>
        {/* Runs during parse, before first paint, so the scroll-reveal effect
            arms without the headings flashing in and back out. Anything that
            stops this running leaves the page fully visible. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var m=window.matchMedia('(prefers-reduced-motion: reduce)');" +
              "if(!m||!m.matches)document.documentElement.classList.add('fx-ready')}catch(e){}",
          }}
        />
        <UtilBar />
        <SiteNav />
        <main>{children}</main>
        <ScrollFx />
      </body>
    </html>
  );
}
