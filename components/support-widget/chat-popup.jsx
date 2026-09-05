"use client";

import { useRef } from "react";

import { useFocusTrap } from "@/lib/use-focus-trap";
import { cn } from "@/lib/utils";
import { ChatPanel } from "./chat-panel";

/**
 * The floating chat panel.
 *
 * Desktop: a ~380x560 card anchored above the launcher. Mobile: inset to the
 * viewport edges so nothing overflows and the composer stays reachable above
 * the on-screen keyboard (dvh, not vh).
 */
export function ChatPopup({
  id,
  titleId,
  inputId,
  theme,
  side,
  isOpen,
  onClose,
  inputRef,
  onSendMessage,
}) {
  const panelRef = useRef(null);
  useFocusTrap(panelRef, isOpen);

  return (
    <div
      id={id}
      ref={panelRef}
      role="dialog"
      aria-labelledby={titleId}
      data-state={isOpen ? "open" : "closed"}
      className={cn(
        "fixed z-50",
        // Mobile: fill the viewport with a comfortable margin.
        "inset-x-3 bottom-3 top-3",
        // Desktop: a fixed-size card sitting above the launcher, on whichever
        // side the launcher is pinned to.
        "sm:inset-auto sm:top-auto sm:h-[560px] sm:max-h-[calc(100dvh-8rem)] sm:w-[380px]",
        "sm:bottom-[var(--wp-panel-offset-y)] sm:left-[var(--wp-left)] sm:right-[var(--wp-right)]",
        "rounded-2xl border border-[var(--wp-border)] bg-[var(--wp-panel-bg)]",
        "shadow-2xl shadow-black/20 ring-1 ring-black/5",
        side === "left" ? "origin-bottom-left" : "origin-bottom-right",
        "data-[state=open]:animate-panel-in data-[state=closed]:animate-panel-out",
      )}
    >
      <ChatPanel
        theme={theme}
        titleId={titleId}
        inputId={inputId}
        onClose={onClose}
        inputRef={inputRef}
        onSendMessage={onSendMessage}
        className="h-full rounded-2xl"
      />
    </div>
  );
}
