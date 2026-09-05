"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Whether a media query currently matches.
 *
 * A media query is an external store, so `useSyncExternalStore` handles both
 * the subscription and the server case: SSR reports `serverSnapshot` and the
 * client corrects on its first commit, without a hydration mismatch.
 */
export function useMediaQuery(query, serverSnapshot = false) {
  const subscribe = useCallback(
    (listener) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", listener);
      return () => mql.removeEventListener("change", listener);
    },
    [query],
  );

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);
  const getServerSnapshot = useCallback(() => serverSnapshot, [serverSnapshot]);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
