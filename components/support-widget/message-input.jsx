"use client";

import { useCallback, useRef, useState } from "react";

import { useAutoGrow } from "@/lib/use-auto-grow";

import { cn } from "@/lib/utils";
import { SendIcon } from "./icons";

const MAX_INPUT_HEIGHT = 120;

/**
 * WhatsApp-style composer.
 *
 * `onSend` takes the trimmed message and returns false when it could not take
 * it — the visitor still owes us their number, say. The draft survives that,
 * so a refused send never costs someone what they typed. With no handler at
 * all (the docked preview) the field simply clears.
 */
export function MessageInput({ inputId, onSend, ref }) {
  const [value, setValue] = useState("");
  const innerRef = useRef(null);
  const canSend = value.trim().length > 0;

  // Grow with the content up to a few lines, then scroll inside the field.
  useAutoGrow(innerRef, value, MAX_INPUT_HEIGHT);

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      if (!canSend) return;
      if (onSend?.(value.trim()) === false) return;
      setValue("");
    },
    [canSend, onSend, value],
  );

  const handleKeyDown = useCallback(
    (event) => {
      // Enter sends, Shift+Enter starts a new line — the messaging convention.
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        event.currentTarget.form?.requestSubmit();
      }
    },
    [],
  );

  const setRefs = useCallback(
    (node) => {
      innerRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="flex shrink-0 items-end gap-2 border-t border-[var(--wp-border)] bg-[var(--wp-panel-bg)] px-3 py-3"
    >
      <label htmlFor={inputId} className="sr-only">
        Type your message
      </label>

      <textarea
        id={inputId}
        ref={setRefs}
        rows={1}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        className={cn(
          "wp-no-scrollbar min-h-11 flex-1 resize-none rounded-xl border border-[var(--wp-border)] bg-[var(--wp-input-bg)] px-3.5 py-2.5",
          "text-sm leading-6 text-[var(--wp-input-fg)] shadow-sm shadow-black/5",
          "placeholder:text-[var(--wp-panel-muted)]",
          "transition-colors focus-visible:border-[var(--wp-launcher-bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--wp-launcher-bg)]",
        )}
      />

      <button
        type="submit"
        disabled={!canSend}
        aria-label="Send message"
        className={cn(
          "grid size-11 shrink-0 place-items-center rounded-xl",
          "bg-[var(--wp-launcher-bg)] text-[var(--wp-launcher-icon)] shadow-sm shadow-black/5",
          "transition-[background-color,opacity,transform] duration-150",
          "hover:bg-[var(--wp-launcher-bg-hover)] active:scale-95",
          "disabled:pointer-events-none disabled:opacity-40",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--wp-launcher-bg)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--wp-panel-bg)]",
        )}
      >
        <SendIcon />
      </button>
    </form>
  );
}
