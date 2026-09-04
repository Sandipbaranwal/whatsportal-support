"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-color-scheme: dark)";

function subscribe(listener) {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", listener);
  return () => mql.removeEventListener("change", listener);
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches;
}

/**
 * Whether the visitor's OS is set to dark.
 *
 * The media query is an external store, so `useSyncExternalStore` handles both
 * the subscription and the server case — SSR assumes light, and the client
 * corrects on its first commit without a hydration mismatch.
 */
export function usePrefersDark() {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
