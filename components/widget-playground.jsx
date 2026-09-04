"use client";

import { useSyncExternalStore } from "react";

import { SupportChatWidget } from "@/components/support-widget";
import {
  getThemeServerSnapshot,
  getThemeSnapshot,
  subscribeToTheme,
} from "@/lib/theme-store";

/**
 * Client boundary for the demo page: reads the saved theme and hands it to the
 * widget, exactly as a real embed would hand it one from tenant settings.
 *
 * Editing lives on /customize — this page is only here to show the widget
 * sitting on an ordinary page.
 */
export function WidgetPlayground() {
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    getThemeServerSnapshot,
  );

  return <SupportChatWidget theme={theme} />;
}
