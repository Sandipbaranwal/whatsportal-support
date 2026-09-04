"use client";

import { useEffect } from "react";

const FOCUSABLE = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "textarea:not([disabled])",
  "select:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

/**
 * Keeps Tab inside `ref` while `active`.
 *
 * The panel is `role="dialog"`, so tabbing out of it and onto the page behind
 * strands keyboard users with no obvious way back. Escape and the close button
 * remain the ways out — this only stops focus leaking silently.
 */
export function useFocusTrap(ref, active) {
  useEffect(() => {
    if (!active) return;
    const node = ref.current;
    if (!node) return;

    const onKeyDown = (event) => {
      if (event.key !== "Tab") return;

      const items = [...node.querySelectorAll(FOCUSABLE)].filter(
        // offsetParent is null for anything display:none — cheap visibility test.
        (el) => el.offsetParent !== null || el === document.activeElement,
      );
      if (!items.length) return;

      const first = items[0];
      const last = items[items.length - 1];
      const active_ = document.activeElement;

      if (event.shiftKey && (active_ === first || !node.contains(active_))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active_ === last) {
        event.preventDefault();
        first.focus();
      }
    };

    node.addEventListener("keydown", onKeyDown);
    return () => node.removeEventListener("keydown", onKeyDown);
  }, [ref, active]);
}
