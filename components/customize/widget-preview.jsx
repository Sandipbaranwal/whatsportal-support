"use client";

import { ChatPanel } from "@/components/support-widget/chat-panel";
import { usePrefersDark } from "@/lib/use-prefers-dark";
import { normalizeTheme, themeToCssVars } from "@/lib/widget-theme";

/**
 * The widget, docked rather than floating.
 *
 * It renders the very same `ChatPanel` the live popup does — and resolves the
 * colour scheme the same way — so what's previewed here can't drift from what
 * visitors see.
 */
export function WidgetPreview({ theme }) {
  const t = normalizeTheme(theme);
  const prefersDark = usePrefersDark();
  const isDark = t.scheme === "dark" || (t.scheme === "auto" && prefersDark);

  return (
    <div style={themeToCssVars(theme, { dark: isDark })}>
      <ChatPanel
        theme={theme}
        titleId="wp-preview-title"
        inputId="wp-preview-input"
        className="h-[520px] w-full max-w-[380px] rounded-2xl border border-[var(--wp-border)] bg-[var(--wp-panel-bg)] shadow-2xl shadow-black/20 ring-1 ring-black/5"
      />
    </div>
  );
}
