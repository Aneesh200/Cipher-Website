import Link from "next/link";
import { NAV } from "@/lib/nav";

const BY_LABEL = new Map(NAV.map((item) => [item.label, item.href]));

const LINKEDIN = "https://www.linkedin.com/company/authifytech/";

export default function SiteFooter({
  tagline = "Find the way in before they do.",
  links = ["OVERVIEW", "PLATFORM", "EVIDENCE", "TRUST", "CONTACT"],
}: {
  tagline?: string;
  links?: string[];
}) {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__mark">
          <span />
          <span className="footer__wordmark">CIPHER</span>
        </div>
        <div className="footer__line">{tagline}</div>
        <div className="footer__links">
          {links.map((label) => (
            <Link key={label} href={BY_LABEL.get(label) ?? "/"}>
              {label}
            </Link>
          ))}
          <a
            className="footer__social"
            href={LINKEDIN}
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg viewBox="0 0 24 24" aria-hidden focusable="false">
              <path
                fill="currentColor"
                d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"
              />
            </svg>
            LINKEDIN
          </a>
        </div>
      </div>
    </footer>
  );
}
