"use client";

import { useRef } from "react";

import { useFocusTrap } from "@/lib/use-focus-trap";
import { cn } from "@/lib/utils";
import { ChatPanel } from "./chat-panel";

/**
 * The floating chat panel.
 *
 * Two layouts, chosen by whether there is room for a card rather than by width
 * alone. `wp-docked` asks for 640px across *and* 544px down, because a
 * landscape phone is wide enough for the card and nowhere near tall enough —
 * it gets the full-bleed layout, which is the one that fits.
 *
 * Docked, the card is sized with `min()` against the live viewport rather than
 * pinned to 380x560, so a large `offsetX`/`offsetY` shrinks it instead of
 * pushing its far edge off-screen. Heights use `dvh`, so the composer stays
 * reachable above the on-screen keyboard.
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
        // Full-bleed: a comfortable margin, held off the notch and the home
        // indicator so the header and composer are never under them.
        "top-[calc(0.75rem+var(--wp-safe-t))] bottom-[calc(0.75rem+var(--wp-safe-b))]",
        "left-[calc(0.75rem+var(--wp-safe-l))] right-[calc(0.75rem+var(--wp-safe-r))]",
        // Docked: a card above the launcher, on whichever side it is pinned to.
        // The offset is subtracted once — the panel is anchored to one edge —
        // and 1rem is left as breathing room on the free edge.
        "wp-docked:inset-auto wp-docked:top-auto",
        "wp-docked:w-[min(23.75rem,calc(100vw-var(--wp-offset-x)-var(--wp-safe-l)-var(--wp-safe-r)-1rem))]",
        "wp-docked:h-[min(35rem,calc(100dvh-var(--wp-panel-offset-y)-1rem))]",
        "wp-docked:bottom-[var(--wp-panel-offset-y)] wp-docked:left-[var(--wp-left)] wp-docked:right-[var(--wp-right)]",
        // Room to grow once the display genuinely has it, so the panel doesn't
        // read as a postage stamp on a large monitor.
        "wp-docked-lg:w-[min(25rem,calc(100vw-var(--wp-offset-x)-var(--wp-safe-l)-var(--wp-safe-r)-1rem))]",
        "wp-docked-lg:h-[min(37.5rem,calc(100dvh-var(--wp-panel-offset-y)-1rem))]",
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
