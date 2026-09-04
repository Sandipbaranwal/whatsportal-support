"use client";

import { useLayoutEffect } from "react";

/**
 * Grows a textarea with its content, up to `maxHeight`, then lets it scroll.
 *
 * Layout effect rather than effect: the height is measured and applied before
 * paint, so the field never flashes at the wrong size.
 */
export function useAutoGrow(ref, value, maxHeight) {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Collapse first so scrollHeight reports the content, not the current box.
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`;
  }, [ref, value, maxHeight]);
}
