"use client";

import { cn } from "@/lib/utils";
import { normalizeTheme } from "@/lib/widget-theme";
import { ChatHeader } from "./chat-header";
import { MessageInput } from "./message-input";
import { SuggestedReplies } from "./suggested-replies";
import { WelcomeMessage } from "./welcome-message";
import { WidgetFooter } from "./widget-footer";

/**
 * The panel's contents, with no opinion about where it sits.
 *
 * Extracted so the floating popup and the customizer's docked preview render
 * exactly the same thing — a preview that could drift from the real widget
 * would be worse than no preview.
 */
export function ChatPanel({
  theme,
  titleId,
  inputId,
  onClose,
  inputRef,
  className,
}) {
  const t = normalizeTheme(theme);

  return (
    <div className={cn("flex flex-col overflow-hidden", className)}>
      <ChatHeader
        titleId={titleId}
        title={t.title}
        subtitle={t.subtitle}
        logo={t.logo}
        onClose={onClose}
      />

      {/* Transcript. Phase 1 holds the greeting and its quick replies. */}
      <div
        role="log"
        aria-live="polite"
        aria-label="Conversation"
        className="wp-no-scrollbar flex-1 space-y-4 overflow-y-auto overscroll-contain bg-[var(--wp-body-bg)] px-4 py-5"
      >
        <WelcomeMessage text={t.welcomeMessage} avatar={t.logo} />
        <SuggestedReplies messages={t.suggestedMessages} />
      </div>

      <MessageInput inputId={inputId} ref={inputRef} />
      <WidgetFooter />
    </div>
  );
}
