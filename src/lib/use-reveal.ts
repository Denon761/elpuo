"use client";

import { useEffect } from "react";

/**
 * Adds `.is-visible` to any `.reveal` element as it scrolls into view.
 * One observer for the whole document, re-scanned on route changes via key.
 */
export function useReveal(deps: unknown[] = []) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal:not(.is-visible)"));
    if (!els.length) return;

    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
