"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { APP_URL, NAV } from "@/lib/nav";

export default function SiteNav() {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const [overDark, setOverDark] = useState(false);
  const [open, setOpen] = useState(false);

  // The nav inverts to its dark treatment while a [data-hero-dark] section
  // sits directly beneath it.
  useEffect(() => {
    const onScroll = () => {
      const nav = navRef.current;
      if (!nav) return;
      const navH = nav.getBoundingClientRect().height || 74;
      const darks = document.querySelectorAll<HTMLElement>("[data-hero-dark]");
      let hit = false;
      darks.forEach((sec) => {
        const r = sec.getBoundingClientRect();
        if (r.top <= navH + 42 && r.bottom > navH + 4) hit = true;
      });
      setOverDark(hit);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  // Close the drawer on navigation, and whenever the viewport grows past the
  // breakpoint that hides the burger.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const mq = window.matchMedia("(min-width: 1081px)");
    const close = () => setOpen(false);
    mq.addEventListener("change", close);
    return () => mq.removeEventListener("change", close);
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header ref={navRef} className={`nav${overDark ? " over-dark" : ""}`}>
      <div className="nav__inner">
        <Link href="/" className="nav__mark" aria-label="Cipher, home">
          <span />
          <span className="nav__wordmark">CIPHER</span>
        </Link>

        <nav className="nav__links" aria-label="Primary">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav__link${isActive(item.href) ? " is-active" : ""}`}
              aria-current={isActive(item.href) ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="nav__right">
          <a href={APP_URL} className="nav__cta">
            GET ACCESS
          </a>

          {/* Both marks ship so the swap on the inverted nav costs no request. */}
          <a
            className="nav__authify"
            href="https://authify.tech"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="nav__by">BY</span>
            <Image
              className="nav__authify-mark nav__authify-mark--light"
              src="/assets/authify-logo-black.png"
              alt="Authify"
              width={132}
              height={40}
              priority
            />
            <Image
              className="nav__authify-mark nav__authify-mark--dark"
              src="/assets/authify-logo-white.png"
              alt=""
              width={132}
              height={40}
              aria-hidden
              priority
            />
          </a>
        </div>

        <button
          type="button"
          className="nav__burger"
          aria-expanded={open}
          aria-controls="nav-drawer"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <div id="nav-drawer" className={`nav__drawer${open ? " is-open" : ""}`}>
        <div className="nav__drawer-inner">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav__link${isActive(item.href) ? " is-active" : ""}`}
            >
              {item.label}
            </Link>
          ))}
          <a href={APP_URL} className="nav__cta">
            GET ACCESS
          </a>
        </div>
      </div>
    </header>
  );
}
