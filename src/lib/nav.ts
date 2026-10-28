export type NavItem = { href: string; label: string };

export const NAV: NavItem[] = [
  { href: "/", label: "OVERVIEW" },
  { href: "/platform", label: "PLATFORM" },
  { href: "/integrations", label: "INTEGRATIONS" },
  { href: "/evidence", label: "EVIDENCE" },
  { href: "/trust", label: "TRUST" },
  { href: "/contact", label: "CONTACT" },
];

/** The self-serve product. Every "run a scan" call-to-action lands here. */
export const APP_URL = "https://app.ciphersecurity.ai";
