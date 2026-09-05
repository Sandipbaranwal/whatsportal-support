"use client";

import { useRef } from "react";

import { useAutoGrow } from "@/lib/use-auto-grow";
import { cn } from "@/lib/utils";
import { MAX_WELCOME_LENGTH } from "@/lib/widget-theme";

/** Roughly ten lines. Past that the field scrolls rather than eating the page. */
const MAX_HEIGHT = 260;

/** Where the counter stops being decoration and starts being a warning. */
const NEAR_LIMIT = MAX_WELCOME_LENGTH * 0.9;

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
      <div className="flex items-baseline justify-between">
        <label htmlFor="wp-welcome-message" className="text-sm font-medium">
          Welcome Message
        </label>
        {/* Only meaningful near the cap, but a counter that appears late reads
            as an error — so it is always there and only changes colour. */}
        <span
          className={cn(
            "text-xs tabular-nums",
            value.length >= NEAR_LIMIT
              ? "text-amber-600 dark:text-amber-400"
              : "text-muted-foreground",
          )}
        >
          {value.length}/{MAX_WELCOME_LENGTH}
        </span>
      </div>
      <textarea
        id="wp-welcome-message"
        ref={ref}
        rows={1}
        value={value}
        maxLength={MAX_WELCOME_LENGTH}
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
