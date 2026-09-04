"use client";

import { useRef } from "react";

import { useAutoGrow } from "@/lib/use-auto-grow";
import { cn } from "@/lib/utils";

/** Roughly ten lines. Past that the field scrolls rather than eating the page. */
const MAX_HEIGHT = 260;

/**
 * The greeting editor.
 *
 * Grows with what you type, so the common case — a few short lines — never
 * shows a scrollbar or a resize grip at all.
 */
export function WelcomeMessageField({ value, onChange }) {
  const ref = useRef(null);
  useAutoGrow(ref, value, MAX_HEIGHT);

  return (
    <div>
      <label htmlFor="wp-welcome-message" className="text-sm font-medium">
        Welcome Message
      </label>
      <textarea
        id="wp-welcome-message"
        ref={ref}
        rows={1}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          "wp-thin-scrollbar mt-2 block w-full resize-none overflow-y-auto rounded-lg",
          "border border-border bg-background px-3.5 py-3 text-sm leading-relaxed",
          "transition-colors focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        )}
      />
      <p className="mt-1.5 text-xs text-muted-foreground">
        Line breaks are kept. Shown in the first bubble when the chat opens.
      </p>
    </div>
  );
}
