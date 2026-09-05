"use client";

import { useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { isValidPhone, normalizeTheme } from "@/lib/widget-theme";
import { ChatHeader } from "./chat-header";
import { MessageInput } from "./message-input";
import { SuggestedReplies } from "./suggested-replies";
import { VisitorPhoneField } from "./visitor-phone-field";
import { WelcomeMessage } from "./welcome-message";
import { WidgetFooter } from "./widget-footer";

/**
 * The panel's contents, with no opinion about where it sits.
 *
 * Extracted so the floating popup and the customizer's docked preview render
 * exactly the same thing — a preview that could drift from the real widget
 * would be worse than no preview.
 *
 * `onSendMessage` is how a message leaves: the live widget passes a handler
 * that opens WhatsApp, the docked preview passes nothing and stays inert.
 */
export function ChatPanel({
  theme,
  titleId,
  inputId,
  onClose,
  inputRef,
  onSendMessage,
  className,
}) {
  const t = normalizeTheme(theme);

  // Kept here rather than in the store: this is the visitor's number on this
  // page, not part of the tenant's saved configuration.
  const [visitorPhone, setVisitorPhone] = useState("");
  const phoneInputRef = useRef(null);
  const needsPhone = t.askVisitorPhone && !isValidPhone(visitorPhone);

  /**
   * Hands a message off, or refuses it and points at what's missing.
   *
   * Returns false when nothing was sent, so the composer keeps the draft the
   * visitor typed instead of clearing it into thin air.
   */
  const send = (text) => {
    const body = String(text ?? "").trim();
    if (!body) return false;

    if (needsPhone) {
      phoneInputRef.current?.focus();
      return false;
    }

    // There is no backend to store a lead in, so the number travels with the
    // message — which is where the business will actually see it.
    const lines = visitorPhone
      ? [`My WhatsApp number: ${visitorPhone}`, "", body]
      : [body];

    onSendMessage?.(lines.join("\n"));
    return true;
  };

  return (
    <div className={cn("flex flex-col overflow-hidden", className)}>
      <ChatHeader
        titleId={titleId}
        title={t.title}
        subtitle={t.subtitle}
        logo={t.logo}
        onClose={onClose}
      />

      {/* Transcript. The greeting and its quick replies; a chosen chip is sent
          as though it had been typed. */}
      <div
        role="log"
        aria-live="polite"
        aria-label="Conversation"
        className="wp-no-scrollbar flex-1 space-y-4 overflow-y-auto overscroll-contain bg-[var(--wp-body-bg)] px-4 py-5"
      >
        <WelcomeMessage text={t.welcomeMessage} avatar={t.logo} />
        <SuggestedReplies messages={t.suggestedMessages} onSelect={send} />
      </div>

      {t.askVisitorPhone ? (
        <VisitorPhoneField
          value={visitorPhone}
          onChange={setVisitorPhone}
          inputRef={phoneInputRef}
        />
      ) : null}

      <MessageInput inputId={inputId} ref={inputRef} onSend={send} />
      <WidgetFooter />
    </div>
  );
}
