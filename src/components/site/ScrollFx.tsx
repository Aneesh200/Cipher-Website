"use client";

import { useEffect } from "react";

const SELECTOR =
  ".reveal:not(.is-in), .rule-anim:not(.is-in), .bar-anim:not(.is-in)";

/**
 * Adds `is-in` to reveal elements as they scroll into view. Watches the DOM so
 * that content mounted after the first paint is picked up too.
 *
 * Reveal elements start at opacity 0, so a broken observer would leave the page
 * blank. If nothing has been revealed shortly after mount, the whole effect is
 * switched off and everything renders plainly.
 */
export default function ScrollFx() {
  useEffect(() => {
    const root = document.documentElement;

    // Dropping `fx-ready` reverts every reveal element to plain, visible text.
    const disarm = () => root.classList.remove("fx-ready");

    if (typeof IntersectionObserver === "undefined") {
      disarm();
      return;
    }

    let fired = false;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          fired = true;
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    const scan = () =>
      document.querySelectorAll(SELECTOR).forEach((el) => io.observe(el));

    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });

    // If the observer never delivered while something was sitting in view,
    // treat the effect as unavailable rather than hiding content.
    const failsafe = window.setTimeout(() => {
      if (fired) return;
      const stuck = Array.from(
        document.querySelectorAll<HTMLElement>(".reveal:not(.is-in)")
      ).some((el) => {
        const r = el.getBoundingClientRect();
        return r.top < window.innerHeight && r.bottom > 0;
      });
      if (stuck) disarm();
    }, 2500);

    return () => {
      io.disconnect();
      mo.disconnect();
      window.clearTimeout(failsafe);
    };
  }, []);

  return null;
}
