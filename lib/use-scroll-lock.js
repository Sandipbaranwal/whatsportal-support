"use client";

import { useEffect } from "react";

/**
 * Holds the page still behind an overlay.
 *
 * Locking with `overflow: hidden` takes the scrollbar away, and the space it
 * occupied with it — the page reflowed 10px wider the moment an overlay opened
 * and snapped back on close. The gutter is replaced with padding of the same
 * width, so nothing moves.
 *
 * `scrollbar-gutter: stable` is not the fix here: it reserves space only while
 * overflow is `scroll` or `auto`, which is exactly what the lock takes away.
 */
export function useScrollLock(active) {
  useEffect(() => {
    if (!active) return;

    const { body } = document;
    // Whatever the scrollbar was occupying, measured before it is taken away.
    const gutter = window.innerWidth - document.documentElement.clientWidth;
    const previousOverflow = body.style.overflow;
    const previousPadding = body.style.paddingRight;

    if (gutter > 0) {
      const current = parseFloat(getComputedStyle(body).paddingRight) || 0;
      body.style.paddingRight = `${current + gutter}px`;
    }
    body.style.overflow = "hidden";

    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPadding;
    };
  }, [active]);
}
