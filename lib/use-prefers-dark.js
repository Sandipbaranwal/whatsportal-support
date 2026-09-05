"use client";

import { useMediaQuery } from "./use-media-query";

/**
 * Whether the visitor's OS is set to dark. SSR assumes light and the client
 * corrects on its first commit.
 */
export function usePrefersDark() {
  return useMediaQuery("(prefers-color-scheme: dark)");
}
